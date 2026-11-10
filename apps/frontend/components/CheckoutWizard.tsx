"use client";

import { useState } from "react";
import { useBooking } from "./BookingProvider";
import GuestDetailsForm from "./GuestDetailsForm";
import PaymentMethodSelector from "./PaymentMethodSelector";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

interface CheckoutWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "guest-info" | "payment" | "success";

export default function CheckoutWizard({ isOpen, onClose }: CheckoutWizardProps) {
  const [step, setStep] = useState<Step>("guest-info");
  const { state, actions } = useBooking();

  const handleNextStep = (nextStep: Step) => {
    setStep(nextStep);
  };

const handleProcessPayment = async (method: string) => {
    try {
      setStep("success");
    } catch (error) {
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="p-6">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-stone-400 hover:text-stone-600"
          >
            ✕
          </button>

          <AnimatePresence mode="wait">
            {step === "guest-info" && (
              <motion.div
                key="guest-info"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className: text-2xl font-bold text-stone-900">Guest Details</h2>
                  <p className="text-sm text-stone-500">Please provide your information to proceed.</p>
                </div>
                <GuestDetailsForm 
                  onNext={() => handleNextStep("payment")} 
                />
              </motion.div>
            )}

            {step === "payment" && (
              <motion.div
                key="payment"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-stone-900">Payment</h2>
                  <p className="text-sm text-stone-500">Review your total and select a method.</p>
                </div>
                
                <div className="rounded-lg bg-stone-50 p-4">
                   <div className="flex justify-between text-sm text-stone-600">
                     <span>Total to pay</span>
                     <span className="font-bold text-stone-900">₹{state.total}</span>
                   </div>
                </div>

                <PaymentMethodSelector 
                  selected="upi" 
                  onChange={() => {}} 
                />

                <button
                  onClick={() => handleProcessPayment("method")}
                  className="flex w-full items-center justify-center rounded-lg bg-sunset py-3 text-sm font-semibold text-white transition-all hover:brightness-95"
                >
                  Pay ₹{state.total}
                </button>
              </motion.div>
            )}

            {step === "success" && (
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
  );
}
