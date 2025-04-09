import Link from 'next/link';
import {
  RiInstagramLine,
  RiFacebookLine,
  RiGithubLine,
  RiLinkedinLine,
} from 'react-icons/ri';

const Socials = () => {
  return (
    <div className='flex items-center text-lg gap-x-5'>
      <Link
        href={'https://www.instagram.com/szdeepa/'}
        className='transition-all duration-300 hover:text-accent'
        target='_blank'
        rel='noopener noreferrer'
      >
        <RiInstagramLine />
      </Link>
      <Link
        href={'https://www.facebook.com/sadeepabandaraofficial'}
        className='transition-all duration-300 hover:text-accent'
        target='_blank'
        rel='noopener noreferrer'
      >
        <RiFacebookLine />
      </Link>
      <Link
        href={'https://github.com/sadeepabandara'}
        className='transition-all duration-300 hover:text-accent'
        target='_blank'
        rel='noopener noreferrer'
      >
        <RiGithubLine />
      </Link>
      <Link
        href={'https://www.linkedin.com/in/sadeepa-bandara/'}
        className='transition-all duration-300 hover:text-accent'
        target='_blank'
        rel='noopener noreferrer'
      >
        <RiLinkedinLine />
      </Link>
    </div>
  );
};

export default Socials;
