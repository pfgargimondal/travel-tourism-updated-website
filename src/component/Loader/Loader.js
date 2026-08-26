import { useEffect, useRef, useState } from "react";

import "./Loader.css";



const ICONS = [
  {
    name: "airplane",
    transform: "rotate(45deg)",
    markup: `<path fill="#ffffff" d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2.5 2v1.5l4-1 4 1V21l-2.5-2v-5.5z"/>`,
  },
  {
    name: "bus",
    transform: "none",
    markup: `
      <rect x="3" y="6" width="18" height="10" rx="2" fill="#ffffff"/>
      <rect x="5" y="8" width="4" height="3" rx="0.5" fill="var(--brand-dark)"/>
      <rect x="10.5" y="8" width="4" height="3" rx="0.5" fill="var(--brand-dark)"/>
      <rect x="16" y="8" width="2" height="3" rx="0.5" fill="var(--brand-dark)"/>
      <circle cx="7" cy="18" r="1.8" fill="#ffffff"/>
      <circle cx="7" cy="18" r="0.8" fill="var(--brand-dark)"/>
      <circle cx="17" cy="18" r="1.8" fill="#ffffff"/>
      <circle cx="17" cy="18" r="0.8" fill="var(--brand-dark)"/>
    `,
  },
  {
    name: "hotel",
    transform: "none",
    markup: `
      <rect x="7" y="3" width="10" height="18" rx="1" fill="#ffffff"/>
      <rect x="9.3" y="6" width="2" height="2" fill="var(--brand-dark)"/>
      <rect x="12.7" y="6" width="2" height="2" fill="var(--brand-dark)"/>
      <rect x="9.3" y="10" width="2" height="2" fill="var(--brand-dark)"/>
      <rect x="12.7" y="10" width="2" height="2" fill="var(--brand-dark)"/>
      <rect x="9.3" y="14" width="2" height="2" fill="var(--brand-dark)"/>
      <rect x="12.7" y="14" width="2" height="2" fill="var(--brand-dark)"/>
      <rect x="10.5" y="18" width="3" height="3" fill="var(--brand-dark)"/>
    `,
  },
  {
    name: "suitcase",
    transform: "none",
    markup: `
      <rect x="4" y="8" width="16" height="12" rx="2" fill="#ffffff"/>
      <rect x="9" y="4.2" width="6" height="4" rx="1.2" fill="none" stroke="#ffffff" stroke-width="1.6"/>
      <rect x="10.4" y="12.5" width="3.2" height="2" rx="0.5" fill="var(--brand-dark)"/>
    `,
  },
  {
    name: "pin",
    transform: "none",
    markup: `<path fill="#ffffff" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/>`,
  },
];
 
const CYCLE_MS = 200;
const FADE_MS = 220;



const Loader = ({ label = "Please wait, While we are fetching your result..." }) => {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const reduceMotion = useRef(false);
 
  useEffect(() => {
    reduceMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
 
    const interval = setInterval(() => {
      if (reduceMotion.current) {
        setIndex((prev) => (prev + 1) % ICONS.length);
        return;
      }
 
      setFading(true);
 
      const timeout = setTimeout(() => {
        setIndex((prev) => (prev + 1) % ICONS.length);
        setFading(false);
      }, FADE_MS);
 
      return () => clearTimeout(timeout);
    }, CYCLE_MS);
 
    return () => clearInterval(interval);
  }, []);
 
  const currentIcon = ICONS[index];



  return (
    <div className="tp-preloader">
      <div className="tp-badge">
        <div className="tp-badge-ring" />
        <div className="tp-badge-ring tp-spin" />
 
        <div className="tp-badge-core">
          <div
            className={`tp-icon-wrap ${fading ? "tp-fade" : ""}`}
          >
            <svg
              viewBox="0 0 24 24"
              style={{ transform: currentIcon.transform }}
              dangerouslySetInnerHTML={{ __html: currentIcon.markup }}
            />
          </div>
        </div>
      </div>
 
      <p className="tp-label mb-0">{label}</p>
    </div>
  );
};



export default Loader; 