import React, { useRef, useState, useEffect } from 'react';

export default function AudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [pendingSave, setPendingSave] = useState(false);

  const chunks = useRef([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('audio-recordings')) || [];
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
    localStorage.setItem('audio-recordings', JSON.stringify(updated));
    setRecordings(updated);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (e) => chunks.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        setPendingSave(true);
        stream.getTracks().forEach((track) => track.stop());
        chunks.current = [];
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);

      const id = setInterval(() => setTimer((prev) => prev + 1), 1000);
      setIntervalId(id);
    } catch {
      alert('Microphone access denied.');
    }
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setRecording(false);
    clearInterval(intervalId);
  };

  const clearRecording = () => {
    setAudioURL(null);
    setTimer(0);
    setPendingSave(false);
  };

  const handleSave = () => {
    saveToLocalStorage(audioURL);
    clearRecording();
  };

  const handleDiscard = () => {
    clearRecording();
  };

  const deleteRecording = (index) => {
    const updated = [...recordings];
    updated.splice(index, 1);
    setRecordings(updated);
    localStorage.setItem('audio-recordings', JSON.stringify(updated));
  };

  return (
    <div style={{ textAlign: 'center' }}>
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
        <button onClick={clearRecording} style={buttonStyle('#9e9e9e')}>
          Clear
        </button>
      </div>

      {recording && (
        <p style={{ fontSize: '16px', marginTop: '8px' }}>
          Recording... ⏱ {formatTime(timer)}
        </p>
      )}

      {pendingSave && audioURL && (
        <div style={{ marginTop: '20px' }}>
          <audio controls src={audioURL} style={{ width: '100%' }} />
          <div style={{ marginTop: '10px' }}>
            <button onClick={handleSave} style={buttonStyle('#4caf50')}>
              Save
            </button>
            <button onClick={handleDiscard} style={buttonStyle('#9e9e9e')}>
              Discard
            </button>
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
                <audio controls src={rec.url} style={{ width: '100%' }} />
                <div style={{ marginTop: '5px' }}>
                  <a href={rec.url} download={`audio-${i + 1}.webm`}>
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

function formatTime(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}
