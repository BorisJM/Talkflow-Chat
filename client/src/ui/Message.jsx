import axios from "axios";
import { useEffect, useState } from "react";

function Message({ text, side, bg, selfSide, image, onLoad }) {
  const [imageDimensions, setImageDimensions] = useState({});
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (!image) return;

    async function getImage() {
      const res = await axios.post("/api/messages/getImage", {
        imageName: image,
      });
      setImageUrl(res.data.url);
      const img = new Image();
      img.src = res.data.url;
      img.onload = () => {
        setImageDimensions({
          height: img.height,
          width: img.width,
        });
      };
    }
    getImage();
  }, []);

  return (
    <>
      <div
        className={`w-full ${side} ${selfSide} ${
          text && image
            ? `flex flex-col gap-2 ${
                selfSide === "self-start" ? "items-start" : "items-end"
              }`
            : ""
        }`}
      >
        {text && (
          <span
            className={`${bg} text-gray-50 text-lg  rounded-full px-4 py-1`}
          >
            {text}
          </span>
        )}
        {image && (
          <div
            className={`bg-transparent  flex  ${
              selfSide === "self-end" ? "justify-end" : "justify-start"
            }`}
          >
            <img
              className={`${
                imageDimensions.width <= 500
                  ? `w-[${imageDimensions.width}]`
                  : "w-[500px]"
              } ${
                imageDimensions.height <= 500
                  ? `h-[${imageDimensions.height}]`
                  : "h-[500px]"
              } ${
                imageDimensions.width >= 250
                  ? "max-[1024px]:w-[250px]"
                  : `max-[1024px]:w-[${imageDimensions.width}px]`
              } ${
                imageDimensions.height >= 250
                  ? "max-[1024px]:h-[250px]"
                  : `max-[1024px]:h-[${imageDimensions.height}px]`
              }`}
              loading="lazy"
              onLoad={onLoad}
              alt={`image send by user ${image}`}
              src={imageUrl}
            />
          </div>
        )}
      </div>
    </>
  );
}
export default Message;
