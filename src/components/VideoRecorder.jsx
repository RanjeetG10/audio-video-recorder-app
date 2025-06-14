import React, { useRef, useState, useEffect } from 'react';

export default function VideoRecorder() {
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [pendingSave, setPendingSave] = useState(false);
  const videoRef = useRef();
  const streamRef = useRef(null);
  const chunks = useRef([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('video-recordings')) || [];
    setRecordings(saved);
  }, []);

  const saveToLocalStorage = (url) => {
    const updated = [
      ...recordings,
      {
        url,
        time: new Date().toLocaleString(),
      },
    ];
    localStorage.setItem('video-recordings', JSON.stringify(updated));
    setRecordings(updated);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;

      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (e) => chunks.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoURL(url);
        setPendingSave(true);
        chunks.current = [];
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch {
      alert('Camera or microphone access denied.');
    }
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setRecording(false);
  };

  const handleSave = () => {
    saveToLocalStorage(videoURL);
    setVideoURL(null);
    setPendingSave(false);
  };

  const handleDiscard = () => {
    setVideoURL(null);
    setPendingSave(false);
  };

  const deleteRecording = (index) => {
    const updated = [...recordings];
    updated.splice(index, 1);
    setRecordings(updated);
    localStorage.setItem('video-recordings', JSON.stringify(updated));
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div>
        <video
          ref={videoRef}
          autoPlay
          muted
          style={{ width: '100%', borderRadius: '10px', marginBottom: '15px' }}
        />
      </div>

      <div style={{ marginTop: '15px' }}>
        {!recording ? (
          <button onClick={startRecording} style={buttonStyle('#4CAF50')}>
            Start Recording
          </button>
        ) : (
          <button onClick={stopRecording} style={buttonStyle('#f44336')}>
            Stop Recording
          </button>
        )}
      </div>

      {pendingSave && videoURL && (
        <div style={{ marginTop: '20px' }}>
          <video controls src={videoURL} style={{ width: '100%', borderRadius: '10px' }} />
          <div style={{ marginTop: '10px' }}>
            <button onClick={handleSave} style={buttonStyle('#4caf50')}>Save</button>
            <button onClick={handleDiscard} style={buttonStyle('#9e9e9e')}>Discard</button>
          </div>
        </div>
      )}

      {recordings.length > 0 && (
        <div style={{ marginTop: '30px', textAlign: 'left' }}>
          <h3>Past Recordings</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {recordings.map((rec, i) => (
              <li key={i} style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '14px', marginRight: '10px' }}>{rec.time}</span>
                <video controls src={rec.url} style={{ width: '100%', borderRadius: '10px' }} />
                <div style={{ marginTop: '5px' }}>
                  <a href={rec.url} download={`video-${i + 1}.webm`}>
                    <button style={buttonStyle('#607d8b')}>Download</button>
                  </a>
                  <button
                    onClick={() => deleteRecording(i)}
                    style={buttonStyle('#e53935')}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function buttonStyle(color) {
  return {
    padding: '10px 20px',
    margin: '5px',
    background: color,
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  };
}
