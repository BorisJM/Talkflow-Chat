import { useDispatch, useSelector } from "react-redux";
import {
  setMessageText,
  setMessages,
  setUserLastMessage,
} from "../dataStorage/messages/messagesSlice";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useState } from "react";

function MessageField({ id, ws, showEmojiPicker, handleClick }) {
  const { selectedUser, prevSelectedUser } = useSelector((state) => state.users);
  const {  messageText, userLastMessage, messages } = useSelector(
    (state) => state.messages
  );
  const {isLightTheme} = useSelector(state => state.features)
const [file, setFile] = useState('')
const dispatch = useDispatch();
const { innerWidth: width, innerHeight: height } = window;

function informAboutTyping(typing, receiver) {
  if(ws.readyState === 0) return
  ws?.send(JSON.stringify({sender: id,receiver,typing}))
}

// Informing about user typing
useEffect(() => {
  if(!messageText && prevSelectedUser) {
    informAboutTyping('not typing', prevSelectedUser.userId)
  }
  if(!messageText ) {
  informAboutTyping('not typing', selectedUser.userId)
  }
  else {
    informAboutTyping('typing', selectedUser.userId)
  }
},[messageText, prevSelectedUser])

  function handleCreateMessage(e) {
    e.preventDefault();
    const data = {
      receiver: selectedUser.userId,
      sender: id,
      text: messageText,
    };
    if (!messageText && !file) return;
    if (messageText && !file) {
      const newLastMessage = userLastMessage[data.receiver];
      const newLastMessagesObj = { ...userLastMessage };
      delete newLastMessagesObj[newLastMessage];
      newLastMessagesObj[data.receiver] = data;
      dispatch(setUserLastMessage(newLastMessagesObj));
      ws.send(JSON.stringify(data));
      dispatch(setMessageText(""));
      dispatch(setMessages([...messages, { ...data, _id: Date.now() }]));
    } else {
      axios
        .post(
          "/api/messages/createMessageImage",
          { file },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          const newLastMessage = userLastMessage[data.receiver];
          const newLastMessagesObj = { ...userLastMessage };
          delete newLastMessagesObj[newLastMessage];
          newLastMessagesObj[data.receiver] = {
            receiver: selectedUser.userId,
            sender: id,
            text: "Picture 📷",
          };
          dispatch(setUserLastMessage(newLastMessagesObj));
          ws.send(JSON.stringify({ ...data, image: res.data.message }));
          dispatch(setMessageText(""));
          dispatch(
            setMessages([
              ...messages,
              { ...data, image: res.data.message, _id: Date.now() },
            ])
          );
          setFile('')
        });
    }
  }

  function onEmojiClick(e) {
    dispatch(setMessageText(messageText + e.emoji));
  }

  return (
    <form
      className="w-full  flex justify-center items-center bg-white transition-all duration-200 dark:bg-[#2b303b] gap-5 py-3 px-4 mt-3 border-t dark:border-[#F6F7F9] dark:border-opacity-10"
      onSubmit={handleCreateMessage}
    >
      <input
        type="file"
        name="file"
        accept="image/png, image/jpeg"
        value=''
        className="hidden"
        id="file__input"
        onChange={(e) => {
          setFile(e.target.files[0])
        }}
      />
      <label
        htmlFor="file__input"
        className="hover:cursor-pointer flex justify-center items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
      </label>

<div className="w-2/3 relative">
      <input
        onChange={(e) => dispatch(setMessageText(e.target.value))}
        onKeyDown={(e) => {
          if(e.keyCode === 8 && messageText.length <= 1) {
            informAboutTyping('not typing')
          }
        }}
        value={messageText}
        placeholder="Aa"
        type="text"
        className="p-3 focus:outline-none rounded-full dark:bg-[#78839B] transition-all duration-200 dark:bg-opacity-20 bg-slate-100 w-full"
        />
      {showEmojiPicker && (
        <div className="absolute bottom-0 right-0 translate-x-4">
          <EmojiPicker theme={isLightTheme ? 'light' : 'dark'} onEmojiClick={onEmojiClick} height={width <= 800 ? 300 : 350} width={width <= 800 ? 200   : 300} />
        </div>
      )}
        </div>
      <button type="button" className="emoji-btn" onClick={handleClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
          />
        </svg>
      </button>
    </form>
  );
}

export default MessageField;
