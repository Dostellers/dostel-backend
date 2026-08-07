"""Build + validate the Dostel palette from the logo seeds.

Scales are generated in OKLCH so steps are perceptually even, then every
pair we actually ship is checked against WCAG 2.1 contrast.
"""
import math

# ---------- colour maths ----------

def srgb_to_lin(c):
    c = c / 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def lin_to_srgb(c):
    v = 12.92 * c if c <= 0.0031308 else 1.055 * (c ** (1 / 2.4)) - 0.055
    return max(0, min(255, round(v * 255)))

def rgb_to_oklch(r, g, b):
    lr, lg, lb = srgb_to_lin(r), srgb_to_lin(g), srgb_to_lin(b)
    l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb
    m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb
    s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb
    l_, m_, s_ = l ** (1/3), m ** (1/3), s ** (1/3)
    L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_
    a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_
    bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
    C = math.hypot(a, bb)
    H = math.degrees(math.atan2(bb, a)) % 360
    return L, C, H

def oklch_to_rgb(L, C, H):
    a = C * math.cos(math.radians(H))
    bb = C * math.sin(math.radians(H))
    l_ = L + 0.3963377774 * a + 0.2158037573 * bb
    m_ = L - 0.1055613458 * a - 0.0638541728 * bb
    s_ = L - 0.0894841775 * a - 1.2914855480 * bb
    l, m, s = l_ ** 3, m_ ** 3, s_ ** 3
    lr =  4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
    lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
    lb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    return lin_to_srgb(lr), lin_to_srgb(lg), lin_to_srgb(lb)

def hexs(rgb):
    return '#%02X%02X%02X' % rgb

def parse(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def luminance(rgb):
    r, g, b = (srgb_to_lin(c) for c in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def contrast(a, b):
    la, lb = luminance(a), luminance(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)

# ---------- seeds straight off the logo ----------

CORAL  = parse('#F54E4E')   # 1.91% + 1.41% of opaque pixels
YELLOW = parse('#FCCC00')   # 2.86% + 1.94%
INK    = parse('#000000')   # 1.46%

def scale(seed, steps):
    """Generate a tonal ramp holding the seed's hue, easing chroma at the ends."""
    _, C0, H = rgb_to_oklch(*seed)
    out = {}
    for name, L in steps.items():
        # chroma peaks mid-ramp and falls off toward white/black so tints
        # don't turn muddy and shades don't clip out of sRGB
        k = 1 - abs(L - 0.62) / 0.62
        C = C0 * max(0.10, min(1.0, k * 1.18))
        out[name] = hexs(oklch_to_rgb(L, C, H))
    return out

CORAL_STEPS  = {50:0.972, 100:0.936, 200:0.878, 300:0.800, 400:0.712,
                500:0.646, 600:0.566, 700:0.478, 800:0.396, 900:0.312, 950:0.222}
YELLOW_STEPS = {50:0.980, 100:0.958, 200:0.922, 300:0.884, 400:0.856,
                500:0.828, 600:0.716, 700:0.596, 800:0.492, 900:0.402, 950:0.288}
INK_STEPS    = {0:1.000, 50:0.984, 100:0.958, 200:0.912, 300:0.848, 400:0.740,
                500:0.640, 600:0.540, 700:0.436, 800:0.330, 900:0.228, 950:0.148, 1000:0.000}

coral  = scale(CORAL, CORAL_STEPS)
yellow = scale(YELLOW, YELLOW_STEPS)
# neutrals: hold a trace of the coral hue so greys feel related, not dead
_, _, CH = rgb_to_oklch(*CORAL)
ink = {k: hexs(oklch_to_rgb(L, 0.0 if k in (0, 1000) else 0.006, CH))
       for k, L in INK_STEPS.items()}
ink[1000] = '#0B0B0C'   # near-black with a hair of warmth, never pure #000
ink[0]    = '#FFFFFF'

for label, s in (('CORAL', coral), ('YELLOW', yellow), ('INK', ink)):
    print(f'\n--- {label} ---')
    for k, v in s.items():
        on_white = contrast(parse(v), (255, 255, 255))
        on_ink   = contrast(parse(v), parse(ink[1000]))
        print(f'  {label.lower()}-{k:<4} {v}   vs white {on_white:5.2f}:1   vs ink {on_ink:5.2f}:1')

print('\n\n=== SHIPPED PAIRS (WCAG 2.1) ===')
PAPER = '#FFFDF9'   # warm paper ground, not clinical white
pairs = [
    ('body text',        ink[900],   PAPER,      4.5),
    ('display / heading',ink[1000],  PAPER,      4.5),
    ('muted text',       ink[600],   PAPER,      4.5),
    ('link / brand text',coral[700], PAPER,      4.5),
    ('primary CTA',      '#FFFFFF',  coral[600], 4.5),
    ('accent CTA',       ink[1000],  yellow[400],4.5),
    ('accent CTA alt',   ink[1000],  yellow[300],4.5),
    ('coral tint chip',  coral[800], coral[50],  4.5),
    ('yellow tint chip', ink[900],   yellow[100],4.5),
    ('border vs paper',  ink[200],   PAPER,      1.0),
    ('focus ring',       coral[600], PAPER,      3.0),
    ('logo coral as UI', hexs(CORAL),PAPER,      3.0),
]
worst = []
for name, fg, bg, target in pairs:
    r = contrast(parse(fg), parse(bg))
    ok = 'PASS' if r >= target else 'FAIL'
    if r < target:
        worst.append(name)
    print(f'  {ok}  {name:<20} {fg} on {bg}  = {r:5.2f}:1  (need {target})')

print('\nFAILING:', worst or 'none')
