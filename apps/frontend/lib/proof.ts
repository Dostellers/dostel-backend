/**
 * Terrain-aware proof card config (DOS-503, brand-platform.md §4a).
 *
 * Dostel is a network across eight very different addresses. The proof card is
 * the core trust primitive, so it cannot be written in mountain language — a
 * carrier-signal row and "know before you climb" are right for Vattakanal and
 * absurd for Delhi Airport.
 *
 * One contract everywhere: what was checked, when, by what method, and where we
 * have no reading. Only the checks and the headline vary by terrain.
 *
 * The honesty rule from lib/reliability-display.ts holds at every terrain:
 * `reading: null` renders as "not measured", never as an invented number.
 */

export type Terrain =
  | 'mountains'
  | 'beach'
  | 'city'
  | 'jungle'
  | 'heritage'
  | 'workation';

export type ProofCheck = {
  id: string;
  /** Key into the icon map in the consuming component. */
  icon: 'wifi' | 'bolt' | 'signal' | 'cloud' | 'boot' | 'user' | 'transit' | 'water' | 'noise';
  label: string;
  /** null → renders as "not measured yet". Never invent a figure. */
  reading: string | null;
  detail: string | null;
  method: string;
  body: string;
};

export type ProofConfig = {
  eyebrow: string;
  headline: string;
  intro: string;
  checks: ProofCheck[];
};

/* Checks shared by every property in the network. Neither has an
   operator-validated reading yet, so both publish as "not measured". */
const wifi: ProofCheck = {
  id: 'wifi',
  icon: 'wifi',
  label: 'Wi-Fi',
  reading: null,
  detail: null,
  method: 'Median of 3 speed tests at the common-room router, non-peak.',
  body: 'Evening peak dips but should stay usable for calls.',
};

const power: ProofCheck = {
  id: 'power',
  icon: 'bolt',
  label: 'Power backup',
  reading: null,
  detail: null,
  method: 'Generator or inverter auto-switch coverage for common areas and the router.',
  body: 'Hot water runs on a separate heater at most properties.',
};

const staffed: ProofCheck = {
  id: 'host',
  icon: 'user',
  label: 'Who is on site',
  reading: 'Staffed 24/7',
  detail: 'People who live here, not a night desk',
  method: 'Permanent on-site team.',
  body: 'They know the area and will point you somewhere better than the guidebook.',
};

