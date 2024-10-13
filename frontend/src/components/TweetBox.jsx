import { useRef, useState } from 'react';
import {
  BiCalendar,
  BiCurrentLocation,
  BiImageAdd,
  BiListOl,
  BiSmile,
  BiSolidFileGif,
} from 'react-icons/bi';

export default function TweetBox() {
  const [text, settext] = useState('');
  const textareaRef = useRef(null);

  const handleTextChange = (e) => {
    const textarea = textareaRef.current;
    settext(e.target.value);

    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <div className='border-b border-gray-600'>
      <div className='flex flex-row p-3'>
        <div className='p-1 cursor-pointer h-fit w-14'>
          <img
            className='w-10 h-10 rounded-full object-cover'
            src='https://e1.pxfuel.com/desktop-wallpaper/708/299/desktop-wallpaper-wwe-randy-orton-weneedfun-randy-orton-2019-thumbnail.jpg'
            alt='Randy Orton'
          />
        </div>
        <div className='flex flex-col w-full gap-3'>
          <textarea
            ref={textareaRef}
            className='text-2xl text-white bg-black outline-none h-auto w-full resize-none'
            rows='1'
            value={text}
            onChange={handleTextChange}
            maxLength={128}
            placeholder='What is happeneing?!'
          />
          <div className='flex flex-col gap-4'>
            <div className='flex flex-row justify-between items-center'>
              <div className='flex flex-row gap-3 cursor-pointer'>
                <BiImageAdd />
                <BiSolidFileGif />
                <BiListOl />
                <BiSmile />
                <BiCalendar />
                <BiCurrentLocation />
              </div>
              <div className=''>
                <button className='bg-blue-400 px-5 py-1 font-semibold rounded-full'>
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
