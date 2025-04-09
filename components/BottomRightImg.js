import Image from 'next/image';

const BottomRightImg = () => {
  return (
    <div className='absolute bottom-[-170px] right-[-120px] z-10 mix-blend-color-dodge w-[200px] xl:w-[400px] opacity-50 rotate-180'>
      <Image src='/top-left-img-2.jpeg' width={400} height={400} alt='' />
    </div>
  );
};

export default BottomRightImg;
