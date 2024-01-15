import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setMessageText,
  setMessages,
  setFile,
  setUserLastMessage,
  getMessages,
} from "../dataStorage/messages/messagesSlice";
import { userContext } from "../Context/UserContext";
import { LoadingContext } from "../Context/LoadingContext";
import Navbar from "../ui/NavBar";
import axios from "axios";
import Sidebar from "../ui/SideBar";
import SidebarUser from "../ui/SidebarUser";
import RoomChat from "../ui/RoomChat";
import AgoraRTC from "agora-rtc-sdk-ng";
import ContactsSideBar from "../ui/ContactsSideBar";
import {
  setAllUsers,
  setOfflinePeople,
  setOnlinePeople,
  setSelectedUser,
  setUserTalkingStatus,
  setUsersResetTalkingStatus,
} from "../dataStorage/users/usersSlice";
import ChatNavBar from "../ui/ChatNavBar";
import ChatContainer from "../ui/ChatContainer";
import MessageField from "../ui/MessageField";
import {
  setAudioTracks,
  setLeaveRoom,
  setShowCam,
  setShowVolumeIndicator,
  setTracks,
  setUserCam,
  setUserLeft,
  setVideoTracks,
} from "../dataStorage/features/featuresSlice";
import IncomingCall from "../ui/IncomingCall";
import { ToastContainer, toast } from "react-toastify";

