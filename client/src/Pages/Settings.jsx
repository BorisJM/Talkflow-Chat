import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import SearchBar from "../ui/SearchBar";
import { userContext } from "../Context/UserContext";
import ProfilePicture from "../ui/ProfilePicture";
import Input from "../ui/Input";
import axios from "axios";
import ThemeSwitcher from "../ui/ThemeSwitcher";

function Settings() {
  const [color, setColor] = useState("");
  const [file, setFile] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { id, username } = useContext(userContext);

  const colorsArray = [
    "bg-slate-600",
    "bg-zinc-600",
    "bg-red-600",
    "bg-orange-600",
    "bg-amber-600",
    "bg-lime-600",
    "bg-green-600",
    "bg-teal-600",
    "bg-cyan-600",
    "bg-violet-600",
    "bg-pink-600",
  ];
  useEffect(() => {
    const int = parseInt(username?.slice(0, 9).length, 10);
    const color = colorsArray[int];
    setColor(color);
  }, [username]);

  function handleSubmitSettings(e) {
    e.preventDefault();
    if (!newName && !newEmail && !file) return;
    const data = {
      file,
      newName,
      newEmail,
    };
    Object.keys(data).forEach((key) => {
      if (!data[key]) {
        delete data[key];
      }
    });

    axios
      .post("/api/user/changeSettings", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setFile("");
        setNewEmail("");
        setNewName("");
        toast.success("Data was changed successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch((err) => {
        toast.error(err.response.data, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  }

  function handleSubmitPassword(e) {
    e.preventDefault();
    if (!currentPassword && !newPassword && !confirmPassword) return;
    const data = {
      currentPassword,
      newPassword,
      confirmPassword,
    };
    axios
      .post("/api/user/changePassword", data)
      .then(() => {
        setCurrentPassword("");
        setConfirmPassword("");
        setNewPassword("");
        toast.success("Data was changed successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch((err) => {
        toast.error(err.response.data, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  }

  return (
    <div className="dark:bg-[#2b303b]  transition-all duration-200">
      <nav className="bg-zinc-700 py-3 px-6 dark:bg-[#23272F] transition-all duration-200">
        <ul className="flex items-center justify-around  ">
          <SearchBar />
          <li className="p-2 rounded-full hover:bg-zinc-600 transition-all duration-200">
            <NavLink to="/" reloadDocument>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="white"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
            </NavLink>
          </li>
          <div className="flex items-center gap-3">
<ThemeSwitcher/>
          <ProfilePicture color={color} username={username} />
          </div>
        </ul>
      </nav>
      <div className="w-3/4 m-auto flex flex-col justify-center items-center gap-5 dark:bg-[#23272F] transition-all duration-200  bg-navbg rounded-sm mt-6 py-6 px-[50px] md:py-6 md:px-[150px] lg:py-8 lg:px-[250px] xl:py-10 xl:px-[320px] 2xl:py-12 2xl:px-[400px] shadow-md">
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
        <h1 className="self-start mt-4 uppercase font-medium 2xl:text-2xl xl:text-lg dark:text-[#F6F7F9] transition-all duration-200 text-formBtn">
          Your account settings
        </h1>
        <form
          onSubmit={handleSubmitSettings}
          className="flex flex-col gap-6 w-full"
        >
          <Input
            label={"Name"}
            placeholder={"No spaces like abcd..."}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Input
            label={"Email address"}
            placeholder={"example@email.com"}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <div className="flex flex-row-reverse  justify-end items-center gap-3">
            <input
              type="file"
              className="hidden"
              name="file"
              id="file__input"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label
              htmlFor="file__input"
              className="hover:cursor-pointer flex justify-center items-center gap-3"
            >
              <span className="text-formBtn text-lg font-medium underline underline-offset-4 dark:text-[#F6F7F9]">
                Choose new photo
              </span>
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
            <ProfilePicture color={color} username={username} />
          </div>
          <button className="max-[600px]:text-sm self-end uppercase text-sidebar font-medium bg-formBtn rounded-full px-6 py-2">
            Save settings
          </button>
        </form>
        <h2 className="self-start uppercase font-medium  2xl:text-2xl xl:text-lg text-formBtn dark:text-[#F6F7F9]">
          Password Change
        </h2>
        <form
          onSubmit={handleSubmitPassword}
          className="flex flex-col w-full gap-4"
        >
          <Input
            label={"Current password"}
            placeholder={"••••••••"}
            type={"password"}
            isRequired={true}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            label={"New password"}
            placeholder={"••••••••"}
            isRequired={true}
            type={"password"}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            label={"Confirm password"}
            placeholder={"••••••••"}
            type={"password"}
            isRequired={true}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button className="max-[600px]:text-sm  self-end uppercase text-sidebar font-medium bg-formBtn rounded-full px-6 py-2">
            Save password
          </button>
        </form>
      </div>
    </div>
  );
}

export default Settings;
