"use client";

import { useState, useCallback, useRef } from "react";

interface GuestInfo {
  fullName: string;
  email: string;
  phone: string;
  specialRequests?: string;
  govtIdType?: string;
  govtIdNumber?: string;
}

interface GuestDetailsFormProps {
  onSubmit: (data: GuestInfo) => void;
  initialData?: GuestInfo;
  loading?: boolean;
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (!digits) return "";
  if (digits.length <= 5) return `+91 ${digits}`;
  return `+91 ${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const STORAGE_KEY = "dostel-guest-draft";

function loadSavedData(initialData?: GuestInfo): GuestInfo {
  if (initialData) return initialData;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { fullName: "", email: "", phone: "", specialRequests: "", ...JSON.parse(saved) };
  } catch {}
  return { fullName: "", email: "", phone: "", specialRequests: "" };
}

export default function GuestDetailsForm({ onSubmit, initialData, loading = false }: GuestDetailsFormProps) {
  const [form, setForm] = useState<GuestInfo>(() => loadSavedData(initialData));
  const [errors, setErrors] = useState<Partial<Record<keyof GuestInfo, string>>>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const persistRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const formRef = useRef<HTMLFormElement>(null);

  const persist = useCallback((data: GuestInfo) => {
    clearTimeout(persistRef.current);
    persistRef.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, 500);
  }, []);

  const validateField = useCallback((field: keyof GuestInfo, value: string) => {
    let error = "";
    if (field === "fullName" && !value.trim()) error = "Full name is required";
    if (field === "email" && !value.trim()) error = "Email is required";
    else if (field === "email" && !validateEmail(value)) error = "Enter a valid email address";
    if (field === "phone" && value.replace(/\D/g, "").length < 10) error = "Enter a valid 10-digit phone number";
    setErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  }, []);

  const updateField = useCallback(
    (field: keyof GuestInfo, value: string) => {
      setForm((prev) => {
        const next = { ...prev, [field]: value };
        if (field === "phone") {
          next.phone = formatPhone(value);
        }
        persist(next);
        return next;
      });
      if (touched.has(field)) {
        validateField(field, value);
      }
    },
    [touched, persist, validateField]
  );

  const handleBlur = useCallback(
    (field: keyof GuestInfo) => {
      setTouched((prev) => new Set(prev).add(field));
      validateField(field, form[field] || "");
    },
    [form, validateField]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const fields: (keyof GuestInfo)[] = ["fullName", "email", "phone"];
      const newErrors: Partial<Record<keyof GuestInfo, string>> = {};
      let valid = true;

      for (const f of fields) {
        const val = form[f] || "";
        if (!val.trim()) {
          newErrors[f] = `${f === "fullName" ? "Full name" : f.charAt(0).toUpperCase() + f.slice(1)} is required`;
          valid = false;
        }
        if (f === "email" && val && !validateEmail(val)) {
          newErrors[f] = "Enter a valid email address";
          valid = false;
        }
      }

      setErrors(newErrors);
      setTouched(new Set(["fullName", "email", "phone"]));

      if (!valid) {
        const firstError = formRef.current?.querySelector("[data-error]") as HTMLElement;
        firstError?.focus();
        return;
      }

      onSubmit(form);
    },
    [form, onSubmit]
  );

  const inputClass = (field: keyof GuestInfo) =>
    `w-full rounded-lg border px-4 py-3 text-sm text-forest-900 placeholder:text-stone-400 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-sky focus-visible:outline-offset-0 ${
      errors[field] && touched.has(field)
        ? "border-error"
        : "border-stone-200"
    }`;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-forest-900">
          Full name <span className="text-error">*</span>
        </label>
        <input
          id="fullName"
          type="text"
          value={form.fullName}
          onChange={(e) => updateField("fullName", e.target.value)}
          onBlur={() => handleBlur("fullName")}
          className={inputClass("fullName")}
          placeholder="Rahul Sharma"
          autoComplete="name"
          aria-required="true"
          aria-describedby={errors.fullName ? "fullName-error" : undefined}
          data-error={errors.fullName ? true : undefined}
        />
        {errors.fullName && touched.has("fullName") && (
          <p id="fullName-error" className="mt-1 text-xs text-error" role="alert">{errors.fullName}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-forest-900">
          Email <span className="text-error">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
          onBlur={() => handleBlur("email")}
          className={inputClass("email")}
          placeholder="rahul@email.com"
          autoComplete="email"
          aria-required="true"
          aria-describedby={errors.email ? "email-error" : undefined}
          data-error={errors.email ? true : undefined}
        />
        {errors.email && touched.has("email") && (
          <p id="email-error" className="mt-1 text-xs text-error" role="alert">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-forest-900">
          Phone <span className="text-error">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          value={form.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          onBlur={() => handleBlur("phone")}
          className={inputClass("phone")}
          placeholder="+91 XXXXX-XXXXX"
          autoComplete="tel"
          aria-required="true"
          aria-describedby={errors.phone ? "phone-error" : undefined}
          data-error={errors.phone ? true : undefined}
        />
        {errors.phone && touched.has("phone") && (
          <p id="phone-error" className="mt-1 text-xs text-error" role="alert">{errors.phone}</p>
        )}
      </div>

      <div>
        <label htmlFor="specialRequests" className="mb-1.5 block text-sm font-medium text-forest-900">
          Special requests <span className="text-stone-400">(optional)</span>
        </label>
        <textarea
          id="specialRequests"
          value={form.specialRequests || ""}
          onChange={(e) => {
            if (e.target.value.length <= 500) updateField("specialRequests", e.target.value);
          }}
          className="w-full rounded-lg border border-stone-200 px-4 py-3 text-sm text-forest-900 placeholder:text-stone-400 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-sky resize-none"
          placeholder="Any special requests or requirements..."
          rows={3}
          maxLength={500}
          aria-describedby="char-count"
        />
        <p id="char-count" className="mt-1 text-xs text-stone-400 text-right">
          {(form.specialRequests || "").length}/500
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex h-12 w-full items-center justify-center rounded-lg bg-sunset text-sm font-semibold text-white transition-all duration-150 active:scale-[0.97] disabled:opacity-45 disabled:cursor-not-allowed hover:brightness-95 focus-visible:outline-2 focus-visible:outline-sky focus-visible:outline-offset-2"
      >
        {loading ? "Saving..." : "Continue to review"}
      </button>
    </form>
  );
}
