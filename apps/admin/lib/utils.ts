/* Callers: apps/admin/components/ui/card.tsx, button.tsx, input.tsx,
   and apps/admin/components/PageHeader.tsx — all import { cn } from '@/lib/utils'.
   No existing apps/admin/lib/utils.ts; clsx/tailwind-merge are not in package.json.
   Schema: none (pure string helper).
   User: "review and build admin dashboard end to end in dostellers colors.
   Also use skills /frontend-design /ui-ux-pro-max" */

export function cn (...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}