function Chat() {
  const [ws, setWs] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showRoom, setShowRoom] = useState(false);
  const { id, username, setId, setUsername, userPicture } =
    useContext(userContext);
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const [isActiveCall, setIsActiveCall] = useState(false);
  const [token, setToken] = useState(null);
  const [showTyping, setShowTyping] = useState({});
  const [startCall, setStartCall] = useState({});
  const [rtcClientGlobal, setRtcClientGlobal] = useState(null);
  const [declined, setDeclined] = useState(false);
  const [test, setTest] = useState(true);
  const { tracks, showCam } = useSelector((state) => state.features);
  const [showError, setShowError] = useState(false);
  const { messageText, messages, userLastMessage } = useSelector(
    (state) => state.messages
  );
  const {
    onlinePeople,
    offlinePeople,
    selectedUser,
    allUsers,
    usersTalkingStatus,
  } = useSelector((state) => state.users);

  const dispatch = useDispatch();
  const ref = useRef();
  const selectedUserRef = useRef(selectedUser);
  let rtcClient;
  // Agora Config
  const appId = import.meta.env.VITE_APP_ID;
  const rtcUid = Math.floor(Math.random() * 2032);
  async function initRnc(callType) {
    rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    setRtcClientGlobal(rtcClient);

    rtcClient.on("user-joined", handleUserJoined);
    rtcClient.on("user-published", handleUserPublished);
    rtcClient.on("user-left", handleUserLeft);
    rtcClient.on("user-unpublished", handleUserUnPublished);

    await rtcClient.join(
      appId,
      startCall.calling ? selectedUser.userId : id,
      token,
      rtcUid
    );
    const newAudioTrack = {
      remoteAudioTracks: {},
      remoteVideoTracks: {},
    };
    let tracks;
    if (callType === "videoCall") {
      tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
      newAudioTrack.localAudioTrack = tracks[0];
      newAudioTrack.localVideoTrack = tracks[1];
      dispatch(setShowCam(true));
    } else if (callType === "voiceCall") {
      tracks = await AgoraRTC.createMicrophoneAudioTrack();
      newAudioTrack.localAudioTrack = tracks;
    }

    dispatch(setTracks(newAudioTrack));
    await rtcClient.publish(tracks);
    initVolumeIndicator();

    return () => {
      for (let localTrack of tracks) {
        localTrack.stop();
        localTrack.close();
      }
      client.off("user-published", handleUserPublished);
      client.off("user-left", handleUserLeft);
      client.unpublish(tracks).then(() => client.leave());
    };
  }

  useEffect(() => {
    async function PlayTrack() {
      if (tracks.localAudioTrack) {
        await rtcClientGlobal.publish(tracks.localAudioTrack);
      }
    }
    PlayTrack();
  }, [tracks, rtcClientGlobal]);

  async function handleUserJoined(user) {
    setIsActiveCall(true);
  }

  async function handleUserPublished(user, mediaType) {
    await rtcClient.subscribe(user, mediaType);
    if (mediaType === "audio") {
      dispatch(setAudioTracks(user.audioTrack));
      user.audioTrack.play();
    } else {
      dispatch(setVideoTracks(user.videoTrack));
      dispatch(setUserCam(true));
    }
    setIsActiveCall(true);
  }

  async function handleUserUnPublished(user, mediaType) {
    if (mediaType === "video") {
      dispatch(setUserCam(false));
      dispatch(setTracks({ ...tracks, remoteVideoTracks: {} }));
    }
  }

  async function handleUserLeft(user) {
    dispatch(setUserLeft());
    setIsActiveCall(false);
    dispatch(setUserCam(false));
    leaveRoom(true);
  }

  function initVolumeIndicator() {
    AgoraRTC.setParameter("AUDIO_VOLUME_INDICATION_INTERVAL", 200);
    rtcClient.enableAudioVolumeIndicator();
    rtcClient.on("volume-indicator", (volumes) => {
      volumes.forEach((volume) => {
        try {
          if (volume.level >= 50 && volume.uid !== rtcUid) {
            dispatch(setShowVolumeIndicator(true));
          } else {
            dispatch(setShowVolumeIndicator(false));
          }
        } catch (error) {
          console.log(error);
        }
      });
    });
  }

  // Mute mic
  async function muteMic() {
    if (tracks.localAudioTrack && !tracks.localAudioTrack.muted) {
      await tracks.localAudioTrack.setMuted(true);
    } else if (tracks.localAudioTrack.muted) {
      await tracks.localAudioTrack.setMuted(false);
    }
  }

  // Turn camera off
  async function disconnectCamera() {
    await tracks.localVideoTrack.stop();
    await tracks.localVideoTrack.close();
    await rtcClientGlobal.unpublish(tracks.localVideoTrack);
    dispatch(setShowCam(!showCam));
    dispatch(setTracks({ ...tracks, localVideoTrack: null }));
  }

  async function connectCamera() {
    const tracksCamera = await AgoraRTC.createCameraVideoTrack();
    dispatch(setTracks({ ...tracks, localVideoTrack: tracksCamera }));
    dispatch(setShowCam(true));
    await rtcClientGlobal.publish(tracksCamera);
  }

  // leave room
  async function leaveRoom(handleUserLeft = false) {
    if (tracks.localAudioTrack) {
      await tracks.localAudioTrack.stop();
      await tracks.localAudioTrack.close();
    }
    if (tracks.localVideoTrack) {
      await tracks.localVideoTrack.stop();
      await tracks.localVideoTrack.close();
    }
    if (!handleUserLeft) {
      rtcClientGlobal.unpublish();
      rtcClientGlobal.leave();
    } else {
      rtcClient.unpublish();
      rtcClient.leave();
    }
    setIsActiveCall(false);
    setShowRoom(false);
    setDeclined(false);
    if (!isActiveCall) {
      startCallingUser(false);
    }
    dispatch(setLeaveRoom());
    dispatch(setShowCam(false));
    ws.send(
      JSON.stringify({
        resetIsTalking: true,
        users: [{ id }, { id: selectedUser.userId }],
      })
    );
  }

  useEffect(() => {
    if (declined) leaveRoom();
    else return;
  }, [declined]);

  // Websocket connection
  useEffect(() => {
    connectToWs();
  }, [selectedUser, id]);

  function connectToWs() {
    const ws = new WebSocket(`https://talkflow-zy0f.onrender.com`);
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () => {
      setTimeout(() => {
        console.log("Disconnected. Trying to reconnect.");
        connectToWs();
      }, 1000);
    });
  }

  function showOnlinePeople(people) {
    const idsArrOne = people.map((user) =>
      Object.keys(user).includes("picture") ? user : null
    );
    const idsArr = idsArrOne.filter((user) => user !== null);
    const noDuplicates = [
      ...new Map(idsArr.map((user) => [user?.userId, user])).values(),
    ].filter((user) => user?.userId !== id);

    dispatch(setOnlinePeople([...noDuplicates]));
  }

  function handleMessage(e) {
    const data = JSON.parse(e.data);
    if ("online" in data) {
      showOnlinePeople(data.online);
    } else if ("text" in data) {
      const message = data;
      if (data.file) {
        const file = message.file;
        message.image = file;
        delete message.file;
      }
      const lastMessage = {
        receiver: message.receiver,
        sender: message.sender,
        text: message.text,
      };
      const lastMessageObject = {};
      lastMessageObject[message.sender] = lastMessage;
      const allLastMessages = { ...userLastMessage };
      delete allLastMessages[lastMessage];
      allLastMessages[message.sender] = message.image
        ? {
            receiver: message.receiver,
            sender: message.sender,
            text: "Picture 📷",
          }
        : lastMessage;
      dispatch(setUserLastMessage(allLastMessages));

      if (message.sender === selectedUserRef.current.userId) {
        dispatch(setMessages({ payload: [{ ...message }], type: "receive" }));
      }
    } else if ("typing" in data) {
      setShowTyping(data);
    } else if ("calling" in data) {
      if (data.caller) {
        setStartCall(() => ({
          calling: data.calling,
          caller: data.caller,
        }));
      }
      dispatch(setSelectedUser(data.caller));
      selectedUserRef.current = data.caller;
    } else if ("declined" in data) {
      setDeclined(true);
    } else if ("isTalking" in data) {
      dispatch(setUserTalkingStatus(data));
    } else if ("users" in data) {
      dispatch(setUsersResetTalkingStatus(data.users));
    }
  }
  // Start Call
  function startCallingUser(calling) {
    ws.send(
      JSON.stringify({
        calling,
        caller: {
          userId: id,
          username,
          picture: userPicture,
        },
        receiver: selectedUser.userId,
      })
    );
  }

  // Decline call
  function handleDecline() {
    ws.send(
      JSON.stringify({
        declined: true,
        receiver: startCall.caller.userId,
      })
    );
    setStartCall({});
  }

  // Logout function
  function handleLogout() {
    setIsLoading(true);
    axios.post("/api/user/logout").then(() => {
      setWs(null);
      setId(null);
      setUsername(null);
      setIsLoading(false);
    });
  }

  // Creating and sending message

  function scrollToTheBottom() {
    const div = ref.current;

    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }

  function sendIsTalking() {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ id, isTalking: true }));
    }
  }

  useEffect(() => {
    scrollToTheBottom();
  }, [messages, imageLoaded, setImageLoaded]);

  useEffect(() => {
    if (startCall.calling) {
      sendIsTalking();
    }
  }, [startCall.calling, ws?.readyState]);

  useEffect(() => {
    if (showError) {
      toast.error(
        "The user is currently talking with someone. Please try again later...",
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
      setShowError(false);
    }
  }, [showError]);

  useEffect(() => {
    async function getUsers() {
      const { data } = await axios.get("/api/user/getAllUsers");
      const offlineArr = data.users.map((u) => ({
        userId: u._id,
        username: u.username,
        picture: u.picture,
      }));
      const users = offlineArr.filter((u) => u.userId !== id);
      dispatch(setAllUsers(users));
      ShowOfflinePeople(offlineArr);
    }
    getUsers();
  }, [onlinePeople, id]);

  function ShowOfflinePeople(users) {
    const offlinePeopleIds = users.map((u) => u.userId);
    const onlinePeopleIds = onlinePeople.map((u) => u.userId);
    const offlineUsers = offlinePeopleIds.filter(
      (id) => !onlinePeopleIds.includes(id)
    );
    const offlinePeopleArray = users
      .filter((u) => offlineUsers.includes(u.userId))
      .filter((u) => u.userId !== id);
    dispatch(setOfflinePeople(offlinePeopleArray));
  }

  useEffect(() => {
    setShowSidebar(false);
    if (selectedUser) {
      dispatch(
        getMessages({ type: "GET_MESSAGES" }, { user: selectedUser.userId })
      );
    }
  }, [selectedUser]);

  useEffect(() => {
    if (Object.keys(userLastMessage).length) return;
    dispatch(getMessages({ type: "GET_LAST_MESSAGES" }, { allUsers }));
  }, [allUsers, messages]);

  return (
    <div
      className="grid grid-cols-[1.25fr_1fr_1fr_1fr_1fr_1fr] grid-rows-[5rem_8fr] overflow-hidden h-screen"
      onClick={(e) => {
        if (e.target.closest(".emoji-btn") || e.target.closest(".emoji-menu"))
          return;
        else setShowEmojiPicker(false);
      }}
    >
      <div className="absolute">
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
      {startCall.calling && (
        <IncomingCall
          user={startCall.caller}
          handleDecline={handleDecline}
          handleClick={(callType) => {
            setShowRoom(true);
            initRnc(callType);
            setStartCall(false);
            ws.send(JSON.stringify({ id, isTalking: true }));
          }}
        />
      )}
      <Navbar username={username} handleLogout={handleLogout} />
      <ContactsSideBar id={id} selectedUserRef={selectedUserRef} />
      <div
        className={`w-full overflow-hidden ${
          showSidebar ? "lg:col-span-4 col-span-3" : "col-span-5"
        } flex flex-col items-center h-full bg-white dark:bg-[#2b303b] transition-all duration-200  border-r dark:border-[#F6F7F9] dark:border-opacity-10`}
      >
        {!selectedUser && (
          <span className="text-name transition-all duration-200 dark:text-[#F6F7F9] text-xl text-center md:text-3xl align m-auto">
            Please pick a user to start a converstation!
          </span>
        )}
        {selectedUser && (
          <>
            {showRoom && (
              <RoomChat
                handleMute={muteMic}
                handleLeave={leaveRoom}
                handleCameraOff={showCam ? disconnectCamera : connectCamera}
                isPlaying={!isActiveCall ? true : false}
              />
            )}
            <ChatNavBar
              handleClick={(callType) => {
                const user = usersTalkingStatus.find(
                  (u) => u.id === selectedUser.userId
                );
                if (user && user.isTalking) {
                  setShowError(true);
                } else {
                  setShowRoom(true);
                  initRnc(callType);
                  startCallingUser(true);
                  ws.send(JSON.stringify({ id, isTalking: true }));
                }
              }}
              handleSidebar={() => {
                setShowSidebar((bol) => !bol);
              }}
              showSidebar={showSidebar}
            />
            <ChatContainer onLoad={scrollToTheBottom} showTyping={showTyping}>
              {/* Scroll to the bottom */}
              <div ref={ref}></div>
            </ChatContainer>
            <MessageField
              id={id}
              ws={ws}
              showEmojiPicker={showEmojiPicker}
              handleClick={() => setShowEmojiPicker((bool) => !bool)}
            />
          </>
        )}
      </div>
      {showSidebar && (
        <Sidebar selectedUser={selectedUser}>
          <SidebarUser
            image={selectedUser?.picture}
            username={selectedUser?.username}
            status={
              onlinePeople.find((u) => u.username === selectedUser?.username)
                ? "is Active"
                : "is Offline"
            }
          />
        </Sidebar>
      )}
    </div>
  );
}

export default Chat;
