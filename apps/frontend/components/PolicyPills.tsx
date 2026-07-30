import { FC } from 'react';

interface PolicyPillProps {
  label: string;
  variant?: 'default' | 'important';
}

interface PolicyPillsProps {
  policies: Array<{
    label: string;
    variant?: 'default' | 'important';
  }>;
}

const PolicyPills: FC<PolicyPillsProps> = ({ policies }) => {
  return (
    <div className="flex flex-col gap-2 md:flex-row mb-4">
      {policies.map((policy, index) => (
        <div
          key={index}
          className={`flex items-center h-11 px-4 text-sm font-medium transition-[filter] duration-150 ease-in-out pill`}
          style={{
            borderRadius: 'var(--ds-radius-md)',
            backgroundColor: 
              policy.variant === 'important' 
                ? 'var(--ds-color-sunset)' 
                : 'var(--ds-color-stone-200)',
            color: 
              policy.variant === 'important' 
                ? 'var(--ds-color-white)' 
                : 'var(--ds-color-stone-600)',
          }}
        >
          {policy.label}
        </div>
      ))}
      <style jsx>{`
        .pill:hover {
          filter: brightness(0.96);
        }
        @media (prefers-reduced-motion: reduce) {
          .pill:hover {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
};

export default PolicyPills;