"use client";

import Image from "next/image";

export default function HeroSection() {
  return (
    <div id="front">
      <Image
        src="https://americancareercollege.edu/pulse_images/slideshow/pulseslide_78_49854169526_33f3e8b22e.jpg"
        alt="Hero"
        fill
        priority
      />
      <h1>Welcome to BASIS International and Bilingual Schools·China Tech Tools</h1>
    </div>
  );
}