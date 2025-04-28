"use client";
import React, { useRef } from "react";
import "../styles/global.css";

function Home() {
  const carouselRef = useRef<HTMLUListElement | null>(null);

  const handleDotClick = (index: number) => {
    const carousel = carouselRef.current;
    if (carousel) {
      const videoWidth = carousel.offsetWidth;
      carousel.scrollTo({
        left: index * videoWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="home-container">
      {/* Top paragraph */}
      <p className="home-paragraph">
        Discover how easy it is to use our app! Swipe or click to explore the
        steps below.
      </p>

      <h1 className="home-title">See How It Works 🚀</h1>

      <div className="carousel-wrapper">
        <ul className="carousel" ref={carouselRef}>
          <li>
            <video
              src="/videos/video1.mp4"
              controls
              playsInline
              preload="auto"
              muted
              loop
            />
          </li>
          <li>
            <video
              src="/videos/video2.mp4"
              controls
              playsInline
              preload="auto"
              muted
              loop
            />
          </li>
          <li>
            <video
              src="/videos/video3.mp4"
              controls
              playsInline
              preload="auto"
              muted
              loop
            />
          </li>
        </ul>

        <div className="carousel-indicators">
          <span onClick={() => handleDotClick(0)}></span>
          <span onClick={() => handleDotClick(1)}></span>
          <span onClick={() => handleDotClick(2)}></span>
        </div>
      </div>

      <p className="home-paragraph">
        Start your journey today! Each step is just a swipe or click away 🚀
      </p>
    </div>
  );
}

export default Home;
