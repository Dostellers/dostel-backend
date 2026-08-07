import { describe, expect, it, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// Tests the artifact that actually ships, not a re-implementation of its logic.
// The inline script is the product here — a copy in a lib module could drift.
const HTML_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../public/portal/index.html"
);
const html = readFileSync(HTML_PATH, "utf8");

/**
 * Flush pending promise callbacks.
 *
 * A macrotask, not a counted number of microtask hops: the success path goes
 * through more `.then` links than the failure path, so hop-counting silently
 * under-waits on exactly the cases most worth testing. Short enough that the
 * page's own 700ms and 15s timers stay unfired.
 */
const tick = () => new Promise((r) => setTimeout(r, 0));

/**
 * Boot the portal page with a scripted fetch.
 * `handlers` maps "GET"/"POST" to a function returning {status, body} or throwing.
 */
function boot({ search = "", handlers = {} } = {}) {
  const calls = [];

  const dom = new JSDOM(html, {
    url: "http://192.168.1.1:3001/portal/" + search,
    runScripts: "dangerously",
    pretendToBeVisual: true,
    beforeParse(window) {
      window.fetch = (url, options = {}) => {
        const method = options.method || "GET";
        calls.push({
          url,
          method,
          body: options.body ? JSON.parse(options.body) : null,
        });

        const handler = handlers[method];
        if (!handler) return Promise.reject(new TypeError("Failed to fetch"));

        let result;
        try {
          result = handler({ url, body: options.body ? JSON.parse(options.body) : null });
        } catch (err) {
          return Promise.reject(err);
        }

        const status = result.status ?? 200;
        return Promise.resolve({
          ok: status >= 200 && status < 300,
          status,
          json: () => Promise.resolve(result.body ?? {}),
        });
      };
    },
  });

  return { dom, window: dom.window, doc: dom.window.document, calls };
}

const visible = (doc, id) => !doc.getElementById(id).hidden;

function fillForm(doc, values = {}) {
  const set = (id, v) => {
    if (v !== undefined) doc.getElementById(id).value = v;
  };
  set("fullName", values.fullName);
  set("phone", values.phone);
  set("email", values.email);
  set("country", values.country);
  set("stayPurpose", values.stayPurpose);

  const check = (id, v) => {
    if (v !== undefined) doc.getElementById(id).checked = v;
  };
  check("c-network", values.network);
  check("c-marketing", values.marketing);
  check("c-whatsapp", values.whatsapp);
}

function submit(window, doc) {
  doc.getElementById("signup").dispatchEvent(
    new window.Event("submit", { bubbles: true, cancelable: true })
  );
}

const okSession = (body) => ({ status: 200, body });

