// Initialize webgazer variable
import { ClearCalibration, ClearCanvas, docLoad, ShowCalibrationPoint } from './calibration';

let webgazerJS: any;

/**
 * Initializes the webgazer tracker with specified settings.
 * @param showPoint - Whether to show prediction points.
 * @param showCamera - Whether to show the camera preview.
 * @param listener - A function to handle gaze data.
 */
export async function init(
  showPoint: boolean,
  showCamera: boolean,
  listener: (data: any, elapsedTime: number) => void
): Promise<void> {
  if (typeof window === 'undefined') {
    console.log('Webgazer is not available during server-side rendering.');
    return;
  }

  // Dynamically import webgazer on the client side  
  if (!webgazerJS) {
    webgazerJS = (await import('webgazer')).default;
    // Attach webgazer to the global window object for modules that need it  
    window.webgazer = webgazerJS;
  }

  // Start the webgazer tracker  
  await window.webgazer
    .setRegression('ridge') /* Currently must set regression and tracker */
    .setGazeListener(listener)
    .saveDataAcrossSessions(true)
    .begin();

  window.webgazer
    .showVideoPreview(showCamera) /* Shows all video previews */
    .showPredictionPoints(showPoint) /* Shows a square every 100 milliseconds where current prediction is */
    .applyKalmanFilter(true); /* Kalman Filter defaults to on. Can be toggled by user. */

  // Set up the webgazer video feedback.  
  const setup = () => {
    const canvas = document.getElementById('plotting_canvas') as HTMLCanvasElement | null;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.position = 'fixed';
    } else {
      console.error("Canvas element with id 'plotting_canvas' not found.");
    }
  };
  setup();

  // Set to true if you want to save the data even if you reload the page.  
  window.saveDataAcrossSessions = true;

  // Handle unloading  
  window.onbeforeunload = () => {
    window.webgazer.end();
  };

  window.addEventListener('load', docLoad);
}

// Rest of your code...  

// Ensure global declarations  
declare global {
  interface Window {
    webgazer: any;
    saveDataAcrossSessions?: boolean;
  }
}

/**
 * Restart the calibration process by clearing the local storage and resetting the calibration point.
 */
export function Restart(): void {
  const accuracyElement = document.getElementById('Accuracy');
  if (accuracyElement) {
    accuracyElement.innerHTML = '<a>Not yet Calibrated</a>';
  } else {
    console.error("Element with id 'Accuracy' not found.");
  }
  window.webgazer.clearData();
  ClearCalibration();
  ClearCanvas();
  ShowCalibrationPoint();
}
