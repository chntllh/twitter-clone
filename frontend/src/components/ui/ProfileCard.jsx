const ProfileCard = ({username, handleName, pfpUrl}) => {
  return (
    <div className='gap-3 lg:ml-3 flex flex-row justify-start items-center cursor-pointer hover:bg-neutral-900 hover:rounded-full'>
      <img
        className='w-10 lg:w-12 h-10 lg:h-12 rounded-full object-cover'
        src={pfpUrl}
        alt={handleName}
      />
      <div className='hidden lg:block'>
        <h1>{handleName}</h1>
        <p>@{username}</p>
      </div>
    </div>
  );
}

export default ProfileCard;
