import React, { useRef, useState } from "react";

const Camera = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState(null);

  const startCamera = async () => {
    if (streaming) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setStreaming(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        setStreaming(true);
      } catch (err) {
        setError("No se pudo acceder a la cámara");
        console.error("Error al acceder a la cámara: ", err);
      }
    }
  };

  return (
    <div>
      <button onClick={startCamera}>
        {streaming ? "Desactivar Cámara" : "Activar Cámara"}
      </button>
      {error && <p>{error}</p>}
      <div>
        <video
          ref={videoRef}
          autoPlay
          style={{ width: "100%", display: streaming ? "block" : "none" }}
        />
      </div>
    </div>
  );
};

export default Camera;
