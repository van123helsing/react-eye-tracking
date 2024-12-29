import React, { useState, useEffect } from 'react';
import { calPointClick } from '../js/calibration';
import { init, Restart } from '../js/main';
import styled from 'styled-components';

export interface EyeTrackingProps {
  show: boolean;
  setShow: (show: boolean) => void;
  showCamera: boolean;
  showPoint: boolean;
  listener: (data: any, clock: any) => void;
}

export const EyeTracking = ({
                              show,
                              setShow,
                              showCamera = true,
                              showPoint = true,
                              listener,
                            }: EyeTrackingProps) => {
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    init(showPoint, showCamera, listener);
  }, []);

  return (
    <Container $show={show}>
      <CalibrationDiv>
        <WebGazerNavbar>
          <NavbarContent id="myNavbar" style={{ display: show ? 'flex' : 'none' }}>
            <ul>
              <li>
                <HelpButton onClick={() => setShow(false)} href="#">
                  Close
                </HelpButton>
              </li>
            </ul>
            <ul>
              <li>
                <HelpButton onClick={() => setShowModal(true)} href="#">
                  Help
                </HelpButton>
              </li>
            </ul>
            <ul>
              <AccuracyItem id="Accuracy">
                <a>Not yet Calibrated</a>
              </AccuracyItem>
            </ul>
          </NavbarContent>
        </WebGazerNavbar>
        <CalibrationPageCanvas />

        <div>
          <CalibrationButton
            id="Pt1"
            style={{ top: '70px', left: '340px' }}
            onClick={() => calPointClick(0)}
            name='Calibration'
          />
          <CalibrationButton
            id="Pt2"
            style={{ top: '70px', left: '50vw', marginLeft: '340px' }}
            onClick={() => calPointClick(1)}
            name='Calibration'
          />
          <CalibrationButton
            id="Pt3"
            style={{ top: '70px', right: '2vw' }}
            onClick={() => calPointClick(2)}
            name='Calibration'
          />
          <CalibrationButton
            id="Pt4"
            style={{ top: '50vh', left: '2vw' }}
            onClick={() => calPointClick(3)}
            name='Calibration'
          />
          <CalibrationButton
            id="Pt5"
            style={{ top: '50vh', left: '50vw' }}
            onClick={() => calPointClick(4)}
            name='Calibration'
          />
          <CalibrationButton
            id="Pt6"
            style={{ top: '50vh', right: '2vw' }}
            onClick={() => calPointClick(5)}
            name='Calibration'
          />
          <CalibrationButton
            id="Pt7"
            style={{ bottom: '2vw', left: '2vw' }}
            onClick={() => calPointClick(6)}
            name='Calibration'
          />
          <CalibrationButton
            id="Pt8"
            style={{ bottom: '2vw', left: '50vw' }}
            onClick={() => calPointClick(7)}
            name='Calibration'
          />
          <CalibrationButton
            id="Pt9"
            style={{ bottom: '2vw', right: '2vw' }}
            onClick={() => calPointClick(8)}
            name='Calibration'
          />
        </div>

        {showCamera && (
          <WebGazerVideoContainer>
            <WebGazerVideoFeed
              style={{ transform: 'scale(-1, 1)' }}
            ></WebGazerVideoFeed>
            <HiddenCanvas id="webgazerVideoCanvas" width="640" height="480" />
            <FaceOverlayCanvas
              style={{ transform: 'scale(-1, 1)' }}
            ></FaceOverlayCanvas>
            <FaceFeedbackCanvas></FaceFeedbackCanvas>
          </WebGazerVideoContainer>
        )}

        {showModal && (
          <HelpModal role="dialog">
            <ModalDialog>
              <ModalContent>
                <ModalBody>
                  <img
                    src="./calibration.png"
                    alt="webgazer demo instructions"
                  />
                </ModalBody>
                <ModalFooter>
                  <ModalButtonClose
                    id="closeBtn"
                    type="button"
                    onClick={() => setShow(false)}
                  >
                    Close & load saved model
                  </ModalButtonClose>
                  <ModalButtonStart
                    id="startBtn"
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      Restart();
                    }}
                  >
                    Calibrate
                  </ModalButtonStart>
                </ModalFooter>
              </ModalContent>
            </ModalDialog>
          </HelpModal>
        )}
      </CalibrationDiv>
    </Container>
  );
};

