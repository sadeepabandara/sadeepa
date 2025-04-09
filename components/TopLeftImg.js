import Image from 'next/image';

const TopLeftImg = () => {
  return (
    <div className='absolute top-[-170px] left-[-120px] z-10 mix-blend-color-dodge w-[200px] xl:w-[400px] opacity-50'>
      <Image src='/top-left-img-2.jpeg' width={400} height={400} alt='' />
    </div>
  );
};

export default TopLeftImg;
