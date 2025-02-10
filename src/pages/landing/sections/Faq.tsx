import AnimatedText from "@shared/ui/AnimatedText";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type Question = {
  question: string;
  answer: string;
  active: boolean;
};

const questions: Question[] = [
  {
    question: "What Makes Bianat Different From Other Stock platforms?",
    answer: "Bianat was developed from the ground up in order",
    active: false,
  },
  {
    question:
      "Do You Have To Be An Experienced Investor To Use Bianat, Or Can Beginners Use It Too?",
    answer: "Bianat works for investors of all experience levels",
    active: false,
  },
  {
    question: "What If I Have Questions About How To Use Bianat?",
    answer: "Our experienced Bianat Coaches are just a phone call",
    active: false,
  },
  {
    question:
      "Do Bianat Members Get Any Extras Like Webinars, Videos Or Market Analysis?",
    answer: "Yes! Bianat members get access to new webinars",
    active: false,
  },
  {
    question: "Can I Use Bianat On Multiple Computers Or Devices?",
    answer:
      "Yes, your subscription allows you to use Bianat on all of your devices: desktop, tablet and mobile",
    active: false,
  },
  {
    question: "How Much Does Bianat Cost?",
    answer: "Bianat Basic plan subscription costs SR1499/ year.",
    active: false,
  },
  {
    question: "Can I Cancel My Bianat Membership?",
    answer:
      "You can cancel any time. Just send an email to us at info@bianat.sa and explain why you want to leave us.",
    active: false,
  },
];

const animation = {
  initial: {
    opacity: 0,
    y: 90,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.6, 0.01, -0.05, 0.95],
    },
  },

  answerInitial: {
    opacity: 0,
    y: 90,
  },
  answerAnimate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.6, 0.01, -0.05, 0.95],
    },
  },

  questionInitial: {
    rotateX: 90,
    opacity: 0,
    y: 90,
  },
  questionAnimate: {
    rotateX: 0,
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.6, 0.01, -0.05, 0.95],
    },
  },
};

const Faq = () => {
  const { t, i18n } = useTranslation();
  const [questionsState, setQuestionsState] = useState<Question[]>(questions);

  const handleQuestionClick = (index: number) => {
    const newQuestions = [...questionsState];
    newQuestions[index].active = !newQuestions[index].active;
    setQuestionsState(newQuestions);
  };

  return (
    <div
      id="faq"
      className="w-full flex flex-col items-center mb-24 text-center"
    >
      <AnimatedText delay={0.6} className="text-3xl">
        <>
          {t("Frequently Asked Questions")
            .split(" ")
            .map((word, index) => (
              <span
                key={index}
                className={`inline-block mx-1 ${index == 1 && "text-blue-600"}`}
              >
                {word}
              </span>
            ))}
        </>
      </AnimatedText>
      <AnimatedText delay={0.8} className="mt-5 text-black text-opacity-80">
        {t(
          "Get answers to some of the most common questions about Bianat platform."
        ).toString()}
      </AnimatedText>
      <motion.div
        variants={animation}
        whileInView="animate"
        viewport={{ once: true }}
        initial="initial"
        className="mt-12 bg-white p-4 rounded-xl shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] space-y-2 max-w-2xl"
      >
        {questionsState.map(({ question, answer, active }, index) => (
          <motion.div
            variants={animation}
            whileInView="questionAnimate"
            viewport={{ once: true }}
            initial="questionInitial"
            key={index}
            className="flex flex-col space-y-2 overflow-hidden"
          >
            <button
              onClick={() => handleQuestionClick(index)}
              className={`bg-blue-600 w-full text-white p-4 rounded-xl flex justify-between items-center ${
                i18n.language === "en" ? "text-left" : "text-right"
              }`}
            >
              {index + 1}. {t(question).toString()}{" "}
              <ArrowIcon active={active} />
            </button>
            {active && (
              <motion.p
                variants={animation}
                initial="answerInitial"
                animate="answerAnimate"
                className={`${
                  i18n.language === "en" ? "text-left ml-2" : "text-right mr-2"
                }`}
              >
                {t(answer).toString()}
              </motion.p>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

interface ArrowIconProps {
  active: boolean;
}

const ArrowIcon = ({ active }: ArrowIconProps) => {
  const { i18n } = useTranslation();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={5}
      stroke="currentColor"
      className={`${active ? "rotate-180" : "rotate-0"} transition-all ${
        i18n.language === "en" ? "ml-5" : "mr-5"
      } max-w-[20px] max-h-[20px] min-w-[20px] min-h-[20px]`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
};

export default Faq;
