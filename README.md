# Audio & Video Recorder App

A modern, user-friendly React-based application to record audio and video using your device's microphone and camera. Users can preview recordings, download them locally, and optionally save them for later playback.

## Features

- Record audio using `MediaRecorder` with start/stop/clear.
- Record video with live camera preview.
- Real-time recording timer.
- Preview recorded audio/video before saving.
- Download recordings in `.webm` format.
- Save and list previously recorded files using `localStorage`.
- Graceful handling of microphone/camera access permission errors.
- Clean, responsive UI with modern toggle-style tabs.

## USED

- **React** (Latest version via Vite)
- **Vite** for fast development & HMR
- **HTML5 Media APIs** (`MediaRecorder`, `getUserMedia`)
- **localStorage** for managing past recordings
- **CSS-in-JS** (inline styling only, no external CSS needed)

## Steps to Run the Project

1. **Clone the Repository**

   git clone https://github.com/RanjeetG10/audio-video-recorder-app.git
   cd audio-video-recorder-app

2. **install dependencies**
   npm install

3. **Run the Development Server**
   npm run dev

## Issues

    .webm format is used for compatibility with most modern browsers, but older browsers might not support it.

    Mobile browsers may have stricter permissions for camera/mic access, requiring user gestures to initiate recording