describe("walled-garden invariant", () => {
  // The guest has no internet when this page renders. Any external reference
  // hangs the page and strands them offline — this is the one rule that must
  // never regress.
  it("makes no external requests", () => {
    const external = html.match(/(?:src|href)\s*=\s*["'](?!#|\/portal\/)[^"']*\/\/[^"']*/gi);
    expect(external).toBeNull();
  });

  it("loads no webfonts", () => {
    expect(/@import\s+url|fonts\.googleapis|fonts\.gstatic|@font-face/i.test(html)).toBe(false);
  });

  it("inlines all styles and scripts", () => {
    expect(/<link[^>]+rel=["']stylesheet/i.test(html)).toBe(false);
    expect(/<script[^>]+src=/i.test(html)).toBe(false);
  });
});

describe("session start", () => {
  it("shows the form for an unrecognised device", async () => {
    const { doc } = boot({
      handlers: { GET: () => okSession({ sessionId: "s1", returning: false }) },
    });
    await tick();

    expect(visible(doc, "view-form")).toBe(true);
    expect(visible(doc, "view-loading")).toBe(false);
    expect(visible(doc, "view-returning")).toBe(false);
  });

  it("greets a returning device by first name and skips the form", async () => {
    const { doc } = boot({
      handlers: {
        GET: () =>
          okSession({
            sessionId: "s2",
            returning: true,
            greetingName: "Priya Raman",
            grant: { sessionId: "s2", signature: "abc", expiresAt: "2026-08-08T00:00:00Z" },
          }),
      },
    });
    await tick();

    expect(visible(doc, "view-returning")).toBe(true);
    expect(visible(doc, "view-form")).toBe(false);
    expect(doc.getElementById("welcome-back").textContent).toBe("Welcome back, Priya");
  });

  it("forwards router context to the backend", async () => {
    const { calls } = boot({
      search: "?mac=AA:BB:CC:DD:EE:FF&ap=11:22:33&ssid=Dostel",
      handlers: { GET: () => okSession({ sessionId: "s3", returning: false }) },
    });
    await tick();

    expect(calls[0].url).toContain("mac=AA%3ABB%3ACC%3ADD%3AEE%3AFF");
    expect(calls[0].url).toContain("ap=11%3A22%3A33");
    expect(calls[0].url).toContain("ssid=Dostel");
  });

  it("still shows the form when the backend is unreachable", async () => {
    // Backend down must not mean "no wifi for anyone" — the guest fills the
    // form and the submission queues.
    const { doc } = boot({ handlers: {} });
    await tick();

    expect(visible(doc, "view-form")).toBe(true);
  });
});

describe("validation", () => {
  let ctx;
  beforeEach(async () => {
    ctx = boot({
      handlers: {
        GET: () => okSession({ sessionId: "s1", returning: false }),
        POST: () => okSession({ sessionId: "s1", customerId: "c1", isNew: true }),
      },
    });
    await tick();
  });

  it("requires a name", async () => {
    fillForm(ctx.doc, { phone: "9876543210", network: true });
    submit(ctx.window, ctx.doc);
    await tick();

    expect(ctx.doc.getElementById("form-status").textContent).toBe("Please tell us your name.");
    expect(ctx.calls.filter((c) => c.method === "POST")).toHaveLength(0);
  });

  it("requires either a phone or an email", async () => {
    fillForm(ctx.doc, { fullName: "Marco", network: true });
    submit(ctx.window, ctx.doc);
    await tick();

    expect(ctx.doc.getElementById("form-status").textContent).toContain("phone number or an email");
    expect(ctx.calls.filter((c) => c.method === "POST")).toHaveLength(0);
  });

  it("accepts email alone, without a phone", async () => {
    fillForm(ctx.doc, { fullName: "Marco", email: "marco@example.com", network: true });
    submit(ctx.window, ctx.doc);
    await tick();

    const post = ctx.calls.find((c) => c.method === "POST");
    expect(post).toBeTruthy();
    expect(post.body.email).toBe("marco@example.com");
    expect(post.body.phone).toBeNull();
  });

  it("requires the network terms", async () => {
    fillForm(ctx.doc, { fullName: "Marco", phone: "9876543210", network: false });
    submit(ctx.window, ctx.doc);
    await tick();

    expect(ctx.doc.getElementById("form-status").textContent).toContain("accept the WiFi terms");
    expect(ctx.calls.filter((c) => c.method === "POST")).toHaveLength(0);
  });
});

describe("consent (DPDP Act 2023)", () => {
  it("connects a guest who declines marketing and WhatsApp", async () => {
    // The compliance requirement: optional consents must be genuinely
    // declinable without costing the guest network access.
    const ctx = boot({
      handlers: {
        GET: () => okSession({ sessionId: "s1", returning: false }),
        POST: () => okSession({ sessionId: "s1", customerId: "c1", isNew: true }),
      },
    });
    await tick();

    fillForm(ctx.doc, {
      fullName: "Marco",
      phone: "9876543210",
      network: true,
      marketing: false,
      whatsapp: false,
    });
    submit(ctx.window, ctx.doc);
    await tick();

    const post = ctx.calls.find((c) => c.method === "POST");
    expect(post.body.consents).toEqual({
      network_terms: true,
      marketing: false,
      whatsapp_community: false,
    });
    expect(visible(ctx.doc, "view-done")).toBe(true);
  });

  it("records each granted consent separately", async () => {
    const ctx = boot({
      handlers: {
        GET: () => okSession({ sessionId: "s1", returning: false }),
        POST: () => okSession({ sessionId: "s1" }),
      },
    });
    await tick();

    fillForm(ctx.doc, {
      fullName: "Priya",
      phone: "9876543210",
      network: true,
      marketing: true,
      whatsapp: false,
    });
    submit(ctx.window, ctx.doc);
    await tick();

    const post = ctx.calls.find((c) => c.method === "POST");
    expect(post.body.consents.marketing).toBe(true);
    expect(post.body.consents.whatsapp_community).toBe(false);
  });

  it("defaults optional consents to unchecked", async () => {
    const { doc } = boot({
      handlers: { GET: () => okSession({ sessionId: "s1", returning: false }) },
    });
    await tick();

    expect(doc.getElementById("c-marketing").checked).toBe(false);
    expect(doc.getElementById("c-whatsapp").checked).toBe(false);
  });
});

describe("offline queue", () => {
  it("queues the submission and reassures the guest when the backend is down", async () => {
    const ctx = boot({
      handlers: { GET: () => okSession({ sessionId: "s1", returning: false }) },
      // No POST handler -> network rejection.
    });
    await tick();

    fillForm(ctx.doc, { fullName: "Marco", phone: "9876543210", network: true });
    submit(ctx.window, ctx.doc);
    await tick();

    expect(visible(ctx.doc, "view-queued")).toBe(true);

    const queued = JSON.parse(ctx.window.localStorage.getItem("dostel.portal.queue.v1"));
    expect(queued).toHaveLength(1);
    expect(queued[0].fullName).toBe("Marco");
    expect(queued[0].submissionKey).toBeTruthy();
  });

  it("attaches a unique submission key so a replay cannot double-register", async () => {
    const ctx = boot({
      handlers: {
        GET: () => okSession({ sessionId: "s1", returning: false }),
        POST: () => okSession({ sessionId: "s1" }),
      },
    });
    await tick();

    fillForm(ctx.doc, { fullName: "Marco", phone: "9876543210", network: true });
    submit(ctx.window, ctx.doc);
    await tick();

    const post = ctx.calls.find((c) => c.method === "POST");
    expect(post.body.submissionKey).toBeTruthy();
    expect(typeof post.body.submissionKey).toBe("string");
  });

  it("surfaces a server-side error instead of silently queueing it", async () => {
    // A 400 is our fault or the guest's, not the network's. Queueing and
    // retrying it forever would hide a real problem.
    const ctx = boot({
      handlers: {
        GET: () => okSession({ sessionId: "s1", returning: false }),
        POST: () => ({ status: 400, body: { error: "A name and either a phone number or email are required." } }),
      },
    });
    await tick();

    fillForm(ctx.doc, { fullName: "Marco", phone: "9876543210", network: true });
    submit(ctx.window, ctx.doc);
    await tick();

    expect(visible(ctx.doc, "view-queued")).toBe(false);
    expect(ctx.doc.getElementById("form-status").textContent).toContain("required");
    expect(ctx.window.localStorage.getItem("dostel.portal.queue.v1")).toBeNull();
    // The guest must be able to correct and retry.
    expect(ctx.doc.getElementById("submit").disabled).toBe(false);
  });
});
