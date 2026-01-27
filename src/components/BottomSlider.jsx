import { useEffect, useRef, useState } from "react";
import "./BottomSlider.css";
import bannar from "../assets/bannar.png";

const SLIDE_DURATION = 20000;

const slides = [
  { type: "ad", adSlot: "1234567890" },
  { type: "image", src: bannar },
  { type: "ad", adSlot: "2345678901" },
  { type: "image", src: bannar },
  { type: "ad", adSlot: "3456789012" }
];

const BottomSlider = () => {
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const intervalRef = useRef(null);
  const startX = useRef(0);
  const pausedRef = useRef(false);

  /* Detect screen size */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* Auto slide (DESKTOP ONLY) */
  useEffect(() => {
    if (isMobile) return;

    intervalRef.current = setInterval(() => {
      if (!pausedRef.current) {
        setIndex(prev => (prev + 1) % slides.length);
      }
    }, SLIDE_DURATION);

    return () => clearInterval(intervalRef.current);
  }, [isMobile]);

  /* Load Google Ads only on desktop */
  useEffect(() => {
    if (isMobile) return;

    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (e) {}
  }, [index, isMobile]);

  /* =====================
     MOBILE → ONLY BANNER
  ====================== */
  if (isMobile) {
    return (
      <div className="bottom-slider mobile-only">
        <img src={bannar} alt="banner" />
      </div>
    );
  }

  /* =====================
     DESKTOP → FULL SLIDER
  ====================== */
  return (
    <div
      className="bottom-slider"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
      onTouchStart={e => (startX.current = e.touches[0].clientX)}
      onTouchEnd={e => {
        const diff = startX.current - e.changedTouches[0].clientX;
        if (diff > 50) setIndex(i => (i + 1) % slides.length);
        if (diff < -50)
          setIndex(i => (i - 1 + slides.length) % slides.length);
      }}
    >
      <div
        className="slider-track"
        style={{ transform: `translateX(-${index * 100}vw)` }}
      >
        {slides.map((slide, i) => (
          <div className="slide" key={i}>
            {slide.type === "image" ? (
              <img src={slide.src} alt={`slide-${i}`} />
            ) : (
              <div className="ad-container">
                <ins
                  className="adsbygoogle"
                  style={{ display: "block", height: "100px" }}
                  data-ad-client="ca-pub-2799227154500169"
                  data-ad-slot={slide.adSlot}
                  data-ad-format="horizontal"
                  data-full-width-responsive="true"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BottomSlider;
