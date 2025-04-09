import { useState } from 'react';
import ProjectSlider from '../../components/ProjectSlider';
import Bulb from '../../components/Bulb';
import Circles from '../../components/Circles';
import { motion } from 'framer-motion';
import { fadeIn } from '../../variants';

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState('webDevelopment');

  const categories = [
    { id: 'webDevelopment', label: 'Web Development' },
    // { id: 'mobileDevelopment', label: 'Mobile Development' },
    { id: 'logoDesign', label: 'Logo Design' },
    { id: 'painting', label: 'Painting' },
    { id: 'illustrations', label: 'Illustrations' },
  ];

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className='flex items-center h-full bg-primary/30 py-36'>
      <Circles />
      <div className='container mx-auto'>
        <div className='flex flex-col xl:flex-row gap-x-8'>
          <div className='flex text-center xl:w-[30vw] flex-col lg:text-left mb-4 xl:mb-0'>
            <motion.h2
              variants={fadeIn('up', 0.3)}
              initial='hidden'
              animate='show'
              exit='hidden'
              className='pt-40 md:pt-0 h2 xl:mt-0 xl:mb-8'
            >
              My Projects <span className='text-accent'>.</span>
            </motion.h2>
            <motion.img
              variants={fadeIn('up', 0.4)}
              initial='hidden'
              animate='show'
              exit='hidden'
              className='absolute left-[230px] top-[200px] w-60 h-16 hidden xl:block'
              src='./underline.svg'
              alt=''
            />
            <motion.p
              variants={fadeIn('up', 0.5)}
              initial='hidden'
              animate='show'
              exit='hidden'
              className='mb-4 max-w-[400px] mx-auto lg:mx-0'
            >
              Discover my Projects page, where creativity meets innovation. Each
              project showcases my journey, transforming ideas into unique
              solutions. Dive in to see the possibilities unfold.
            </motion.p>
            <motion.div
              variants={fadeIn('up', 0.5)}
              initial='hidden'
              animate='show'
              exit='hidden'
              className='flex flex-wrap justify-center gap-2 lg:justify-start'
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`py-2 px-4 rounded-full border-2 border-accent ${
                    selectedCategory === category.id
                      ? 'bg-accent text-white'
                      : 'border-accent text-white'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </motion.div>
          </div>
          <motion.div
            variants={fadeIn('down', 0.6)}
            initial='hidden'
            animate='show'
            exit='hidden'
            className='w-full xl:max-w-[65%]'
          >
            <ProjectSlider category={selectedCategory} />
          </motion.div>
        </div>
      </div>
      {/* <Bulb /> */}
    </div>
  );
};

export default Projects;
