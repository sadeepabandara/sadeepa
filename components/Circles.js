import Image from 'next/image';

const Circles = () => {
  return (
    <div className='w-[200px] xl:w-[400px] absolute -right-32 -bottom-36 mix-blend-color-dodge duration-75 z-10'>
      <Image
        src={'/world.png'}
        width={260}
        height={200}
        alt=''
        className='w-full h-full'
      />
    </div>
  );
};

export default Circles;
