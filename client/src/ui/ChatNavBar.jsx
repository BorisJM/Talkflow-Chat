import { useSelector } from "react-redux";
import VoiceCallBtn from "./VoiceCallBtn";
import ShowSideBarBtn from "./ShowSideBarBtn";
import VideoCallBtn from "./VideoCallBtn";
import Contact from "./Contact";

function ChatNavBar({ handleClick, handleSidebar, showSidebar }) {
  const { selectedUser, onlinePeople } = useSelector((state) => state.users);

  return (
    <div className="w-full transition-all duration-200 dark:bg-[#2b303b] flex justify-between self-start border-b border-r dark:border-[#F6F7F9] dark:border-opacity-10">
      <Contact
      showSidebar={showSidebar}
        picture={selectedUser.picture}
        border={false}
        username={selectedUser.username}
        isOnline={onlinePeople.find(
          (u) => u.username === selectedUser.username
        )}
        message={
          onlinePeople.find((u) => u.username === selectedUser.username)
            ? "Is Active"
            : "Is Offline"
        }
        key={selectedUser.userId}
      />
      <div className="flex lg:gap-6 md:gap-4 gap-3 pr-4 dark:bg-[#2b303b] transition-all duration-200">
        <VoiceCallBtn handleClick={handleClick} />
        <VideoCallBtn handleClick={handleClick} />
        <ShowSideBarBtn handleClick={handleSidebar} />
      </div>
    </div>
  );
}

export default ChatNavBar;
