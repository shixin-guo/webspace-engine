export const AFRAME_CSS = `
/* .a-fullscreen means not embedded. */
html.a-fullscreen {
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
}

html.a-fullscreen body {
  height: 100%;
  margin: 0;
  overflow: hidden;
  padding: 0;
  width: 100%;
}

/* Class is removed when doing <a-scene embedded>. */
html.a-fullscreen .a-canvas {
  width: 100% !important;
  height: 100% !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  position: fixed !important;
}

html:not(.a-fullscreen) .a-enter-vr,
html:not(.a-fullscreen) .a-enter-ar {
  right: 5px;
  bottom: 5px;
}

/* In chrome mobile the user agent stylesheet set it to white  */
:-webkit-full-screen {
  background-color: transparent;
}

.a-hidden {
  display: none !important;
}

.a-canvas {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}

.a-canvas.a-grab-cursor:hover {
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;
}

canvas.a-canvas.a-mouse-cursor-hover:hover {
  cursor: pointer;
}

.a-inspector-loader {
  background-color: #ed3160;
  position: fixed;
  left: 3px;
  top: 3px;
  padding: 6px 10px;
  color: #fff;
  text-decoration: none;
  font-size: 12px;
  font-family: Roboto,sans-serif;
  text-align: center;
  z-index: 99999;
  width: 204px;
}

/* Inspector loader animation */
@keyframes dots-1 { from { opacity: 0; } 25% { opacity: 1; } }
@keyframes dots-2 { from { opacity: 0; } 50% { opacity: 1; } }
@keyframes dots-3 { from { opacity: 0; } 75% { opacity: 1; } }
@-webkit-keyframes dots-1 { from { opacity: 0; } 25% { opacity: 1; } }
@-webkit-keyframes dots-2 { from { opacity: 0; } 50% { opacity: 1; } }
@-webkit-keyframes dots-3 { from { opacity: 0; } 75% { opacity: 1; } }

.a-inspector-loader .dots span {
  animation: dots-1 2s infinite steps(1);
  -webkit-animation: dots-1 2s infinite steps(1);
}

.a-inspector-loader .dots span:first-child + span {
  animation-name: dots-2;
  -webkit-animation-name: dots-2;
}

.a-inspector-loader .dots span:first-child + span + span {
  animation-name: dots-3;
  -webkit-animation-name: dots-3;
}

a-scene {
  display: block;
  position: relative;
  height: 100%;
  width: 100%;
}

a-assets,
a-scene video,
a-scene img,
a-scene audio {
  display: none;
}

.a-enter-vr-modal,
.a-orientation-modal {
  font-family: Consolas, Andale Mono, Courier New, monospace;
}

.a-enter-vr-modal a {
  border-bottom: 1px solid #fff;
  padding: 2px 0;
  text-decoration: none;
  transition: .1s color ease-in;
}

.a-enter-vr-modal a:hover {
  background-color: #fff;
  color: #111;
  padding: 2px 4px;
  position: relative;
  left: -4px;
}

.a-enter-vr,
.a-enter-ar {
  font-family: sans-serif, monospace;
  font-size: 13px;
  width: 100%;
  font-weight: 200;
  line-height: 16px;
  position: absolute;
  right: 20px;
  bottom: 20px;
}

.a-enter-ar {
  right: 80px;
}

.a-enter-vr-button,
.a-enter-vr-modal,
.a-enter-vr-modal a {
  color: #fff;
  user-select: none;
  outline: none;
}

.a-enter-vr-button {
  background: rgba(0, 0, 0, 0.35) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='108' height='62' viewBox='0 0 108 62'%3E%3Ctitle%3Eaframe-vrmode-noborder-reduced-tracking%3C/title%3E%3Cpath d='M68.81,21.56H64.23v8.27h4.58a4.13,4.13,0,0,0,3.1-1.09,4.2,4.2,0,0,0,1-3,4.24,4.24,0,0,0-1-3A4.05,4.05,0,0,0,68.81,21.56Z' fill='%23fff'/%3E%3Cpath d='M96,0H12A12,12,0,0,0,0,12V50A12,12,0,0,0,12,62H96a12,12,0,0,0,12-12V12A12,12,0,0,0,96,0ZM41.9,46H34L24,16h8l6,21.84,6-21.84H52Zm39.29,0H73.44L68.15,35.39H64.23V46H57V16H68.81q5.32,0,8.34,2.37a8,8,0,0,1,3,6.69,9.68,9.68,0,0,1-1.27,5.18,8.9,8.9,0,0,1-4,3.34l6.26,12.11Z' fill='%23fff'/%3E%3C/svg%3E") 50% 50% no-repeat;
}

.a-enter-ar-button {
  background: rgba(0, 0, 0, 0.20) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='108' height='62' viewBox='0 0 108 62'%3E%3Ctitle%3Eaframe-armode-noborder-reduced-tracking%3C/title%3E%3Cpath d='M96,0H12A12,12,0,0,0,0,12V50A12,12,0,0,0,12,62H96a12,12,0,0,0,12-12V12A12,12,0,0,0,96,0Zm8,50a8,8,0,0,1-8,8H12a8,8,0,0,1-8-8V12a8,8,0,0,1,8-8H96a8,8,0,0,1,8,8Z' fill='%23fff'/%3E%3Cpath d='M43.35,39.82H32.51L30.45,46H23.88L35,16h5.73L52,46H45.43Zm-9.17-5h7.5L37.91,23.58Z' fill='%23fff'/%3E%3Cpath d='M68.11,35H63.18V46H57V16H68.15q5.31,0,8.2,2.37a8.18,8.18,0,0,1,2.88,6.7,9.22,9.22,0,0,1-1.33,5.12,9.09,9.09,0,0,1-4,3.26l6.49,12.26V46H73.73Zm-4.93-5h5a5.09,5.09,0,0,0,3.6-1.18,4.21,4.21,0,0,0,1.28-3.27,4.56,4.56,0,0,0-1.2-3.34A5,5,0,0,0,68.15,21h-5Z' fill='%23fff'/%3E%3C/svg%3E") 50% 50% no-repeat;
}

.a-enter-vr-button,
.a-enter-ar-button {
  background-size: 90% 90%;
  border: 0;
  bottom: 0;
  cursor: pointer;
  min-width: 58px;
  min-height: 34px;
  /* 1.74418604651 */
  /*
    In order to keep the aspect ratio when resizing
    padding-top percentages are relative to the containing block's width.
    http://stackoverflow.com/questions/12121090/responsively-change-div-size-keeping-aspect-ratio
  */
  padding-right: 0;
  padding-top: 0;
  position: absolute;
  right: 0;
  transition: background-color .05s ease;
  -webkit-transition: background-color .05s ease;
  z-index: 9999;
  border-radius: 8px;
  touch-action: manipulation; /* Prevent iOS double tap zoom on the button */
}

.a-enter-ar-button {
  background-size: 100% 90%;
  margin-right: 10px;
  border-radius: 7px;
}

.a-enter-ar-button:active,
.a-enter-ar-button:hover,
.a-enter-vr-button:active,
.a-enter-vr-button:hover {
  background-color: #ef2d5e;
}

.a-enter-vr-button.resethover {
  background-color: rgba(0, 0, 0, 0.35);
}

[data-a-enter-vr-no-webvr] .a-enter-vr-button {
  border-color: #666;
  opacity: 0.65;
}

[data-a-enter-vr-no-webvr] .a-enter-vr-button:active,
[data-a-enter-vr-no-webvr] .a-enter-vr-button:hover {
  background-color: rgba(0, 0, 0, .35);
  cursor: not-allowed;
}

.a-enter-vr-modal {
  background-color: #666;
  border-radius: 0;
  display: none;
  min-height: 32px;
  margin-right: 70px;
  padding: 9px;
  width: 280px;
  right: 2%;
  position: absolute;
}

.a-enter-vr-modal:after {
  border-bottom: 10px solid transparent;
  border-left: 10px solid #666;
  border-top: 10px solid transparent;
  display: inline-block;
  content: '';
  position: absolute;
  right: -5px;
  top: 5px;
  width: 0;
  height: 0;
}

.a-enter-vr-modal p,
.a-enter-vr-modal a {
  display: inline;
}

.a-enter-vr-modal p {
  margin: 0;
}

.a-enter-vr-modal p:after {
  content: ' ';
}

[data-a-enter-vr-no-webvr].a-enter-vr:hover .a-enter-vr-modal,
[data-a-enter-vr-no-headset].a-enter-vr:hover .a-enter-vr-modal {
  display: block;
}

.a-orientation-modal {
  background: rgba(244, 244, 244, 1) url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%20version%3D%221.1%22%20x%3D%220px%22%20y%3D%220px%22%20viewBox%3D%220%200%2090%2090%22%20enable-background%3D%22new%200%200%2090%2090%22%20xml%3Aspace%3D%22preserve%22%3E%3Cpolygon%20points%3D%220%2C0%200%2C0%200%2C0%20%22%3E%3C/polygon%3E%3Cg%3E%3Cpath%20d%3D%22M71.545%2C48.145h-31.98V20.743c0-2.627-2.138-4.765-4.765-4.765H18.456c-2.628%2C0-4.767%2C2.138-4.767%2C4.765v42.789%20%20%20c0%2C2.628%2C2.138%2C4.766%2C4.767%2C4.766h5.535v0.959c0%2C2.628%2C2.138%2C4.765%2C4.766%2C4.765h42.788c2.628%2C0%2C4.766-2.137%2C4.766-4.765V52.914%20%20%20C76.311%2C50.284%2C74.173%2C48.145%2C71.545%2C48.145z%20M18.455%2C16.935h16.344c2.1%2C0%2C3.808%2C1.708%2C3.808%2C3.808v27.401H37.25V22.636%20%20%20c0-0.264-0.215-0.478-0.479-0.478H16.482c-0.264%2C0-0.479%2C0.214-0.479%2C0.478v36.585c0%2C0.264%2C0.215%2C0.478%2C0.479%2C0.478h7.507v7.644%20%20%20h-5.534c-2.101%2C0-3.81-1.709-3.81-3.81V20.743C14.645%2C18.643%2C16.354%2C16.935%2C18.455%2C16.935z%20M16.96%2C23.116h19.331v25.031h-7.535%20%20%20c-2.628%2C0-4.766%2C2.139-4.766%2C4.768v5.828h-7.03V23.116z%20M71.545%2C73.064H28.757c-2.101%2C0-3.81-1.708-3.81-3.808V52.914%20%20%20c0-2.102%2C1.709-3.812%2C3.81-3.812h42.788c2.1%2C0%2C3.809%2C1.71%2C3.809%2C3.812v16.343C75.354%2C71.356%2C73.645%2C73.064%2C71.545%2C73.064z%22%3E%3C/path%3E%3Cpath%20d%3D%22M28.919%2C58.424c-1.466%2C0-2.659%2C1.193-2.659%2C2.66c0%2C1.466%2C1.193%2C2.658%2C2.659%2C2.658c1.468%2C0%2C2.662-1.192%2C2.662-2.658%20%20%20C31.581%2C59.617%2C30.387%2C58.424%2C28.919%2C58.424z%20M28.919%2C62.786c-0.939%2C0-1.703-0.764-1.703-1.702c0-0.939%2C0.764-1.704%2C1.703-1.704%20%20%20c0.94%2C0%2C1.705%2C0.765%2C1.705%2C1.704C30.623%2C62.022%2C29.858%2C62.786%2C28.919%2C62.786z%22%3E%3C/path%3E%3Cpath%20d%3D%22M69.654%2C50.461H33.069c-0.264%2C0-0.479%2C0.215-0.479%2C0.479v20.288c0%2C0.264%2C0.215%2C0.478%2C0.479%2C0.478h36.585%20%20%20c0.263%2C0%2C0.477-0.214%2C0.477-0.478V50.939C70.131%2C50.676%2C69.917%2C50.461%2C69.654%2C50.461z%20M69.174%2C51.417V70.75H33.548V51.417H69.174z%22%3E%3C/path%3E%3Cpath%20d%3D%22M45.201%2C30.296c6.651%2C0%2C12.233%2C5.351%2C12.551%2C11.977l-3.033-2.638c-0.193-0.165-0.507-0.142-0.675%2C0.048%20%20%20c-0.174%2C0.198-0.153%2C0.501%2C0.045%2C0.676l3.883%2C3.375c0.09%2C0.075%2C0.198%2C0.115%2C0.312%2C0.115c0.141%2C0%2C0.273-0.061%2C0.362-0.166%20%20%20l3.371-3.877c0.173-0.2%2C0.151-0.502-0.047-0.675c-0.194-0.166-0.508-0.144-0.676%2C0.048l-2.592%2C2.979%20%20%20c-0.18-3.417-1.629-6.605-4.099-9.001c-2.538-2.461-5.877-3.817-9.404-3.817c-0.264%2C0-0.479%2C0.215-0.479%2C0.479%20%20%20C44.72%2C30.083%2C44.936%2C30.296%2C45.201%2C30.296z%22%3E%3C/path%3E%3C/g%3E%3C/svg%3E) center no-repeat;
  background-size: 50% 50%;
  bottom: 0;
  font-size: 14px;
  font-weight: 600;
  left: 0;
  line-height: 20px;
  right: 0;
  position: fixed;
  top: 0;
  z-index: 9999999;
}

.a-orientation-modal:after {
  color: #666;
  content: "Insert phone into Cardboard holder.";
  display: block;
  position: absolute;
  text-align: center;
  top: 70%;
  transform: translateY(-70%);
  width: 100%;
}

.a-orientation-modal button {
  background: url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%20version%3D%221.1%22%20x%3D%220px%22%20y%3D%220px%22%20viewBox%3D%220%200%20100%20100%22%20enable-background%3D%22new%200%200%20100%20100%22%20xml%3Aspace%3D%22preserve%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M55.209%2C50l17.803-17.803c1.416-1.416%2C1.416-3.713%2C0-5.129c-1.416-1.417-3.713-1.417-5.129%2C0L50.08%2C44.872%20%20L32.278%2C27.069c-1.416-1.417-3.714-1.417-5.129%2C0c-1.417%2C1.416-1.417%2C3.713%2C0%2C5.129L44.951%2C50L27.149%2C67.803%20%20c-1.417%2C1.416-1.417%2C3.713%2C0%2C5.129c0.708%2C0.708%2C1.636%2C1.062%2C2.564%2C1.062c0.928%2C0%2C1.856-0.354%2C2.564-1.062L50.08%2C55.13l17.803%2C17.802%20%20c0.708%2C0.708%2C1.637%2C1.062%2C2.564%2C1.062s1.856-0.354%2C2.564-1.062c1.416-1.416%2C1.416-3.713%2C0-5.129L55.209%2C50z%22%3E%3C/path%3E%3C/svg%3E) no-repeat;
  border: none;
  height: 50px;
  text-indent: -9999px;
  width: 50px;
}

.a-loader-title {
  background-color: rgba(0, 0, 0, 0.6);
  font-family: sans-serif, monospace;
  text-align: center;
  font-size: 20px;
  height: 50px;
  font-weight: 300;
  line-height: 50px;
  position: absolute;
  right: 0px;
  left: 0px;
  top: 0px;
  color: white;
}

.a-modal {
  position: absolute;
  background: rgba(0, 0, 0, 0.60);
  background-size: 50% 50%;
  bottom: 0;
  font-size: 14px;
  font-weight: 600;
  left: 0;
  line-height: 20px;
  right: 0;
  position: fixed;
  top: 0;
  z-index: 9999999;
}

.a-dialog {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 199995;
  width: 300px;
  height: 200px;
  background-size: contain;
  background-color: white;
  font-family: sans-serif, monospace;
  font-size: 20px;
  border-radius: 3px;
  padding: 6px;
}

.a-dialog-text-container {
  width: 100%;
  height: 70%;
  align-self: flex-start;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
}

.a-dialog-text {
  display: inline-block;
  font-weight: normal;
  font-size: 14pt;
  margin: 8px;
}

.a-dialog-buttons-container {
  display: inline-flex;
  align-self: flex-end;
  width: 100%;
  height: 30%;
}

.a-dialog-button {
  cursor: pointer;
  align-self: center;
  opacity: 0.9;
  height: 80%;
  width: 50%;
  font-size: 12pt;
  margin: 4px;
  border-radius: 2px;
  text-align:center;
  border: none;
  display: inline-block;
  -webkit-transition: all 0.25s ease-in-out;
  transition: all 0.25s ease-in-out;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.10), 0 1px 2px rgba(0, 0, 0, 0.20);
  user-select: none;
}

.a-dialog-permission-button:hover {
  box-shadow: 0 7px 14px rgba(0,0,0,0.20), 0 2px 2px rgba(0,0,0,0.20);
}

.a-dialog-allow-button {
  background-color: #00ceff;
}

.a-dialog-deny-button {
  background-color: #ff005b;
}

.a-dialog-ok-button {
  background-color: #00ceff;
  width: 100%;
}
`;
