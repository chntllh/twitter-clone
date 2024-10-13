export default function ProfileCard({username, handleName, pfpUrl}) {
  return (
    <div className='flex flex-row justify-start items-center gap-[17px] cursor-pointer hover:bg-neutral-900 hover:rounded-full mx-auto lg:p-[8px] mt-6'>
      <img
        className='w-10 h-10 rounded-full object-cover'
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
