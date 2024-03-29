import axios from "axios";
import { useEffect, useState } from "react";
import SwiperGallery from "./SwiperGallery";

function Sidebar({ children, selectedUser }) {
  const [showGallery, setShowGallery] = useState(false);
  const [images, setImages] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [showSwiper, setShowSwiper] = useState(false);
  const { userId, picture } = selectedUser;

  useEffect(() => {
    if (!showGallery) return;
    axios.get("/api/messages/getImages/" + userId).then((res) => {
      setImages(res.data);
    });
  }, [showGallery]);

  return (
    <div className="col-span-2 lg:col-span-1 overflow-y-scroll  transition-all duration-200 dark:bg-[#2b303b] bg-white flex flex-col gap-5 items-center p-3">
      {children}
      <ul className="flex gap-4 justify-center w-full px-10">
        <li className="bg-zinc-700 rounded-full flex justify-center p-1.5">
          <button
            onClick={() => {
              setShowSwiper(true);
              setShowGallery(false);
              setImages([picture]);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#fff"
              className="w-7 h-7"
            >
              <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </li>
        <li className="bg-zinc-700 rounded-full flex justify-center p-1.5">
          {" "}
          <button onClick={() => setShowGallery((bol) => !bol)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#fff"
              className="w-7 h-7"
            >
              <path
                fillRule="evenodd"
                d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </li>
      </ul>
      {showGallery && (
        <div className="grid grid-cols-3 gap-1 max-[1440px]:grid-cols-2">
          {images.map((img, i) => (
            <button
              key={i}
              className="overflow-hidden bg-transparent dark:border-[#F6F7F9] dark:border-opacity-10 border"
              onClick={() => {
                setShowSwiper(true);
                setActiveSlide(i);
              }}
            >
              <img
                className="hover:scale-125 w-full h-20 transition-all duration-200"
                src={img}
                alt="photo from user"
              />
            </button>
          ))}
        </div>
      )}
      {showSwiper && (
        <SwiperGallery
          activeSlide={activeSlide}
          images={images}
          handleClick={() => setShowSwiper(false)}
        />
      )}
    </div>
  );
}

export default Sidebar;
