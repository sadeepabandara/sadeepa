import Image from 'next/image';

const Avatar = () => {
  return (
    <div className='xl:flex xl:max-w-none'>
      <Image
        src={'/sadeepa.png'}
        width={737}
        height={678}
        alt=''
        // className='w-full h-full translate-z-0'
        className='md:w-[920px] md:h-[620px] xl:w-[737px] xl:h-[491.33px]'
      />
    </div>
  );
};

export default Avatar;
