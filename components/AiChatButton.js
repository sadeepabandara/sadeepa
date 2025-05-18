import React, { useState } from 'react';
import { FaRobot } from 'react-icons/fa';
import AiChatBox from './AiChatBox';

const AiChatButton = () => {
  const [chatBoxOpen, setChatBoxOpen] = useState(false);

  return (
    <div className='fixed z-50 bottom-6 right-4 xl:right-[2%]'>
      <div className='relative group'>
        <button
          className='flex items-center justify-center p-5 text-white rounded-full shadow-md bg-white/10 backdrop-blur-sm group-hover:text-accent'
          onClick={() => setChatBoxOpen(true)}
        >
          <FaRobot
            size={24}
            className='transition-all duration-300 ease-in-out group-hover:text-accent'
          />
        </button>
        <div
          className='absolute hidden cursor-pointer right-[22px] top-[22px] pr-14 group-hover:flex'
          onClick={() => setChatBoxOpen(true)}
        >
          <div className='relative flex items-center bg-white opacity-50 text-primary p-[6px] rounded-[3px]'>
            <div className='text-[12px] w-[84px] leading-none capitalize font-semibold'>
              Chat with me
            </div>
            <div className='border-l-8 border-solid border-l-white border-y-transparent border-y-[6px] border-r-0 absolute -right-2'></div>
          </div>
        </div>
      </div>
      <AiChatBox open={chatBoxOpen} onClose={() => setChatBoxOpen(false)} />
    </div>
  );
};

export default AiChatButton;
