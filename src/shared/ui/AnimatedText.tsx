import { motion } from "framer-motion";
import React from "react";
import { twMerge } from "tailwind-merge";

interface AnimatedTextProps extends React.HTMLAttributes<HTMLDivElement> {
  children: string | JSX.Element;
  delay?: number;
}
const animation = {
  initial: { y: "100%" },
  enter: (i: number) => ({
    y: "0",
    transition: { duration: 0.75, ease: [0.33, 1, 0.68, 1], delay: 0.075 * i },
  }),
};

const AnimatedText = ({ className, children, delay }: AnimatedTextProps) => {
  return (
    <div className="overflow-hidden">
      <motion.h1
        variants={animation}
        initial="initial"
        whileInView="enter"
        custom={delay}
        viewport={{ once: true }}
        className={twMerge(className)}
      >
        {children}
      </motion.h1>
    </div>
  );
};

export default AnimatedText;
