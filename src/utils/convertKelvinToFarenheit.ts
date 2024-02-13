
export function convertKelvinToFarenheit(tempInKelvin: number): number {
  const tempInFahrenheit = (tempInKelvin * 9) / 5 - 459.67;
  return Math.floor(tempInFahrenheit); // Removes decimal part and keeps integer part
}
