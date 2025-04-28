"use client";

import React, { useEffect, useRef } from "react";
import "../styles/global.css";

function Home() {
  const carouselRef = useRef<HTMLUListElement | null>(null);

  const handleDotClick = (index: number) => {
    const carousel = carouselRef.current;
    if (carousel) {
      const slideWidth = carousel.offsetWidth;
      carousel.scrollTo({
        left: index * slideWidth,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const slides = Array.from(carousel.children) as HTMLLIElement[];
    const carouselRect = carousel.getBoundingClientRect();
    const carouselCenter = carouselRect.left + carouselRect.width / 2;

    slides.forEach((slide) => {
      const slideRect = slide.getBoundingClientRect();
      const slideCenter = slideRect.left + slideRect.width / 2;
      const video = slide.querySelector("video") as HTMLVideoElement;

      if (video) {
        const distance = Math.abs(carouselCenter - slideCenter);
        if (distance < slideRect.width / 2) {
          // If this slide is the closest to the center, play the video
          video.play().catch(() => {
            // Sometimes browser blocks autoplay - catch errors silently
          });
        } else {
          video.pause();
        }
      }
    });
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.addEventListener("scroll", handleScroll);
    handleScroll(); // Run once on mount to set the correct video

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
          <li>
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

        <div className="carousel-indicators">
          <span onClick={() => handleDotClick(0)} />
          <span onClick={() => handleDotClick(1)} />
          <span onClick={() => handleDotClick(2)} />
        </div>
      </div>
    </div>
  );
}

export default Home;
