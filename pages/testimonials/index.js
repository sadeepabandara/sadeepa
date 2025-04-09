import TestimonialSlider from '../../components/TestimonialSlider';
import { motion } from 'framer-motion';
import { fadeIn } from '../../variants';

const Testimonials = () => {
  return (
    <div className='h-full py-32 text-center bg-primary/30'>
      <div className='container flex flex-col justify-center h-full mx-auto'>
        <motion.h2
          variants={fadeIn('up', 0.2)}
          initial='hidden'
          animate='show'
          exit='hidden'
          className='pt-8 mb-8 h2 xl:mb-0 lg:pt-0'
        >
          What clients <span className='text-accent'>say.</span>
        </motion.h2>
        {/* <div className='absolute w-full h-full bg-none xl:bg-explosion xl:bg-cover xl:bg-right xl:bg-no-repeat mix-blend-color-dodge translate-z-0'></div> */}
        <motion.div
          variants={fadeIn('up', 0.4)}
          initial='hidden'
          animate='show'
          exit='hidden'
        >
          <TestimonialSlider />
        </motion.div>
      </div>
    </div>
  );
};

export default Testimonials;
