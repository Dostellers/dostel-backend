/**
 * The circuits — routes, not rooms.
 *
 * Backpackers plan directions, not single stays: land somewhere, move along a
 * line, come home. The aggregator's real product is the line. Three circuits
 * link the eight houses, and because it is one network, the next hostel
 * already knows you when you walk in (DOS-500 guest graph).
 *
 * Node positions are true lat/long put through a simple equirectangular
 * projection (~24 px/deg lon, 26 px/deg lat, so shapes are not stretched).
 * The map draws no borders — cities and routes only.
 */

export type CircuitNode = { x: number; y: number; label: string };

/** Projected onto a 400×720 canvas from real coordinates. */
export const NODES: Record<string, CircuitNode> = {
  'dostel-dharamshala':     { x: 221, y: 89,  label: 'Dharamshala' },
  'dostel-delhi-airport':   { x: 247, y: 183, label: 'Delhi' },
  'dostel-jaipur-mi-road':  { x: 203, y: 227, label: 'Jaipur' },
  'dostel-goa-beach':       { x: 133, y: 522, label: 'Anjuna' },
  'dostel-gokarna':         { x: 153, y: 549, label: 'Gokarna' },
  'dostel-coorg-rainforest':{ x: 201, y: 604, label: 'Coorg' },
  'dostel-bangalore-hsr':   { x: 266, y: 591, label: 'Bangalore' },
  'dostel-vattakanal':      { x: 261, y: 661, label: 'Vattakanal' },
};

export type Circuit = {
  id: string;
  name: string;
  /** Line colour on ink. Coral and yellow are the logo's exact inks. */
  color: string;
  stops: string[];
  /** legs[i] is the ground truthy transport hint between stops[i] and stops[i+1]. */
  legs: string[];
  nights: string;
  blurb: string;
};

export const CIRCUITS: Circuit[] = [
  {
    id: 'north',
    name: 'The North Loop',
    color: '#F54E4E',
    stops: ['dostel-delhi-airport', 'dostel-jaipur-mi-road', 'dostel-dharamshala'],
    legs: ['5h train', '11h night bus'],
    nights: '5–7 nights',
    blurb: 'Land in Delhi, walk Jaipur’s old city, end facing the Himalaya.',
  },
  {
    id: 'coast',
    name: 'The Coast Run',
    color: '#FCCC00',
    stops: ['dostel-goa-beach', 'dostel-gokarna'],
    legs: ['4h bus'],
    nights: '4–6 nights',
    blurb: 'Anjuna until it’s too loud, then Gokarna until you’re ready to talk again.',
  },
  {
    id: 'hills',
    name: 'The Hill Circuit',
    color: '#FFFFFF',
    stops: ['dostel-bangalore-hsr', 'dostel-coorg-rainforest', 'dostel-vattakanal'],
    legs: ['6h bus', '8h via Mysore'],
    nights: '6–9 nights',
    blurb: 'Work the city, then coffee country, then the shola forest.',
  },
];

/** One line each property is known for — shared by the board and the map. */
export const KNOWN_FOR: Record<string, string> = {
  'dostel-vattakanal': 'Shola forest',
  'dostel-dharamshala': 'Himalaya',
  'dostel-goa-beach': 'Anjuna beach',
  'dostel-gokarna': 'Quiet coast',
  'dostel-coorg-rainforest': 'Coffee country',
  'dostel-jaipur-mi-road': 'Old city',
  'dostel-delhi-airport': 'Near airport',
  'dostel-bangalore-hsr': 'Work + city',
};
