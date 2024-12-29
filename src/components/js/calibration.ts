import { calculatePrecision } from './precision_calculation';
import swal from 'sweetalert';

// Global variables  
let PointCalibrate = 0;
let CalibrationPoints: { [key: number]: number } = {};

/**
 * Clear the canvas and the calibration buttons.
 */
export function ClearCanvas(): void {
  const calibrations = document.querySelectorAll('.Calibration') as NodeListOf<HTMLElement>;
  calibrations.forEach((i) => {
    i.style.setProperty('display', 'none');
  });
  const canvas = document.getElementById('plotting_canvas') as HTMLCanvasElement | null;
  if (canvas) {
    const context = canvas.getContext('2d');
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
}

export function ClearCalibration() {
  // Clear data from WebGazer

  const calibrations = document.querySelectorAll('.Calibration') as NodeListOf<HTMLElement>;
  calibrations.forEach((i) => {
    i.style.setProperty('background-color', 'white');
    i.style.setProperty('opacity', '0.2');
    i.removeAttribute('disabled');
  });

  CalibrationPoints = {};
  PointCalibrate = 0;
}

/**
 * Calculates accuracy after calibration.
 */
function calcAccuracy(): void {
  // Show modal  
  // Notification for the measurement process  
  swal({
    title: 'Calculating measurement',
    text: "Please don't move your mouse & stare at the middle dot for the next 5 seconds. This will allow us to calculate the accuracy of our predictions.",
    closeOnEsc: false,
    allowOutsideClick: false,
    closeModal: true,
  }).then(() => {
    // Makes the variables true for 5 seconds & plots the points  
    window.webgazer.params.storingPoints = true

    sleep(5000).then(() => {
      window.webgazer.params.storingPoints = false; // Stop storing the prediction points
      const past50 = window.webgazer.getStoredPoints(); // Retrieve the stored points
      const precision_measurement = calculatePrecision(past50);
      const accuracyLabel = `<a>Accuracy | ${precision_measurement}%</a>`;
      const accuracyElement = document.getElementById('Accuracy');
      if (accuracyElement) {
        accuracyElement.innerHTML = accuracyLabel; // Show the accuracy in the nav bar.  
      }
      swal({
        title: `Your accuracy measure is ${precision_measurement}%`,
        allowOutsideClick: false,
        buttons: {
          cancel: 'Recalibrate',
          confirm: true,
        },
      }).then((isConfirm: boolean) => {
        if (isConfirm) {
          // Clear the calibration & hide the last middle button  
          ClearCanvas();
        } else {
          // Use restart function to restart the calibration  
          if (accuracyElement) {
            accuracyElement.innerHTML = '<a>Not yet Calibrated</a>';
          }
          window.webgazer.clearData();
          ClearCalibration();
          ClearCanvas();
          ShowCalibrationPoint();
        }
      });
    });
  });
}

/**
 * Handles the calibration point click event.
 * @param id - The index of the calibration point clicked.
 */
export function calPointClick(id: number): void {
  const calibrations = document.getElementsByName('Calibration') as NodeListOf<HTMLElement>;

  const node = calibrations.item(id);
  if (node === null) {
    console.error(`Calibration element at index ${id} not found.`);
    return;
  }

  if (CalibrationPoints[id] === undefined) {
    CalibrationPoints[id] = 0;
  }
  CalibrationPoints[id]++; // Increments values  

  if (CalibrationPoints[id] === 5) {
    // Only turn to yellow after 5 clicks  
    node.style.setProperty('background-color', 'yellow');
    node.setAttribute('disabled', 'disabled');
    PointCalibrate++;
  } else if (CalibrationPoints[id] < 5) {
    // Gradually increase the opacity of calibration points when clicked to give some indication to the user.  
    const opacity = 0.2 * CalibrationPoints[id] + 0.2;
    node.style.setProperty('opacity', opacity.toString());
  }

  // Show the middle calibration point after all other points have been clicked.  
  if (PointCalibrate === 8) {
    const pt5 = document.getElementById('Pt5') as HTMLElement | null;
    if (pt5) {
      pt5.style.removeProperty('display');
    }
  }

  if (PointCalibrate >= 9) {
    // Last point is calibrated  
    // Grab every element in Calibration class and hide them except the middle point.  
    calibrations.forEach((i) => {
      i.style.setProperty('display', 'none');
    });
    const pt5 = document.getElementById('Pt5') as HTMLElement | null;
    if (pt5) {
      pt5.style.removeProperty('display');
    }

    // Clears the canvas  
    const canvas = document.getElementById('plotting_canvas') as HTMLCanvasElement | null;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    // Calculate the accuracy  
    calcAccuracy();
  }
}

/**
 * Load this function when the index page starts.
 * This function listens for button clicks on the HTML page,
 * checks that all buttons have been clicked 5 times each, and then goes on to measuring the precision.
 */
export function docLoad(): void {
  ClearCanvas();
}

/**
 * Show the Calibration Points
 */
export function ShowCalibrationPoint(): void {
  const calibrations = document.getElementsByName('Calibration') as NodeListOf<HTMLElement>;
  calibrations.forEach((i) => {
    i.style.removeProperty('display');
  });
  // Initially hides the middle button  
  const pt5 = document.getElementById('Pt5') as HTMLElement | null;
  if (pt5) {
    pt5.style.setProperty('display', 'none');
  }
}

/**
 * Sleep function because JavaScript doesn't have one.
 * Sourced from http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
 * @param time - The time to sleep in milliseconds.
 */
function sleep(time: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, time));
}  
