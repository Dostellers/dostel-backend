/**
 * Destinations — one entry per city the network actually operates in.
 * The navbar used to advertise Kasol and Manali, where we have no beds;
 * a dropdown that promises inventory we don't have is a broken promise
 * on every page. Only real destinations live here.
 */
import { CIRCUITS, type Circuit } from './circuits';

export type Destination = {
  slug: string;
  name: string;
  state: string;
  hostelSlugs: string[];
  /** Circuit id from lib/circuits.ts, if the city sits on one. */
  circuitId: string | null;
  tagline: string;
  blurb: string;
  gettingThere: string;
  /** Terrain key for the proof-card vocabulary (lib/proof.ts). */
  terrain: string;
};

export const DESTINATIONS: Destination[] = [
  {
    slug: 'kodaikanal',
    name: 'Kodaikanal',
    state: 'Tamil Nadu',
    hostelSlugs: ['dostel-vattakanal'],
    circuitId: 'hills',
    tagline: 'Shola forest and the mist that lives in it',
    blurb:
      'Vattakanal hangs off the side of Kodaikanal at 2,100 m — a village the mist walks through every afternoon. This is where Dostel started, on land Bob & Tanya restored in 1985.',
    gettingThere: 'Kodai Road station 80 km (2.5h cab) · Madurai airport 135 km (4h)',
    terrain: 'mountains',
  },
  {
    slug: 'dharamshala',
    name: 'Dharamshala',
    state: 'Himachal Pradesh',
    hostelSlugs: ['dostel-dharamshala'],
    circuitId: 'north',
    tagline: 'The Himalaya out the window',
    blurb:
      'Monastery mornings, mountain evenings, and the long ridge above McLeod Ganj. The last stop on the North Loop, and the one people miss most after they leave.',
    gettingThere: 'Overnight bus from Delhi (11h) · Gaggal airport 13 km',
    terrain: 'mountains',
  },
  {
    slug: 'goa',
    name: 'Goa',
    state: 'Anjuna',
    hostelSlugs: ['dostel-goa-beach'],
    circuitId: 'coast',
    tagline: 'Anjuna until it’s too loud',
    blurb:
      'The loud, warm, neon start of the Coast Run. Flea markets, beach shacks, and a dorm full of people who all swear they’re leaving tomorrow.',
    gettingThere: 'Thivim station 18 km · Dabolim airport 45 km',
    terrain: 'beach',
  },
  {
    slug: 'gokarna',
    name: 'Gokarna',
    state: 'Karnataka',
    hostelSlugs: ['dostel-gokarna'],
    circuitId: 'coast',
    tagline: 'Then Gokarna until you’re ready to talk again',
    blurb:
      'Four hours south of Anjuna and a decade quieter. Temple town on one side, empty beaches over the headland, and not much else — which is the point.',
    gettingThere: '4h bus from Goa · Gokarna Road station 10 km',
    terrain: 'beach',
  },
  {
    slug: 'coorg',
    name: 'Coorg',
    state: 'Karnataka',
    hostelSlugs: ['dostel-coorg-rainforest'],
    circuitId: 'hills',
    tagline: 'Coffee country',
    blurb:
      'Madikeri sits in the middle of coffee estates and rain. The middle stop of the Hill Circuit — green enough that your camera roll stops being believable.',
    gettingThere: '6h bus from Bangalore · nearest station Mysore 120 km',
    terrain: 'jungle',
  },
  {
    slug: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    hostelSlugs: ['dostel-jaipur-mi-road'],
    circuitId: 'north',
    tagline: 'The old city, on foot',
    blurb:
      'MI Road puts you between the pink old city and the new one. Forts in the morning, lassi at noon, rooftops after five — the middle stop of the North Loop.',
    gettingThere: '5h train from Delhi · Jaipur Junction 3 km',
    terrain: 'heritage',
  },
  {
    slug: 'delhi',
    name: 'Delhi',
    state: 'NCR',
    hostelSlugs: ['dostel-delhi-airport'],
    circuitId: 'north',
    tagline: 'Refuge in transit',
    blurb:
      'Not scenic, and not pretending to be. A clean bed near the airport, 24-hour check-in for whatever hour your flight lands, and the first stop of the North Loop.',
    gettingThere: 'IGI airport 10 min · Aerocity metro',
    terrain: 'city',
  },
  {
    slug: 'bangalore',
    name: 'Bangalore',
    state: 'HSR Layout',
    hostelSlugs: ['dostel-bangalore-hsr'],
    circuitId: 'hills',
    tagline: 'Work the city first',
    blurb:
      'HSR is where the laptops live. Work a normal week, meet the people you’ll trek with, then start the Hill Circuit from the front door.',
    gettingThere: 'Airport 50 km (90 min) · metro to Silk Board',
    terrain: 'workation',
  },
];

export function getDestination(slug: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.slug === slug);
}

export function getCircuit(id: string | null): Circuit | undefined {
  return CIRCUITS.find((c) => c.id === id);
}
