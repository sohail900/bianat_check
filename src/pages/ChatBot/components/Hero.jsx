import React from "react";
import HeroItems from "./HeroItems";

const Hero = ({ message }) => {
  return (
    <>
      {!message && (
        // removed h-full
        <div className="flex flex-col justify-center items-center w-full h-full text-white">
          <img src="/images/companylogo.png" alt="" />
          <div className="grid grid-cols-1  md:grid-cols-2 p-2 md:p-5 gap-1 md:gap-4 w-8/12 items-center">
            <HeroItems
              title={"Welcome to Stock Insight Hub"}
              description={"Got it and Explore more..."}
            />
            <HeroItems
              title={"Real-Time Market Data"}
              description={"Up-To-The-Minute Information"}
            />
            <HeroItems
              title={"In-Depth Analysis and Reports"}
              description={"Help you understand market movements"}
            />
            <HeroItems
              title={"Secure and Reliable"}
              description={"Trust in our secure and reliable platform."}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;
