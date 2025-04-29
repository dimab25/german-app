"use client";

import React, { useEffect, useRef, useState } from "react";
import "../styles/global.css";

function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLUListElement | null>(null);

  const handleScroll = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const scrollLeft = carousel.scrollLeft;
    const slideWidth = carousel.offsetWidth;

    const newIndex = Math.round(scrollLeft / slideWidth);
    setActiveIndex(newIndex);

    // Play/pause logic
    const slides = Array.from(carousel.children) as HTMLLIElement[];
    slides.forEach((slide, index) => {
      const video = slide.querySelector("video") as HTMLVideoElement;
      if (!video) return;

      if (index === newIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  };

  const handleArrowClick = (direction: -1 | 1) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const slideWidth = carousel.offsetWidth;
    const newIndex = Math.max(0, Math.min(activeIndex + direction, 2));

    carousel.scrollTo({
      left: newIndex * slideWidth,
      behavior: "smooth",
    });

    setActiveIndex(newIndex);
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call

    return () => {
      carousel.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="home-container">
      <h1 style={{ color: "black" }}>How to use DeutschInContext</h1>

      <div className="carousel-wrapper">
        <ul className="carousel" ref={carouselRef}>
          <li>
            <p className="carousel-paragraph">
              1. Chat with your new German teacher
            </p>
            <div>
              <video
                src="/videos/final1.mp4"
                controls
                playsInline
                preload="auto"
                muted
                loop
              />
            </div>
          </li>
          <li>
            <p className="carousel-paragraph">
              2. Select one word or a sentence to get its translation and
              meaning
            </p>
            <div>
              <video
                src="/videos/final2.mp4"
                controls
                playsInline
                preload="auto"
                muted
                loop
              />
            </div>
          </li>
          <li className="third-video">
            <p className="carousel-paragraph">
              3. Create a personal flashcard that you can review at any time!
            </p>
            <div>
              <video
                src="/videos/final3.mp4"
                controls
                playsInline
                preload="auto"
                muted
                loop
              />
            </div>
          </li>
        </ul>

        <div className="carousel-arrows">
          <button
            onClick={() => handleArrowClick(-1)}
            disabled={activeIndex === 0}
            className="carousel-arrow left"
          >
            ◀
          </button>
          <button
            onClick={() => handleArrowClick(1)}
            disabled={activeIndex === 2}
            className="carousel-arrow right"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
