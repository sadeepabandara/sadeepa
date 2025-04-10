import ServiceSlider from '../../components/ServiceSlider';
import Circles from '../../components/Circles';
import { motion } from 'framer-motion';
import { fadeIn } from '../../variants';

const Services = () => {
  return (
    <div className='flex items-center h-full bg-primary/30 py-36'>
      <Circles />
      <div className='container mx-auto'>
        <div className='flex flex-col items-center xl:flex gap-x-8'>
          <div className='flex flex-col mb-4 text-center xl:mb-6'>
            <motion.h2
              variants={fadeIn('up', 0.3)}
              initial='hidden'
              animate='show'
              exit='hidden'
              className='pt-16 md:pt-32 lg:pt-0 h2 xl:mt-8 xl:mb-6'
            >
              My Services <span className='text-accent'>.</span>
            </motion.h2>
            <motion.img
              variants={fadeIn('up', 0.3)}
              initial='hidden'
              animate='show'
              exit='hidden'
              className='hidden xl:absolute right-[560px] top-[170px] w-60 h-16'
              src='./underline.svg'
              alt=''
            />
            <motion.p
              variants={fadeIn('up', 0.4)}
              initial='hidden'
              animate='show'
              exit='hidden'
              className='mb-4 max-w-[1000px] mx-auto lg:mx-0 lg:text-left'
            >
              Our diverse range of services includes web design, SEO, graphic
              design, content writing, software development, painting, video
              editing, and game development. We provide tailored solutions to
              elevate your online presence, enhance brand identity, and deliver
              captivating experiences across various platforms.
            </motion.p>
          </div>
          <motion.div
            variants={fadeIn('down', 0.6)}
            initial='hidden'
            animate='show'
            exit='hidden'
            className='w-full xl:max-w-[95%]'
          >
            <ServiceSlider />
          </motion.div>
        </div>
      </div>
      {/* <Bulb /> */}
    </div>
  );
};

export default Services;
