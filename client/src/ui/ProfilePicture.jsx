import { useContext, useRef } from "react";
import { userContext } from "../Context/UserContext";
import { useSelector } from "react-redux";

function ProfilePicture({ color, size = "2xl:w-14 2xl:h-14", selected = false, z = 'z-0' }) {
  const { showVolumeIndicator } = useSelector((state) => state.features);
  const { userPicture, username } = useContext(userContext);
  const { selectedUser } = useSelector((state) => state.users);
const ref = useRef()

  if (!userPicture && !selected || (selected && !selectedUser.picture))
    return (
      <li ref={ref}
        className={`profile_picture ${z} ${color} ${
          showVolumeIndicator && ref.current?.closest('.call-container')
            ? "outline-2 outline-double outline-green-500 rounded-full"
            : ""
        } flex items-center justify-center  xl:w-[3.25rem] xl:h-[3.25rem] lg:h-[3.25rem] lg:w-[3.25rem] md:w-[3.25rem] md:h-[3.25rem] sm:h-[3.25rem] sm:w-[3.25rem] ${size} h-12 w-12 rounded-full`}
      >
        <span className="text-xl uppercase">
          {selected && selectedUser?.username[0] || username[0]}
        </span>
      </li>
    );
  else
    return (
      <li ref={ref}
        className={`flex ${z} profile_picture ${
          showVolumeIndicator && ref.current?.closest('.call-container')
            ? "border-2 -m-0.5 border-solid border-green-500 rounded-full"
            : ""
        }`}
      >
        <img
          className={`${size} xl:w-[3.25rem] xl:h-[3.25rem] lg:h-[3.25rem] lg:w-[3.25rem] md:w-[3.25rem] md:h-[3.25rem] sm:h-[3.25rem] sm:w-[3.25rem] h-12 w-12 rounded-full`}
          src={`https://talkflow-zy0f.onrender.com/uploads/profile-pictures/${
            !selected ? userPicture : selectedUser.picture
          }`}
          alt={`${selectedUser?.username} picture`}
        />
      </li>
    );
}

export default ProfilePicture;
