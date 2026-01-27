import { useEffect, useRef, useState } from "react";

const CARD_W = 220;
const CARD_H = 300;
const MAX_VISIBLE = 14;

const CanvasWall = ({ snaps }) => {
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [items, setItems] = useState([]);

  /* Initialize positions */
  useEffect(() => {
    const init = snaps.map(() => ({
      x: Math.random() * 800,
      y: Math.random() * 600,
      r: Math.random() * 8 - 4
    }));
    setItems(init);
  }, [snaps]);

  /* Zoom logic like Google Maps */
  useEffect(() => {
    if (snaps.length > MAX_VISIBLE) {
      setZoom((z) => Math.max(0.5, z - 0.05));
    }
  }, [snaps.length]);

  /* Draw loop */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - 160;
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      snaps.forEach((snap, i) => {
        const pos = items[i];
        if (!pos) return;

        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate((pos.r * Math.PI) / 180);
        ctx.scale(zoom, zoom);

        /* Card */
        ctx.fillStyle = "#fff";
        ctx.shadowColor = "rgba(0,0,0,0.25)";
        ctx.shadowBlur = 25;
        ctx.fillRect(0, 0, CARD_W, CARD_H);

        /* Image */
        const img = new Image();
        img.src = snap.img;
        img.onload = () => {
          ctx.drawImage(img, 10, 10, CARD_W - 20, 170);
        };

        /* Text */
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#000";
        ctx.font = "14px sans-serif";
        ctx.fillText(snap.title, 12, 205);
        ctx.font = "12px sans-serif";
        ctx.fillText(`📍 ${snap.location}`, 12, 225);
        ctx.fillStyle = "#777";
        ctx.fillText(`Printed on Earth — ${snap.year}`, 12, 245);

        ctx.restore();
      });

      requestAnimationFrame(draw);
    };

    draw();

    return () => window.removeEventListener("resize", resize);
  }, [snaps, items, zoom]);

  return <canvas ref={canvasRef} />;
};

export default CanvasWall;
