import React, { useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignIn,
  RedirectToSignIn,
  UserButton,
} from "@clerk/clerk-react";
import AudioRecorder from "./components/AudioRecorder";
import VideoRecorder from "./components/VideoRecorder";

export default function App() {
  const [mode, setMode] = useState("audio");

  const tabContainerStyle = {
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px",
    backgroundColor: "#e0e0e0",
    borderRadius: "8px",
    padding: "5px",
    gap: "5px",
  };

  const tabStyle = {
    padding: "10px 20px",
    cursor: "pointer",
    borderRadius: "5px",
    fontWeight: "bold",
    fontSize: "16px",
    transition: "background-color 0.3s, color 0.3s",
    flexGrow: 1,
    textAlign: "center",
  };

  const activeTabStyle = {
    backgroundColor: "#fff",
    color: "#333",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  };

  const inactiveTabStyle = {
    backgroundColor: "transparent",
    color: "#666",
  };

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <SignedIn>
        <div
          style={{
            textAlign: "center",
            fontFamily: "Arial, sans-serif",
            padding: "30px",
            background: "#f8f9fa",
            minHeight: "100vh",
          }}
        >
          {/* Header */}
          <header
            style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}
          >
            <UserButton />
          </header>

          {/* Title */}
          <h1
            style={{
              fontSize: "1.75rem",
              marginBottom: "20px",
              color: "#333",
              textAlign: "center",
              maxWidth: "900px",
              margin: "0 auto 20px auto",
            }}
          >
            Audio & Video Recorder
          </h1>

          {/* Tab Switcher */}
          <div
            style={{
              ...tabContainerStyle,
              maxWidth: "300px",
              margin: "0 auto 30px auto",
            }}
          >
            <div
              style={{
                ...tabStyle,
                ...(mode === "audio" ? activeTabStyle : inactiveTabStyle),
              }}
              onClick={() => setMode("audio")}
            >
              Audio
            </div>
            <div
              style={{
                ...tabStyle,
                ...(mode === "video" ? activeTabStyle : inactiveTabStyle),
              }}
              onClick={() => setMode("video")}
            >
              Video
            </div>
          </div>

          {/* Recorder Component */}
          <div
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              background: "#fff",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 0 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            {mode === "audio" ? <AudioRecorder /> : <VideoRecorder />}
          </div>
        </div>
      </SignedIn>
    </>
  );
}
