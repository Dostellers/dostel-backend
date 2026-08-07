"use client";

import { useRouter } from "next/navigation";

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
  labels?: [string, string, string];
  basePath: string;
}

const defaultLabels: [string, string, string] = ["Details", "Review", "Payment"];

const stepPaths: Record<number, string> = {
  1: "details",
  2: "review",
  3: "payment",
};

export default function StepIndicator({ currentStep, labels = defaultLabels, basePath }: StepIndicatorProps) {
  const router = useRouter();

  return (
    <nav aria-label="Booking progress" className="w-full">
      <ol className="flex items-center justify-center gap-0">
        {labels.map((label, idx) => {
          const step = (idx + 1) as 1 | 2 | 3;
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <li key={label} className="flex items-center">
              {idx > 0 && (
                <div
                  className={`w-8 h-px sm:w-12 md:w-16 transition-colors duration-250 ${
                    isCompleted ? "bg-forest-500" : "bg-stone-200"
                  }`}
                  aria-hidden="true"
                />
              )}
              <button
                type="button"
                onClick={() => isCompleted && router.push(`${basePath}/${stepPaths[step]}`)}
                disabled={!isCompleted}
                aria-current={isCurrent ? "step" : undefined}
                className={`flex flex-col items-center gap-1 px-2 py-2 transition-all duration-250 ${
                  !isCompleted ? "cursor-default" : "cursor-pointer"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all duration-250 ${
                    isCompleted
                      ? "bg-forest-500 text-white"
                      : isCurrent
                      ? "bg-forest-500 text-white ring-2 ring-forest-100"
                      : "bg-stone-200 text-stone-400"
                  }`}
                >
                  {isCompleted ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    step
                  )}
                </span>
                <span
                  className={`text-xs font-medium whitespace-nowrap transition-colors duration-250 ${
                    isCurrent
                      ? "text-forest-700"
                      : isCompleted
                      ? "text-forest-500"
                      : "text-stone-400"
                  }`}
                >
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="sr-only" role="status">
        Step {currentStep} of 3: {labels[currentStep - 1]}
      </p>
    </nav>
  );
}
