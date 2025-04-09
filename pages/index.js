import ParticlesContainer from '../components/ParticlesContainer';
import ProjectsBtn from '../components/ProjectsBtn';
import Avatar from '../components/Avatar';
import { motion } from 'framer-motion';
import { fadeIn } from '../variants';
import { TypeAnimation } from 'react-type-animation';

const Home = () => {
  return (
    <div className='h-full'>
      <div className='w-full h-full'>
        <div className='container flex flex-col justify-center h-full mx-auto text-center xl:pt-40 xl:text-left'>
          <motion.h1
            variants={fadeIn('down', 0.2)}
            initial='hidden'
            animate='show'
            exit='hidden'
            className='h1'
          >
            Sadeepa Bandara <br /> I am a{' '}
            <TypeAnimation
              sequence={[
                'Investor',
                1000,
                'Entrepreneur',
                1000,
                'Developer',
                1000,
                'Designer',
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
            Discover where creativity meets innovation on my digital canvas.
            Explore a mosaic of projects that reflect my journey, bringing ideas
            to life and unfolding unique possibilities.
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
      <div className='w-[1450px] h-full absolute left-[250px] right-0 bottom-0'>
        <div className='absolute w-full h-full bg-none xl:bg-anonymous xl:bg-cover xl:bg-right xl:bg-no-repeat mix-blend-color-dodge translate-z-0'></div>
        <ParticlesContainer />
        <motion.div
          variants={fadeIn('up', 0.5)}
          initial='hidden'
          animate='show'
          exit='hidden'
          transition={{ duration: 1, ease: 'easeInOut' }}
          className='absolute -bottom-32 lg:bottom-0 lg:right-[0%]'
        >
          {/* <Avatar /> */}
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
