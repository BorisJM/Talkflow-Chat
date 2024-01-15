function Avatar({ color, username, isOnline, picture }) {
  return (
    <span className={`${color} max-[420px]:h-10 max-[420px]:w-10 md:max-[880px]:h-10 md:max-[880px]:w-10 rounded-full h-12 w-12 relative`}>
      {!picture ? (
        <span className="absolute right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2 uppercase text-xl">
          {username[0]}
        </span>
      ) : (
        <img
          className="rounded-full"
          src={`https://talkflow-zy0f.onrender.com/uploads/profile-pictures/${picture}`}
          alt={`picture of ${username}`}
        />
      )}
      <span
        className={`${
          !isOnline ? "bg-gray-400" : "bg-green-500"
        } h-4 w-4 absolute rounded-full bottom-0 right-0`}
      ></span>
    </span>
  );
}
export default Avatar;