const TERRAIN: Record<Terrain, ProofConfig> = {
  mountains: {
    eyebrow: 'Verified hill stay',
    headline: 'Know before you climb',
    intro:
      'Mountains break things. Rather than list amenities, we publish how each one was checked — and say plainly where we do not yet have a reading.',
    checks: [
      wifi,
      power,
      {
        id: 'signal', icon: 'signal', label: 'Mobile signal',
        reading: 'Jio · Airtel reliable', detail: 'BSNL patchy above 1,800 m',
        method: 'Observed at reception on 4G LTE. Varies by room and building.',
        body: 'Carry two SIMs if you depend on mobile data as a backup.',
      },
      {
        id: 'weather', icon: 'cloud', label: 'Weather',
        reading: 'Cool and misty', detail: 'Clearest views in the morning',
        method: 'Seasonal range for the region, not a live reading.',
        body: 'Afternoon rain is common. Bring a raincoat; umbrellas lose to the wind.',
      },
      {
        id: 'access', icon: 'boot', label: 'Getting here',
        reading: 'Steep final approach', detail: 'On foot from the road head',
        method: 'Walked and timed by staff.',
        body: 'Pack so you can carry it uphill. Shared jeeps run from the bus stand.',
      },
      staffed,
    ],
  },

  beach: {
    eyebrow: 'Verified coast stay',
    headline: 'Know before you go',
    intro:
      'Salt, monsoon and load-shedding are the honest variables on the coast. We publish how each was checked — and where we have no reading, we say so.',
    checks: [
      wifi,
      power,
      {
        id: 'water', icon: 'water', label: 'Fresh water',
        reading: null, detail: null,
        method: 'Tank capacity and refill schedule logged by the property.',
        body: 'Showers run on stored fresh water. Supply tightens in peak season.',
      },
      {
        id: 'weather', icon: 'cloud', label: 'Season',
        reading: 'Nov–Feb is dry', detail: 'Monsoon shuts much of the coast',
        method: 'Seasonal pattern for the region, not a live reading.',
        body: 'Shacks and some routes close entirely in the wet months.',
      },
      {
        id: 'access', icon: 'boot', label: 'Walk to the beach',
        reading: null, detail: null,
        method: 'Walked and timed by staff.',
        body: 'Scooter hire is the normal way to move around here.',
      },
      staffed,
    ],
  },

  city: {
    eyebrow: 'Verified city stay',
    headline: 'Know before you land',
    intro:
      'In a city the honest variables are noise, transit and how late you can arrive. We publish how each was checked — and where we have no reading, we say so.',
    checks: [
      wifi,
      power,
      {
        id: 'transit', icon: 'transit', label: 'Getting around',
        reading: null, detail: null,
        method: 'Walking time to the nearest metro or terminal, timed by staff.',
        body: 'Airport and station transfers can be arranged at the desk.',
      },
      {
        id: 'noise', icon: 'noise', label: 'Street noise',
        reading: null, detail: null,
        method: 'Observed at the dorm window after 22:00.',
        body: 'Front rooms face the road. Ask for a courtyard bed if you sleep light.',
      },
      {
        id: 'access', icon: 'boot', label: 'Late check-in',
        reading: '24h reception', detail: 'Arrive on any flight',
        method: 'Staffed desk overnight.',
        body: 'Message ahead if you land after 02:00 so someone is expecting you.',
      },
      staffed,
    ],
  },

  jungle: {
    eyebrow: 'Verified forest stay',
    headline: 'Know before you go in',
    intro:
      'Rain, road and signal are the honest variables in the forest. We publish how each was checked — and where we have no reading, we say so.',
    checks: [
      wifi,
      power,
      {
        id: 'signal', icon: 'signal', label: 'Mobile signal',
        reading: null, detail: null,
        method: 'Observed at reception on 4G LTE. Varies deeper into the estate.',
        body: 'Expect to be out of range on the trails. Tell someone your route.',
      },
      {
        id: 'weather', icon: 'cloud', label: 'Rain',
        reading: 'Heavy Jun–Sep', detail: 'Leeches on the trails in the wet',
        method: 'Seasonal pattern for the region, not a live reading.',
        body: 'Bring closed shoes and something that dries.',
      },
      {
        id: 'access', icon: 'boot', label: 'Road condition',
        reading: null, detail: null,
        method: 'Driven and logged by staff after the last monsoon.',
        body: 'The final stretch is unsurfaced. Low-clearance cars struggle in the wet.',
      },
      staffed,
    ],
  },

  heritage: {
    eyebrow: 'Verified old-city stay',
    headline: 'Know before you arrive',
    intro:
      'Old cities are wonderful and loud. We publish how each variable was checked — and where we have no reading, we say so.',
    checks: [
      wifi,
      power,
      {
        id: 'transit', icon: 'transit', label: 'Getting around',
        reading: null, detail: null,
        method: 'Walking time to the main gate and nearest stand, timed by staff.',
        body: 'Most of the old city is best walked. Autos are metered badly — agree first.',
      },
      {
        id: 'noise', icon: 'noise', label: 'Street noise',
        reading: null, detail: null,
        method: 'Observed at the dorm window after 22:00.',
        body: 'Markets below run late. Courtyard rooms are markedly quieter.',
      },
      {
        id: 'weather', icon: 'cloud', label: 'Heat',
        reading: 'Apr–Jun is severe', detail: 'Plan around the middle of the day',
        method: 'Seasonal pattern for the region, not a live reading.',
        body: 'Sightsee early, rest at noon, go out again after five.',
      },
      staffed,
    ],
  },

  workation: {
    eyebrow: 'Verified work stay',
    headline: 'Know before you commit',
    intro:
      'If you are working from here, the connection and the desk are the product. We publish how each was checked — and where we have no reading, we say so.',
    checks: [
      wifi,
      power,
      {
        id: 'transit', icon: 'transit', label: 'Getting around',
        reading: null, detail: null,
        method: 'Walking time to the nearest metro or main road, timed by staff.',
        body: 'Cabs are easy here; traffic is not. Budget an hour across the city.',
      },
      {
        id: 'noise', icon: 'noise', label: 'Quiet hours',
        reading: '23:00 daily', detail: 'Enforced in dorms and common areas',
        method: 'House policy.',
        body: 'Calls after hours move to the common deck so dorms stay quiet.',
      },
      {
        id: 'access', icon: 'boot', label: 'Desk space',
        reading: null, detail: null,
        method: 'Counted seats with a socket within reach.',
        body: 'Not a co-working floor — a quiet corner with power and a view.',
      },
      staffed,
    ],
  },
};

/** Falls back to city, the most neutral vocabulary in the set. */
export function getProofConfig(category?: string | null): ProofConfig {
  const key = (category || '').toLowerCase() as Terrain;
  return TERRAIN[key] ?? TERRAIN.city;
}
