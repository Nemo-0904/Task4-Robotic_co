// frontend/src/pages/ToolsPage.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ToolsPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to access the Tools section.");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <section className="tools-section" style={{ padding: "40px", textAlign: "center" }}>
      <h2 style={{ fontSize: "28px", marginBottom: "10px" }}>Use the Tools</h2>
      <p style={{ fontSize: "18px", maxWidth: "800px", margin: "0 auto 30px" }}>
        This interface allows you to control your robot remotely using a web-based control panel.
        You can navigate the robot, activate its camera, and monitor live feed—all from your browser.
      </p>

      <div style={{ textAlign: "left", maxWidth: "800px", margin: "0 auto 30px" }}>
        <h3 style={{ fontSize: "22px", marginBottom: "10px" }}>Features:</h3>
        <ul style={{ fontSize: "16px", lineHeight: "1.6" }}>
          <li>
            <strong>Remote Control:</strong> Move the robot in all directions using simple button commands.
          </li>
          <li>
            <strong>Live Camera Feed:</strong> Stream real-time video from the robot’s camera directly in your browser.
          </li>
          <li>
            <strong>Secure Access:</strong> Camera access is protected by login credentials to ensure authorized use only.
          </li>
          <li>
            <strong>Responsive Interface:</strong> Optimized layout for both desktop and mobile devices.
          </li>
          <li>
            <strong>Interactive Feedback:</strong> Get real-time updates of the robot's position and system status.
          </li>
        </ul>
      </div>

      <iframe
        src="https://remote-control-app-b072.onrender.com/"
        width="100%"
        height="600"
        frameBorder="0"
        allowFullScreen
        title="Robot Control Interface"
        style={{ border: "1px solid #ccc", borderRadius: "8px" }}
      ></iframe>
    </section>
  );
}

export default ToolsPage;
