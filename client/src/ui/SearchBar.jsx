import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setFoundedOfflinePeople,
  setFoundedOnlinePeople,
  setOfflinePeople,
  setOnlinePeople,
  setShowFoundedUsers,
} from "../dataStorage/users/usersSlice";

function SearchBar() {
  const [query, setQuery] = useState("");
  const { allUsers, onlinePeople, offlinePeople } = useSelector(
    (state) => state.users
  );
  const dispatch = useDispatch();

  function resetQuery() {
    dispatch(setFoundedOfflinePeople([]));
    dispatch(setFoundedOnlinePeople([]));
    dispatch(setShowFoundedUsers(false));
  }

  useEffect(() => {
    if (!query) return resetQuery();
    const users = allUsers.filter((u) => u.username.startsWith(query));
    const foundedOnlinePeople = onlinePeople.filter((x) =>
      users.some((y) => x.username === y.username)
    );
    const foundedOfflinePeople = offlinePeople.filter((x) =>
      users.some((y) => y.username === x.username)
    );
    dispatch(setFoundedOfflinePeople(foundedOfflinePeople));
    dispatch(setFoundedOnlinePeople(foundedOnlinePeople));
    dispatch(setShowFoundedUsers(true));
  }, [query]);

  return (
    <li className="relative">
      <input
        onChange={(e) => setQuery(e.target.value)}
        type="text"
        placeholder="Search..."
        className="bg-gray-100 dark:bg-[#78839B] dark:bg-opacity-20 transition-all duration-200 shadow-xl rounded-full px-6 py-1 focus:outline-none "
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="#CDCDCD"
        className="w-6 h-6 absolute right-0 top-0 translate-y-1 -translate-x-3"
      >
        <path
          fillRule="evenodd"
          d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
          clipRule="evenodd"
        />
      </svg>
    </li>
  );
}
export default SearchBar;
