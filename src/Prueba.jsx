import React, { useEffect, useRef, useState } from "react";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import Marquee from "react-fast-marquee";
import { Button, Card, CircularProgress, Tooltip } from "@nextui-org/react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MediaPipeComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handsRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const camera = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (cameraActive) {
      toast.success("Camara On", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    } else {
      toast.error("Camara Off", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  }, [cameraActive]);

  useEffect(() => {
    const loadHands = async () => {
      const { Hands } = await import("@mediapipe/hands");

      const onResults = (results) => {
        const canvasCtx = canvasRef.current.getContext("2d");
        canvasCtx.save();
        canvasCtx.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        canvasCtx.drawImage(
          results.image,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );

        if (results.multiHandLandmarks) {
          for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(canvasCtx, landmarks, Hands.HAND_CONNECTIONS, {
              color: "#00FF00",
              lineWidth: 5,
            });
            drawLandmarks(canvasCtx, landmarks, {
              color: "#FF0000",
              lineWidth: 2,
            });
          }
        }
        canvasCtx.restore();
      };

      const hands = new Hands({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      hands.onResults(onResults);

      handsRef.current = hands;
    };

    loadHands();

    return () => {
      if (handsRef.current) {
        handsRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const loadCamera = async () => {
      const module = await import("@mediapipe/camera_utils");
      return module.Camera;
    };

    const startCamera = async () => {
      const Camera = await loadCamera();

      if (cameraActive && videoRef.current) {
        camera.current = new Camera(videoRef.current, {
          onFrame: async () => {
            if (!isLoading) {
              setIsLoading(false);
            }

            await handsRef.current.send({ image: videoRef.current });
            setIsLoading(false);
          },
          width: 640,
          height: 480,
        });
        camera.current.start();
      } else if (camera.current) {
        camera.current.stop();
        const canvasCtx = canvasRef.current.getContext("2d");
        canvasCtx.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        canvasCtx.fillStyle = "black";
        canvasCtx.fillRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
      }
    };

    if (cameraActive) {
      startCamera();
    }

    return () => {
      if (camera.current) {
        camera.current.stop();
        setIsLoading(false);
        const canvasCtx = canvasRef.current.getContext("2d");
        canvasCtx.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        canvasCtx.fillStyle = "black";
        canvasCtx.fillRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
      }
    };
  }, [cameraActive]);

  const toggleCamera = () => {
    setIsLoading(true);
    setCameraActive(!cameraActive);
  };

  return (
    <div>
      <Marquee
        className="overflow-hidden mt-5"
        gradient={true}
        gradientColor={"#1c1c1c"}
        pauseOnHover={true}
        speed={50}
        gradientWidth={100}
      >
        <h1 className="text-7xl text-gray-300 font-thin">
          {` Bienvenido `}
          Welcome Bienvenue Willkommen Benvenuto
          {` 欢迎 `}
        </h1>
      </Marquee>
      <Card className="md:mx-[35%] grid place-items-center text-2xl mt-10 p-3">
        <p>
          Esta página web te ayudará a traducir LSH (Lenguas de Señas Mexicanas)
          a través de la cámara.
        </p>
      </Card>
      <div className="md:mx-[35%] grid place-items-center text-2xl mt-2 p-3">
        <p>Presiona el icono de la cámara para comenzar a traducir.</p>
      </div>
      <div className="grid place-items-center mt-1">
        <Button
          size="lg"
          className="py-[6rem] mb-5"
          radius="full"
          onClick={toggleCamera}
          variant="light"
          color="warning"
        >
          <lord-icon
            src="https://cdn.lordicon.com/vneufqmz.json"
            trigger="hover"
            style={{ width: "150px", height: "150px" }}
          ></lord-icon>
        </Button>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-2 mb-10">
          <div>
            <video ref={videoRef} style={{ display: "none" }}></video>
            {isLoading ? (
              <div className="grid place-items-center">
                <CircularProgress size="lg" aria-label="Loading..." />
              </div>
            ) : null}
            <canvas
              className="rounded-lg transition-all shadow-lg shadow-black"
              ref={canvasRef}
              width="640"
              height="480"
            ></canvas>
          </div>
          <div className="grid place-items-center md:my-0 my-6">
            <Card className="w-[80%] p-4 text-xl text-gray-300">
              Ejemplo de como se vera el texto
            </Card>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default MediaPipeComponent;
