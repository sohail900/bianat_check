import React, { useRef } from "react";

const Slider = () => {
  const firstText = useRef(null);
  const secondText = useRef(null);
  const slider = useRef(null);
  return (
    <div>
      <div ref={slider}>
        <p ref={firstText}>Freelance Developer -</p>
        <p ref={secondText}>Freelance Developer -</p>
      </div>
    </div>
  );
};

export default Slider;
