import React, { useRef, useState } from "react";

import { motion } from "framer-motion";

const animation = {
  hidden: {
    y: 90,
    rotateX: 30,
    opacity: 0,
  },
  visible: (i: number) => ({
    y: 0,
    rotateX: 0,
    opacity: 1,
    transition: {
      duration: 1.6,
      ease: [0.6, 0.01, -0.05, 0.95],
      delay: i,
    },
  }),
};

const Video = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);

  const handlePlay = () => {
    videoRef.current?.play();
    setIsPlaying(true);
  };
  const handlePause = () => {
    videoRef.current?.pause();
    setIsPlaying(false);
  };

  return (
    <>
      {isPlaying ? (
        <motion.button
          variants={animation}
          initial="hidden"
          animate="visible"
          custom={0.8}
          onClick={handlePause}
          className="absolute md:h-20 md:w-20 h-14 w-14 bg-blue-600 rounded-full z-40 text-white flex justify-center items-center"
        >
          <PasueIcon />
        </motion.button>
      ) : (
        <motion.button
          variants={animation}
          initial="hidden"
          animate="visible"
          custom={0.6}
          onClick={handlePlay}
          className="absolute md:h-20 md:w-20 h-14 w-14 bg-blue-600 rounded-full z-40 text-white flex justify-center items-center"
        >
          <PlayIcon />
        </motion.button>
      )}
      <div className="perspective">
        <motion.video
          loop
          variants={animation}
          initial="hidden"
          animate="visible"
          autoPlay
          onClick={handlePause}
          custom={0.4}
          muted
          ref={videoRef}
          className="rounded-xl border-2 md:border-8 border-blue-600 cursor-pointer md:h-1/2 object-cover"
        >
          <source src="/videos/landing.mp4" type="video/mp4" />
        </motion.video>
      </div>
    </>
  );
};

const PlayIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6"
    >
      <path
        fill-rule="evenodd"
        d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
        clip-rule="evenodd"
      />
    </svg>
  );
};

const PasueIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6"
    >
      <path
        fill-rule="evenodd"
        d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
        clip-rule="evenodd"
      />
    </svg>
  );
};

export default Video;
