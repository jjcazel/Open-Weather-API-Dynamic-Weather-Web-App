export function convertWindSpeedToMph(speedInMetersPerSecond: number): string {
  const speedInMilesPerHour = speedInMetersPerSecond * 2.23694; // Conversion from m/s to mph
  return `${speedInMilesPerHour.toFixed(1)}mph`; // Round to 1 decimal place and add 'mph' unit
}
