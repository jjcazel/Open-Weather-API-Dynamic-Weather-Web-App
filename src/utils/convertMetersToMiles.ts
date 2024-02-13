
export function metersToMiles(visibilityInMeters: number): string {
  const visibilityInMiles = visibilityInMeters / 1609.34;
  return `${visibilityInMiles.toFixed(2)}mi`; // Round to 2 decimal places and add 'mi' unit
}
