import ParticlesContainer from '../components/ParticlesContainer';
import ProjectsBtn from '../components/ProjectsBtn';
import { motion } from 'framer-motion';
import { fadeIn } from '../variants';
import { TypeAnimation } from 'react-type-animation';
import Avatar from '../components/Avatar';

const Home = () => {
  return (
    <div className='h-full'>
      <motion.div
        variants={fadeIn('right', 0.2)}
        initial='hidden'
        animate='show'
        exit='hidden'
        className='hidden absolute z-1 bottom-0 -left-[370px]'
      >
        <Avatar />
      </motion.div>
      <div className='w-full h-full'>
        <div className='container flex flex-col justify-center h-full mx-auto text-center xl:pt-40 xl:text-left'>
          <motion.h1
            variants={fadeIn('down', 0.2)}
            initial='hidden'
            animate='show'
            exit='hidden'
            className='h1'
          >
            Sadeepa Bandara <br /> I am{' '}
            <TypeAnimation
              sequence={[
                'an Investor',
                1000,
                'an Entrepreneur',
                1000,
                'a Developer',
                1000,
                'a Designer',
                1000,
              ]}
              speed={10}
              className='text-accent'
              wrapper='span'
              repeat={Infinity}
            />
          </motion.h1>
          <motion.p
            variants={fadeIn('down', 0.3)}
            initial='hidden'
            animate='show'
            exit='hidden'
            className='max-w-sm mx-auto mb-10 xl:max-w-xl xl:mx-0 xl:mb-16'
          >
            Explore my digital portfolio, where creativity and innovation come
            to life. Discover a curated collection of work that showcases my
            journey and the endless possibilities of design and imagination.
          </motion.p>
          <div className='relative flex justify-center xl:hidden'>
            <ProjectsBtn />
          </div>
          <motion.div
            variants={fadeIn('down', 0.4)}
            initial='hidden'
            animate='show'
            exit='hidden'
            className='hidden xl:flex xl:z-10'
          >
            <ProjectsBtn />
          </motion.div>
        </div>
      </div>
      <div className='w-[1450px] h-full absolute right-[-740px] md:right-[-440px] xl:left-[250px] xl:right-0 bottom-0'>
        <div className='absolute w-full h-full bg-left bg-no-repeat bg-cover bg-anonymous xl:bg-right mix-blend-color-dodge translate-z-0'></div>
        <ParticlesContainer />
        <motion.div
          variants={fadeIn('up', 0.5)}
          initial='hidden'
          animate='show'
          exit='hidden'
          transition={{ duration: 1, ease: 'easeInOut' }}
          className='absolute -bottom-32 lg:bottom-0 lg:right-[0%]'
        ></motion.div>
      </div>
    </div>
  );
};

export default Home;
