"use client";

import { useState } from "react";
import { SmartphoneIcon, CreditCardIcon, BankIcon } from "./Icons";

type PaymentMethod = "upi" | "card" | "netbanking";

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  loading?: boolean;
}

const methods: { id: PaymentMethod; label: string; icon: React.ReactNode }[] = [
  { id: "upi", label: "UPI (GPay / PhonePe / Paytm)", icon: <SmartphoneIcon className="h-5 w-5" /> },
  { id: "card", label: "Credit / Debit Card", icon: <CreditCardIcon className="h-5 w-5" /> },
  { id: "netbanking", label: "Net Banking", icon: <BankIcon className="h-5 w-5" /> },
];

export default function PaymentMethodSelector({
  selected,
  onChange,
  loading = false,
}: PaymentMethodSelectorProps) {
  const [upiId, setUpiId] = useState("");
  const [upiError, setUpiError] = useState("");

  const validateUpi = (value: string) => {
    if (!value) {
      setUpiError("");
      return;
    }
    const valid = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/.test(value);
    setUpiError(valid ? "" : "Enter a valid UPI ID (e.g. name@okhdfcbank)");
  };

  return (
    <div className="space-y-3" role="radiogroup" aria-label="Payment method">
      {methods.map((method) => {
        const isSelected = selected === method.id;
        return (
          <label
            key={method.id}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all duration-150 ${
              isSelected
                ? "border-forest-500 bg-forest-100/30"
                : "border-stone-200 bg-white hover:border-stone-400"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={isSelected}
              onChange={() => {
                onChange(method.id);
                setUpiError("");
              }}
              className="h-4 w-4 accent-forest-500"
            />
            <span className="text-forest-500 shrink-0">{method.icon}</span>
            <span className="text-sm font-medium text-forest-900">{method.label}</span>
          </label>
        );
      })}

      {selected === "upi" && (
        <div className="pl-8">
          <label htmlFor="upiId" className="mb-1.5 block text-sm font-medium text-forest-900">
            UPI ID
          </label>
          <input
            id="upiId"
            type="text"
            value={upiId}
            onChange={(e) => {
              setUpiId(e.target.value);
              if (upiError) validateUpi(e.target.value);
            }}
            onBlur={() => validateUpi(upiId)}
            className={`w-full rounded-lg border px-4 py-3 text-sm text-forest-900 placeholder:text-stone-400 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-sky ${
              upiError ? "border-error" : "border-stone-200"
            }`}
            placeholder="example@okhdfcbank"
            aria-describedby={upiError ? "upi-error" : undefined}
          />
          {upiError && (
            <p id="upi-error" className="mt-1 text-xs text-error" role="alert">{upiError}</p>
          )}
          <p className="mt-1 text-xs text-stone-400">Or scan QR code on desktop</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || (selected === "upi" && !upiId)}
        className="flex h-12 w-full items-center justify-center rounded-lg bg-sunset text-sm font-semibold text-white transition-all duration-150 active:scale-[0.97] disabled:opacity-45 disabled:cursor-not-allowed hover:brightness-95 focus-visible:outline-2 focus-visible:outline-sky focus-visible:outline-offset-2"
      >
        {loading ? "Processing..." : `Pay`}
      </button>

      <div className="flex flex-wrap justify-center gap-3 text-xs text-stone-400">
        <span className="inline-flex items-center gap-1">Secured by Razorpay</span>
        <span className="inline-flex items-center gap-1">Free cancellation</span>
        <span className="inline-flex items-center gap-1">No booking fees</span>
      </div>
    </div>
  );
}
