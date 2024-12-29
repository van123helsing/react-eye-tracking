# React Eye Tracking Library


## Introduction

The React Eye Tracking library provides an easy way to integrate eye-tracking capabilities into your React applications. It leverages the [WebGazer.js](https://github.com/brownhci/WebGazer) library under the hood to estimate the user's gaze location on the screen using a standard webcam. This allows developers to create interactive experiences that respond to where the user is looking without the need for specialized hardware.

Note: Full credit to the WebGazer.js team for their excellent work in making webcam-based gaze tracking accessible.

## Features
- Easy Integration: Quickly add eye-tracking functionality to your React app with minimal setup.
- Customizable Options: Control the visibility of the camera preview and prediction points.
- Gaze Data Listener: Receive real-time gaze data for custom application logic.
- TypeScript Support: Built with TypeScript for type safety and better developer experience.

## Installation

Install the library using npm:

```bash
npm install react-eye-tracking
```

Or using yarn:
```bash
yarn add react-eye-tracking
```


## Usage

Here's a simple example of how to use the EyeTracking component in your React application.

```jsx
import React, { useState } from 'react';  
import { EyeTracking } from 'react-eye-tracking';

const App = () => {  
    const [showEyeTracking, setShowEyeTracking] = useState(true);

    const handleGazeData = (data, elapsedTime) => {  
        // Handle the gaze data here.  
        // `data` contains the x and y coordinates of the gaze prediction.  
        // `elapsedTime` is the time since the WebGazer started.  
        console.log('Gaze Data:', data, 'Elapsed Time:', elapsedTime);  
    };
    
    return (  
    <div>  
        <EyeTracking  
            show={showEyeTracking}  
            setShow={setShowEyeTracking}  
            showCamera={true}  
            showPoint={true}  
            listener={handleGazeData}  
        />  
    </div>  
    );  
};
    
export default App;
```


## Component Properties
- `show` (boolean): Determines whether the eye-tracking overlay is visible. Set to true to display the overlay, or false to hide it.
- `setShow` ((show: boolean) => void): A function to update the show state. Typically, this is the setState function from a useState hook.
- `showCamera` (boolean, optional): Controls the visibility of the webcam preview. Set to true to show the camera preview, or false to hide it. Default is true.
- `showPoint` (boolean, optional): Determines whether to display the prediction points on the screen. Set to true to show the prediction points, or false to hide them. Default is true.
- `listener` ((data: any, elapsedTime: number) => void): A function that receives the gaze data and the elapsed time. Use this to handle gaze data for your application logic.


## Example Explanation

In the example above:

We import the `EyeTracking` component from `react-eye-tracking`.
We use the `useState` hook to manage the visibility of the eye-tracking overlay.
The `handleGazeData` function is passed as the `listener` prop to handle gaze data.
The `EyeTracking` component is rendered with the desired props.

## Support

If you find this library useful and want to support its development, consider buying me a coffee!

