import Image from 'next/image';
import Link from 'next/link';
import { HiArrowRight } from 'react-icons/hi2';
import { MdOutlineFileDownload } from 'react-icons/md';

const ProjectsBtn = () => {
  return (
    <div className='mx-auto xl:mx-0'>
      <Link
        href={'./resume.pdf'}
        download='resume'
        target='_blank'
        rel='noopener noreferrer'
        className='relative w-[185px] h-[185px] flex justify-center items-center bg-circleStar bg-cover bg-no-repeat group'
      >
        <Image
          src={'/resume-3.png'}
          width={141}
          height={148}
          alt=''
          className='w-full h-full animate-spin-slow max-w-[141px] max-h-[148px]'
        />
        <MdOutlineFileDownload className='absolute text-4xl transition-all duration-300 group-hover:translate-y-2' />
      </Link>
    </div>
  );
};

export default ProjectsBtn;
