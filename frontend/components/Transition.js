import { motion } from 'framer-motion';

const transitionVariants = {
  initial: {
    x: '100%',
    width: '100%',
  },
  animate: {
    x: '0%',
    width: '0%',
  },
  exit: {
    x: ['0%', '100%'],
    width: ['0%', '100%'],
  },
};

const Transition = () => {
  return (
    <>
      <motion.div
        className='fixed top-0 bottom-0 z-30 w-screen h-screen right-full bg-[#1b4487]'
        variants={transitionVariants}
        initial='initial'
        animate='animate'
        exit='exit'
        transition={{ delay: 0.2, duration: 0.6, ease: 'easeInOut' }}
      ></motion.div>
      <motion.div
        className='fixed top-0 bottom-0 z-20 w-screen h-screen right-full bg-[#142d63]'
        variants={transitionVariants}
        initial='initial'
        animate='animate'
        exit='exit'
        transition={{ delay: 0.4, duration: 0.6, ease: 'easeInOut' }}
      ></motion.div>
      <motion.div
        className='fixed top-0 bottom-0 z-10 w-screen h-screen right-full bg-[#101d4e]'
        variants={transitionVariants}
        initial='initial'
        animate='animate'
        exit='exit'
        transition={{ delay: 0.6, duration: 0.6, ease: 'easeInOut' }}
      ></motion.div>
    </>
  );
};

export default Transition;
