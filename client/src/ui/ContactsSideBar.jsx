import { useDispatch, useSelector } from "react-redux";
import Contact from "./Contact";
import {
  setPrevSelectedUser,
  setSelectedUser,
} from "../dataStorage/users/usersSlice";
import { setMessageText } from "../dataStorage/messages/messagesSlice";

function ContactsSideBar({ id, selectedUserRef }) {
  const {
    selectedUser,
    onlinePeople,
    offlinePeople,
    showFoundedUsers,
    foundedOnlinePeople,
    foundedOfflinePeople,
  } = useSelector((state) => state.users);
  const { userLastMessage } = useSelector((state) => state.messages);
  const dispatch = useDispatch();

  return (
    <div className=" bg-sidebar  transition-all duration-200 dark:bg-[#2b303b] dark:bg-opacity-95  overflow-y-scroll flex flex-col gap-2">
      {showFoundedUsers
        ? foundedOnlinePeople?.map((user) => (
            <Contact
              onClick={() => {
                dispatch(setPrevSelectedUser(selectedUser));
                dispatch(setSelectedUser(user));
                selectedUserRef.current = user;
                dispatch(setMessageText(""));
              }}
              picture={user.picture}
              username={user.username}
              isOnline={true}
              message={`${
                userLastMessage[user.userId]?.sender === id ? "You: " : ""
              }  ${
                userLastMessage[user.userId]?.text ||
                (userLastMessage[user.userId]?.image && "Picture 📷") ||
                ""
              }`}
              key={user.userId}
            />
          ))
        : onlinePeople.map((user) => (
            <Contact
              onClick={() => {
                dispatch(setPrevSelectedUser(selectedUser));
                dispatch(setSelectedUser(user));
                selectedUserRef.current = user;
                dispatch(setMessageText(""));
              }}
              picture={user.picture}
              username={user.username}
              isOnline={true}
              message={`${
                userLastMessage[user.userId]?.sender === id ? "You: " : ""
              }  ${
                userLastMessage[user.userId]?.text ||
                (userLastMessage[user.userId]?.image && "Picture 📷") ||
                ""
              }`}
              key={user.userId}
            />
          ))}
      {showFoundedUsers
        ? foundedOfflinePeople?.map((user) => (
            <Contact
              picture={user.picture}
              onClick={() => {
                dispatch(setPrevSelectedUser(selectedUser));
                dispatch(setSelectedUser(user));
                selectedUserRef.current = user;
                dispatch(setMessageText(""));
              }}
              username={user.username}
              isOnline={false}
              message={`${
                userLastMessage[user.userId]?.sender === id ? "You: " : ""
              } ${
                userLastMessage[user.userId]?.text ||
                (userLastMessage[user.userId]?.image && "Picture 📷") ||
                ""
              }`}
              key={user.userId}
            />
          ))
        : offlinePeople.map((user) => (
            <Contact
              picture={user.picture}
              onClick={() => {
                dispatch(setPrevSelectedUser(selectedUser));
                dispatch(setSelectedUser(user));
                selectedUserRef.current = user;
                dispatch(setMessageText(""));
              }}
              username={user.username}
              isOnline={false}
              message={`${
                userLastMessage[user.userId]?.sender === id ? "You: " : ""
              } ${
                userLastMessage[user.userId]?.text ||
                (userLastMessage[user.userId]?.image && "Picture 📷") ||
                ""
              }`}
              key={user.userId}
            />
          ))}
    </div>
  );
}

export default ContactsSideBar;
