import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import type SwiperType from "swiper";
import { Pagination, Autoplay } from "swiper/modules";
import { cn } from "@shared/lib/utils";
import { useTranslation } from "react-i18next";

interface ImageSliderProps {
  urls: string[];
  onChanges: (index: number) => void;
}

const ImageSlider = ({ urls, onChanges }: ImageSliderProps) => {
  const { i18n } = useTranslation();
  const [swiper, setSwiper] = useState<null | SwiperType>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideConfig, setSlideConfig] = useState({
    isBeginning: true,
    isEnd: activeIndex === (urls.length ?? 0) - 1,
  });

  useEffect(() => {
    swiper?.on("slideChange", ({ activeIndex }) => {
      setActiveIndex(activeIndex);
      setSlideConfig({
        isBeginning: activeIndex === 0,
        isEnd: activeIndex === (urls.length ?? 0) - 1,
      });
      onChanges(activeIndex);
    });
  }, [urls, swiper, onChanges]);

  const activeStyles =
    "active:scale-[0.97] grid opacity-100 hover:scale-105 absolute top-1/2 -translate-y-1/2 aspect-square h-8 w-8 z-50 place-items-center rounded-full bg-white";
  const inactiveStyles = "hidden text-gray-400";

  return (
    <div className="group relative aspect-square overflow-hidden rounded-xl w-full h-full">
      <div className="absolute z-10 inset-0 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={(e) => {
            e.preventDefault();
            swiper?.slideNext();
          }}
          className={cn(
            activeStyles,
            `${
              i18n.language === "en" ? "right-3" : "left-3"
            } transition text-white`,
            {
              [inactiveStyles]: slideConfig.isEnd,
              "opacity-100": !slideConfig.isEnd,
            }
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={`w-4 h-4 text-black ${
              i18n.language === "en" ? "rotate-0" : "rotate-180"
            } `}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            swiper?.slidePrev();
          }}
          className={cn(
            activeStyles,
            `${
              i18n.language === "en" ? "left-3" : "right-3"
            } transition text-white`,
            {
              [inactiveStyles]: slideConfig.isBeginning,
              "opacity-100": !slideConfig.isBeginning,
            }
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={`w-4 h-4 text-black ${
              i18n.language === "en" ? "rotate-0" : "rotate-180"
            } `}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
      </div>
      <Swiper
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        onSwiper={(swiper) => setSwiper(swiper)}
        spaceBetween={50}
        slidesPerView={1}
        modules={[Pagination, Autoplay]}
        className="h-full w-full"
      >
        {urls.map((url, i) => (
          <SwiperSlide key={i} className="-z-10 relative h-full w-full">
            <img
              src={url}
              alt="Images"
              className="h-full w-full -z-10 object-fill"
              draggable={false}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageSlider;
