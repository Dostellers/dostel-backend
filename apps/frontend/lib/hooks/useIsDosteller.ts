/*
Dosteller status hook that checks if the current user has a valid Dosteller membership tier.
Uses context to access auth data and check against known Dosteller tiers.
*/

import { useAuth } from '@/lib/hooks/auth.hook';
import { dostellerTiers } from '@/lib/data';

export function useIsDosteller() {
  const auth = useAuth();

  // Get the user's current tier ID if authenticated
  const currentTierId = auth.user?.dostellerTierId?.id;

  // Check if the current tier exists in our Dosteller tiers
  const isDosteller = dostellerTiers.some(tier => tier.id === currentTierId);

  return isDosteller;
}


/*
For testing/debugging:
1. Can check auth.user.dostellerTierId in components
2. Verify localStorage items:
   - dostel-membership
   - dostel-tier-
*/