// Styled Components
const Container = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== '$show',
})<{ $show: boolean }>`
    display: ${(props) => (props.$show ? 'block' : 'none')};
`;

const CalibrationDiv = styled.div`  
  position: fixed;  
  top: 0;  
  left: 0;  
  width: 100vw;  
  height: 100vh;  
  z-index: 1000;  
`;

const WebGazerNavbar = styled.nav`  
  left: 320px;  
  position: fixed;  
  top: 0;  
  width: calc(100% - 320px);  
  z-index: 1;  
`;

const NavbarContent = styled.div`  
  display: flex;  
  gap: 4px;  
  justify-content: flex-end;  
`;

const HelpButton = styled.a`  
  display: inline-block;  
  padding: 15px;  
  border: none;  
  background: none;  
  color: #777;  
  cursor: pointer;  
  
  &:hover {  
    color: black !important;  
    text-decoration: none;  
  }  
`;

const AccuracyItem = styled.li`  
  background-color: #222;  
  padding-left: inherit;  
  
  a {  
    background-color: #222;  
    color: #eee;  
    left: -15px;  
    padding-left: 80px;  
    padding-right: 40px;  
  }  
`;

const CalibrationPageCanvas = styled.canvas.attrs({
  id: 'plotting_canvas',
})`  
  background-color: white;  
  position: fixed;  
  top: 0;  
  left: 0;  
  width: 100vw;  
  height: 100vh;  
`;

const CalibrationButton = styled.input.attrs({
  type: 'button',
})`  
  width: 20px;  
  height: 20px;  
  border-radius: 25px;  
  background-color: red;  
  opacity: 0.2;  
  border: black 2px solid;  
  position: fixed;  
  cursor: pointer;
  z-index: 1001;
`;

const WebGazerVideoContainer = styled.div.attrs({
  id: 'webgazerVideoContainer',
})`  
  display: block !important;  
  position: fixed !important;  
  top: 0px !important;  
  left: 0px !important;  
  width: 320px !important;  
  height: 240px !important;  
`;

const WebGazerVideoFeed = styled.video.attrs({
  playsInline: true,
  id: 'webgazerVideoFeed',
  autoPlay: true,
})`  
  position: absolute;  
  width: 320px;  
  height: 240px;  
  display: block;  
`;

const HiddenCanvas = styled.canvas`  
  display: none;  
`;

const FaceOverlayCanvas = styled.canvas.attrs({
  id: 'webgazerFaceOverlay',
  width: '640',
  height: '480',
})`  
  display: block;  
  position: absolute;  
`;

const FaceFeedbackCanvas = styled.canvas.attrs({
  id: 'webgazerFaceFeedbackBox',
})`  
  display: block;  
  border-style: solid;  
  position: absolute;  
  width: 158.4px;  
  height: 158.4px;  
  top: 40.8px;  
  left: 80.8px;  
  border-bottom-color: #2c7a7b;  
`;

const HelpModal = styled.div`  
  z-index: 1001;  
  position: fixed;  
  top: 50%;  
  left: 50%;  
  transform: translate(-50%, -50%);  
  border: 2px solid #888;  
  border-radius: 8px;  
`;

const ModalDialog = styled.div`  
  /* Optional: styles for the modal dialog */  
`;

const ModalContent = styled.div`  
  /* Optional: styles for the modal content */  
`;

const ModalBody = styled.div`  
  /* Optional: styles for the modal body */  
`;

const ModalFooter = styled.div`  
  display: flex;  
  justify-content: space-between;  
  padding: 12px 4px;  
`;

const ModalButtonClose = styled.button`  
  border-radius: 0.375rem;  
  transition: all 0.3s ease-in-out;  
  color: black !important;  
  padding: 4px;  
  border: 2px solid black;  
  text-decoration: underline;  
  cursor: pointer;  
  
  &:hover {  
    background-color: #e85e6b; 
  }  
`;

const ModalButtonStart = styled.button`  
  border-radius: 0.375rem;  
  transition: all 0.3s ease-in-out;  
  color: black !important;  
  padding: 4px;  
  border: 2px solid black;  
  text-decoration: underline;  
  cursor: pointer;  
  
  &:hover {  
    background-color: #2c7a7b;  
  }  
`;

