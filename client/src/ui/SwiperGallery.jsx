import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import { useState } from "react";
function SwiperGallery({ images, handleClick, activeSlide }) {
  return (
    <Swiper
      initialSlide={activeSlide}
      slidesPerView={1}
      spaceBetween={500}
      loop={true}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      modules={[Pagination, Navigation]}
      className="mySwiper absolute w-full h-full right-0 top-0 bg-black bg-opacity-80 overflow-hidden"
    >
      <button
        className="absolute z-10 right-0 top-0 -translate-x-1/2 translate-y-1/2 flex gap-2 items-center"
        onClick={handleClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="#fff"
          className="w-10 h-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      {images.map((img, i) => (
        <SwiperSlide
          className={`text-center flex justify-center items-center`}
          key={i}
        >
          {img === "" ? (
            <h1 className="text-3xl text-zinc-50">
              This user has no profile picture yet 😥.
            </h1>
          ) : (
            <img
              className={`max-w-7xl max-h-screen max-[1440px]:max-w-6xl  max-[1200px]:max-w-4xl  max-[800px]:max-w-2xl`}
              src={`${
                images.length === 1
                  ? `https://talkflow-zy0f.onrender.com/uploads/profile-pictures/${img}`
                  : img
              }`}
              alt="image sent by user"
            />
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default SwiperGallery;
