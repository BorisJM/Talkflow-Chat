function CallerProfilePicture({color, user}){

if(!user.picture) return (<li 
className={`${color} flex w-32 h-32 items-center justify-center rounded-full`}
>
<span className="text-xl uppercase">
  {user?.username[0]}
</span>
</li> ); else return (
      <li 
        className={`flex 
        `}
      >
        <img
          className={`w-32 h-32 rounded-full`}
          src={`https://talkflow-zy0f.onrender.com/uploads/profile-pictures/${
            user.picture
          }`}
          alt={`${user?.username} picture`}
        />
      </li>
    );
}

export default CallerProfilePicture
