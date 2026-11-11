'use client'

/**
 * Existing modal checkout used by apps/frontend/src/pages/BookingPage.tsx.
 * Was syntactically broken; repaired + shows Hostelworld deposit split.
 * No other modal wizard for this path. Reads BookingState.
 * User: "learn architecture and payment methods and architeuse from hostel world and build it.
 * Also can we bring more design elements and enahncements and other design skills to make it better."
 */

import { useState } from 'react'
import { useBooking } from './BookingProvider'
import GuestDetailsForm from './GuestDetailsForm'
import PaymentMethodSelector from './PaymentMethodSelector'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

interface CheckoutWizardProps {
  isOpen: boolean
  onClose: () => void
}

type Step = 'guest-info' | 'payment' | 'success'

export default function CheckoutWizard ({ isOpen, onClose }: CheckoutWizardProps) {
  const [step, setStep] = useState<Step>('guest-info')
  const [method, setMethod] = useState<'upi' | 'card' | 'netbanking'>('upi')
  const { state, actions } = useBooking()
  const amountDue = state.depositDue || state.total

  if (!isOpen) return null

  async function handleProcessPayment () {
    actions.setPaymentMethod(method)
    await new Promise((r) => setTimeout(r, 800))
    actions.confirmBooking()
    setStep('success')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-1000/50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="p-6">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 text-stone-400 hover:text-stone-600"
            aria-label="Close"
          >
            ✕
          </button>

          <AnimatePresence mode="wait">
            {step === 'guest-info' && (
              <motion.div
                key="guest-info"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-stone-900">Guest Details</h2>
                  <p className="text-sm text-stone-500">Please provide your information to proceed.</p>
                </div>
                <GuestDetailsForm onNext={() => setStep('payment')} />
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div
                key="payment"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-stone-900">Payment</h2>
                  <p className="text-sm text-stone-500">
                    {state.rateLabel || 'Deposit'} · balance due at property unless Pay Now.
                  </p>
                </div>

                <div className="rounded-lg bg-coral-50 p-4 space-y-1">
                  <div className="flex justify-between text-sm text-stone-600">
                    <span>Pay now</span>
                    <span className="font-bold text-coral-700">₹{amountDue.toLocaleString('en-IN')}</span>
                  </div>
                  {state.payAtProperty > 0 && (
                    <div className="flex justify-between text-xs text-stone-500">
                      <span>Due at property</span>
                      <span>₹{state.payAtProperty.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>

                <PaymentMethodSelector
                  selected={method}
                  onChange={setMethod}
                  amountDue={amountDue}
                  payAtProperty={state.payAtProperty}
                />

                <button
                  type="button"
                  onClick={handleProcessPayment}
                  className="flex w-full items-center justify-center rounded-lg bg-sunset py-3 text-sm font-semibold text-white transition-all hover:brightness-95"
                >
                  Pay ₹{amountDue.toLocaleString('en-IN')}
                </button>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center py-10 text-center"
              >
                <CheckCircleIcon className="h-16 w-16 text-green-500" />
                <h2 className="mt-4 text-2xl font-bold text-stone-900">Booking Confirmed!</h2>
                <p className="mt-2 text-stone-500">We've sent your confirmation to your email.</p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-8 rounded-lg bg-stone-900 px-8 py-2 text-sm font-medium text-white"
                >
                  Done
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
