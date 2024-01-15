import { useEffect, useState } from "react";
import Avatar from "./Avatar";
import { colorsArray } from "../utils/ColorsArray";

function Contact({
  username,
  isOnline,
  onClick,
  message,
  border = true,
  picture,
  showSidebar
}) {
  const [color, setColor] = useState("");

  useEffect(() => {
    const int = parseInt(username.slice(0, 9).length, 10);
    const color = colorsArray[int];
    setColor(color);
  }, [username]);

  return (
    <div
      className={`${
        border && "border-b dark:border-[#F6F7F9] dark:border-opacity-10"
      } p-4 flex gap-2 hover:bg-loginRegister dark:hover:bg-[#F6F7F9]  dark:hover:bg-opacity-5 cursor-pointer`}
      onClick={onClick}
    >
      <Avatar
        picture={picture}
        color={color}
        username={username}
        isOnline={isOnline}
      />
      <div className={`md:flex md:flex-col ${showSidebar && 'max-[515px]:hidden'} ${border && 'hidden'} -mt-1 md:max-[880px]:mt-0`}>
        <p className="text-name text-lg dark:text-[#F6F7F9] md:max-[880px]:text-sm">{username}</p>
        <p className="text-message md:max-[880px]:text-sm">{message}</p>
      </div>
    </div>
  );
}

export default Contact;
