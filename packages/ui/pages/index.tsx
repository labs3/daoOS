import React from "react";
import FancyPalmStripSection from "../components/marketing/FancyPalmStripSection";
import HowDoesItWorkSection from "../components/marketing/HowDoesItWorkSection";
import LandingHeader from "../components/marketing/HeaderSection";
import HeroSection from "../components/marketing/HeroSection";
import WhatIsMiaCoinSection from "../components/marketing/WhatIsMiaCoinSection";
import WhoIsMvSection from "../components/marketing/WhoIsMVSection";
import BottomSection from "../components/marketing/BottomSection";

export default function Landing() {
  return (
    <>
      <LandingHeader>
        <HeroSection />
      </LandingHeader>
      <main>
        <WhoIsMvSection />
        <HowDoesItWorkSection />
        <WhatIsMiaCoinSection />
        <FancyPalmStripSection />
        <BottomSection />
      </main>
    </>
  );
}
