import { useContext, useEffect, useState } from "react";
import { colorsArray } from "../utils/ColorsArray";
import VoiceCallBtn from "./VoiceCallBtn";
import VideoCallBtn from "./VideoCallBtn";
import CallerProfilePicture from "./CallerProfilePicture";
import { userContext } from "../Context/UserContext";

function IncomingCall({ handleClick, user, handleDecline }) {
  const [color, setColor] = useState("");
  const { id } = useContext(userContext);

  useEffect(() => {
    const int = parseInt(user?.username.slice(0, 9).length, 10);
    const color = colorsArray[int];
    setColor(color);
  }, [user]);

  if (!user) return;
  return (
    <div className="bg-black w-full h-full bg-opacity-90 fixed z-40">
      <div className="bg-gray-100  m-auto absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col justify-between items-center px-4  py-6 rounded-lg h-80 w-72 shadow-lg">
        <h1 className="text-zinc-700 font-bold text-xl tracking-normal">
          Incoming Call...
        </h1>
        <div className="relative flex justify-center items-center">
          <div className="absolute border-green-500 border-solid border-[3px] w-32 h-32 rounded-full animate-[pulse_1s_linear_infinite]"></div>
          <CallerProfilePicture color={color} user={user} />
          <div className="absolute border-green-500 border-solid border-[3px] w-32 h-32 rounded-full animate-[pulse_1s_linear_infinite] animation-delay-300"></div>
        </div>
        <h2 className="text-zinc-700 text-xl font-medium">{user.username}</h2>
        <ul className="flex gap-3">
          <li className="rounded-full p-3 flex bg-zinc-800">
            <VoiceCallBtn color="white" handleClick={handleClick} />
          </li>
          <li className="rounded-full p-3 flex bg-zinc-800">
            <VideoCallBtn color="white" handleClick={handleClick} />
          </li>
          <li className="rounded-full p-3 flex bg-red-600">
            <button onClick={handleDecline}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default IncomingCall;
