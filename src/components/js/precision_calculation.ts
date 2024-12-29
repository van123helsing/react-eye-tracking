/**
 * Calculates a measurement of how precise the eye tracker currently is,
 * which is displayed to the user.
 * @param past50Array - An array containing two arrays: the last 50 x and y gaze prediction points.
 * @returns The precision measurement as a rounded percentage.
 */
export function calculatePrecision(past50Array: [number[], number[]]): number {
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;

  // Retrieve the last 50 gaze prediction points
  const x50 = past50Array[0];
  const y50 = past50Array[1];

  // Calculate the position of the point the user is staring at
  const staringPointX = windowWidth / 2;
  const staringPointY = windowHeight / 2;

  const precisionPercentages: number[] = new Array(50);
  calculatePrecisionPercentages(
    precisionPercentages,
    windowHeight,
    x50,
    y50,
    staringPointX,
    staringPointY
  );
  const precision = calculateAverage(precisionPercentages);

  // Return the precision measurement as a rounded percentage
  return Math.round(precision);
}

/**
 * Calculates percentage accuracy for each prediction based on the distance of
 * the prediction point from the center point (uses the window height as
 * lower threshold 0%).
 * @param precisionPercentages - The array to store precision percentages.
 * @param windowHeight - The height of the window.
 * @param x50 - Array of last 50 x predictions.
 * @param y50 - Array of last 50 y predictions.
 * @param staringPointX - The x-coordinate of the staring point.
 * @param staringPointY - The y-coordinate of the staring point.
 */
function calculatePrecisionPercentages(
  precisionPercentages: number[],
  windowHeight: number,
  x50: number[],
  y50: number[],
  staringPointX: number,
  staringPointY: number
): void {
  for (let x = 0; x < 50; x++) {
    // Calculate distance between each prediction and staring point
    const xDiff = staringPointX - x50[x];
    const yDiff = staringPointY - y50[x];
    const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);

    // Calculate precision percentage
    const halfWindowHeight = windowHeight / 2;
    let precision = 0;
    if (distance <= halfWindowHeight && distance > -1) {
      precision = 100 - (distance / halfWindowHeight) * 100;
    } else if (distance > halfWindowHeight) {
      precision = 0;
    } else if (distance > -1) {
      precision = 100;
    }

    // Store the precision
    precisionPercentages[x] = precision;
  }
}

/**
 * Calculates the average of all precision percentages calculated.
 * @param precisionPercentages - The array of precision percentages.
 * @returns The average precision percentage.
 */
function calculateAverage(precisionPercentages: number[]): number {
  let precision = 0;
  for (let x = 0; x < 50; x++) {
    precision += precisionPercentages[x];
  }
  precision = precision / 50;
  return precision;
}
