"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

type WorkweekBenefit = {
  id: string;
  title: string;
  description: string;
};

interface WorkweekModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEligible: boolean;
  savings?: number;
  originalTotal: number;
  nights: number;
}

const benefits: WorkweekBenefit[] = [
  {
    id: "1",
    title: "20% Discount",
    description: "Flat 20% off total room price for stays of 5+ nights",
  },
  {
    id: "2",
    title: "Meals Included",
    description: "Daily breakfast and welcome tea for all guests",
  },
  {
    id: "3",
    title: "Workspace Setup",
    description: "High-speed WiFi and dedicated desk in your room",
  },
  {
    id: "4",
    title: "Trek Guide",
    description: "Guided local treks and nature walks (seasonal)",
  },
];

export default function WorkweekModal({
  isOpen,
  onClose,
  isEligible,
  savings,
  originalTotal,
  nights,
}: WorkweekModalProps) {
  if (!isOpen) return null;

  const discountAmount = Math.round(originalTotal * 0.2);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 transform-center"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <AnimatePresence mode="wait">
          {isEligible && (
            <motion.div
              key="modal"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
            >
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-stone-900">
                  {savings !== undefined
                    ? `Save ₹${savings} with Workweek!`
                    : "Workweek Benefits"}
                </h2>

                {benefits.map((benefit) => (
                  <div
                    key={benefit.id}
                    className="p-4 rounded-lg bg-stone-50 border border-stone-200"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="flex-shrink-0 w-6 h-6 rounded-lg bg-forest-100 flex items-center justify-center"
                      >
                        <svg
                          className="w-3 h-3 text-forest-600"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-stone-700">{benefit.title}</h3>
                        <p className="text-sm text-stone-500">{benefit.description}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {savings !== undefined && (
                  <div className="pt-4 border-t border-stone-200">
                    <p className="text-lg font-bold text-green-600">
                      Total Savings: ₹{savings}
                    </p>
                  </div>
                )}

                <div className="flex gap-4 pt-6">
                  <button
                    onClick={() => onClose()}
                    className="flex-1 rounded-lg bg-stone-200 px-4 py-2 text-sm text-stone-700 hover:bg-stone-100 transition-colors"
                  >
                    Learn More
                  </button>
                  <button
                    onClick={() => onClose()}
                    className="flex-1 rounded-lg bg-sunset px-4 py-2 text-sm font-medium text-white hover:brightness-95 transition-all"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {!isEligible && (
            <motion.div
              key="not-eligible"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
            >
              <p className="text-center text-stone-600 text-lg">
                Workweek discount requires a stay of 5+ nights
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}