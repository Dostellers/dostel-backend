'use client'

/**
 * Hostelworld-style rate picker.
 *
 * Callers: apps/frontend/app/booking/[slug]/review/page.tsx (rate step UI).
 * No existing component lists deposit vs pay-at-property offers.
 * Schema: RateOffer[] in, RateType out via onSelect.
 *
 * User instruction: "learn architecture and payment methods and architeuse from hostel world and build it. Also can we bring more design elements and enahncements ..."
 */

import type { RateOffer, RateType } from '@/lib/rate-plans'

interface RatePlanSelectorProps {
  offers: RateOffer[]
  selected: RateType
  onSelect: (rateType: RateType) => void
}

function toneClass (tone: RateOffer['badgeTone'], selected: boolean) {
  if (selected) return 'border-coral-600 bg-coral-50/60 ring-1 ring-coral-600/30'
  if (tone === 'positive') return 'border-success/30 bg-white hover:border-success/60'
  if (tone === 'informative') return 'border-sky/30 bg-white hover:border-sky/60'
  return 'border-stone-200 bg-white hover:border-stone-400'
}

export default function RatePlanSelector ({ offers, selected, onSelect }: RatePlanSelectorProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="font-heading text-base font-semibold text-forest-900">
        Choose your rate
      </legend>
      <p className="text-sm text-stone-600">
        Pay 5–10% now to hold the bed. Rest at the hostel — unless you Pay Now.
      </p>

      <div className="space-y-3" role="radiogroup" aria-label="Rate plan">
        {offers.map((offer) => {
          const isSelected = selected === offer.rateType
          return (
            <label
              key={offer.rateType}
              className={`block cursor-pointer rounded-xl border-2 p-4 transition-all duration-150 ${toneClass(offer.badgeTone, isSelected)}`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="ratePlan"
                  value={offer.rateType}
                  checked={isSelected}
                  onChange={() => onSelect(offer.rateType)}
                  className="mt-1 h-4 w-4 accent-coral-600"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-forest-900">{offer.label}</span>
                    {offer.savingsVsBase > 0 && (
                      <span className="tag">Save ₹{offer.savingsVsBase.toLocaleString('en-IN')}</span>
                    )}
                    {offer.refundable && (
                      <span className="stamp text-success border-success/40">Refundable</span>
                    )}
                    {!offer.refundable && (
                      <span className="stamp text-warning border-warning/40">Non-refundable</span>
                    )}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-stone-600">{offer.description}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
                    <div className="rounded-lg bg-ink-50 px-3 py-2">
                      <p className="text-stone-400">Stay total</p>
                      <p className="font-data font-semibold text-forest-900">
                        ₹{offer.totalAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="rounded-lg bg-coral-50 px-3 py-2">
                      <p className="text-stone-400">Pay now</p>
                      <p className="font-data font-semibold text-coral-700">
                        ₹{offer.depositRequired.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="col-span-2 rounded-lg bg-ink-50 px-3 py-2 sm:col-span-1">
                      <p className="text-stone-400">
                        {offer.payNow ? 'On arrival' : 'Due at property'}
                      </p>
                      <p className="font-data font-semibold text-forest-900">
                        {offer.payAtProperty > 0
                          ? `₹${offer.payAtProperty.toLocaleString('en-IN')}`
                          : '₹0'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
