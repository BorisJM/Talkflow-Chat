import ProfilePicture from "./ProfilePicture";
import { colorsArray } from "../utils/ColorsArray";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import VideoCam from "./VideoCam";

function CallingUser({ children, playTimer}) {
  const [color, setColor] = useState("");
  const { selectedUser } = useSelector((state) => state.users);
const {showCam, userCam, tracks} = useSelector((state) => state.features)

  useEffect(() => {
    const int = parseInt(selectedUser.username.slice(0, 9).length, 10);
    const color = colorsArray[int];
    setColor(color);
  }, [selectedUser]);

  return (
    <>
    <div className="flex flex-col gap-2 items-center call-container">
     {showCam && <VideoCam/>}
     {userCam && Object.keys(tracks.remoteVideoTracks).length ? <VideoCam/> :  <ProfilePicture selected={true} color={color} size="2xl:w-36 2xl:h-36 xl:w-28 xl:h-28 lg:w-24 lg:h-24 md:w-20 md:h-20" />}
      <span className="text-white text-3xl">{selectedUser.username}</span>
      <div>{children}</div>
    </div>
    </>
  );
}

export default CallingUser;
