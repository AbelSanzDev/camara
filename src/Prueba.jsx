import React, { useEffect, useRef, useState } from "react";
import Marquee from "react-fast-marquee";
import { Button, Card, CircularProgress } from "@nextui-org/react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "./assets/JIGSA.png";

const signos = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "ñ",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "ayuda",
  "por favor",
  "gracias",
  "hospital",
  "hola",
];

const MediaPipeComponent = () => {
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Cambiar el estado inicial a true
  const [detections, setDetections] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8765");

    ws.onopen = () => {
      console.log("Conectado al servidor WebSocket");
      setIsLoading(false); // Desactivar el modal cuando la conexión esté abierta
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setDetections(data.detections);

      // Renderizar la imagen en el canvas
      const canvasCtx = canvasRef.current.getContext("2d");
      const img = new Image();
      img.src = `data:image/jpeg;base64,${data.image}`;
      img.onload = () => {
        canvasCtx.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        canvasCtx.drawImage(
          img,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
      };
    };

    ws.onclose = () => {
      console.log("Desconectado del servidor WebSocket");
      setIsLoading(true); // Volver a mostrar el modal si se desconecta
    };

    return () => {
      ws.close();
    };
  }, []);

  const toggleCamera = () => {
    setIsLoading(true); // Mostrar el modal cuando se activa la cámara
    setCameraActive(!cameraActive);
  };

  return (
    <>
      <div className="h-full w-full pt-1 m-0 bg-gradient-to-tr  from-[#f3ccd5] to-[#bac1ee]">
        <Marquee
          className="overflow-hidden mt-5"
          gradient={true}
          gradientColor={"#bac1ee65"}
          pauseOnHover={true}
          speed={50}
          gradientWidth={100}
        >
          <h1 className="text-7xl text-[#51608a] font-thin">
            Bienvenido a JIGSA Bienvenido a JIGSA
          </h1>
        </Marquee>
        <div className="grid lg:grid-cols-3 grid-cols-1 items-center mt-2">
          <div></div>
          <div className=" text-[#51608a] text-center text-2xl mt-10 p-3">
            <p>
              Esta página web te ayudará a traducir LSM (Lenguas de Señas
              Mexicanas) a través de la cámara.
            </p>
          </div>
          <div className="flex lg:justify-end justify-center pr-7">
            <img
              className="w-[10rem]   rounded-full"
              src={logo}
              alt="Logo JIGSA"
            />
          </div>
        </div>
        <div className="grid place-items-center pb-[10rem] mt-1">
          {/* <Button
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
          </Button> */}
          <div className="grid md:grid-cols-2 grid-cols-1 gap-2 mb-10">
            <div>
              {/* {isLoading ? (
                <div className="grid place-items-center">
                  <CircularProgress size="lg" aria-label="Loading..." />
                </div>
              ) : null} */}
              <canvas
                className="rounded-lg transition-all shadow-lg shadow-black"
                ref={canvasRef}
                width="640"
                height="480"
              ></canvas>
            </div>
            <div className="grid place-items-center md:my-0 my-6">
              <div className="w-[80%] bg-gray-100 shadow-sm shadow-[#f3ccd5] rounded-lg p-4 text-xl text-gray-700">
                <h2>Detecciones</h2>
                <ul>
                  {detections.map((det, index) => (
                    <li key={index}>
                      Clase:{" "}
                      <span className="text-5xl text-gray-700 font-bold">
                        {signos[det.class]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* Modal de carga */}
        {false && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="gradient-shadow bg-gradient-to-tr  from-[#f3ccd5] to-[#757db5] grid place-items-center p-6 rounded-full shadow-lg text-center animate-spin">
              <CircularProgress
                color="secondary"
                size="lg"
                aria-label="Loading..."
              />
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    </>
  );
};

export default MediaPipeComponent;
