import React, { useState } from 'react';
import Avatar from '../../components/Avatar';
import Circles from '../../components/Circles';
import { motion } from 'framer-motion';
import { fadeIn } from '../../variants';
import CountUp from 'react-countup';

// icons
import {
  FaHtml5,
  FaCss3,
  FaJs,
  FaReact,
  FaNodeJs,
  FaFigma,
  FaJava,
  FaSwift,
  FaGithub,
  FaGitlab,
} from 'react-icons/fa';

import {
  SiNextdotjs,
  SiFramer,
  SiAdobexd,
  SiAdobephotoshop,
  SiTailwindcss,
  SiCsharp,
} from 'react-icons/si';
import BottomRightImg from '../../components/BottomRightImg';

//  data
const aboutData = [
  {
    title: 'skills',
    info: [
      {
        title: 'Web Development',
        icons: [
          <FaHtml5 />,
          <FaCss3 />,
          <FaJs />,
          <FaReact />,
          <SiNextdotjs />,
          <SiFramer />,
          <FaNodeJs />,
          <SiTailwindcss />,
        ],
      },
      {
        title: 'UI/UX Design',
        icons: [<FaFigma />, <SiAdobexd />, <SiAdobephotoshop />],
      },
      {
        title: 'Enterprise Development',
        icons: [<FaJava />, <SiCsharp />],
      },
      {
        title: 'Mobile App Development',
        icons: [<FaSwift />, <FaReact />],
      },
      {
        title: 'Version Control',
        icons: [<FaGithub />, <FaGitlab />],
      },
    ],
  },
  {
    title: 'education',
    info: [
      {
        title: 'Deakin University - MSc in IT Management',
        stage: '2024 - Present',
      },
      {
        title: 'Coventry University - BSc (Hons) in Computing',
        stage: '2021 - 2024',
      },
      {
        title: 'NIBM - Higher Diploma in Software Engineering',
        stage: '2020 - 2021',
      },
      {
        title: 'NIBM - Diploma in Software Engineering',
        stage: '2019 - 2020',
      },
    ],
  },
  {
    title: 'experience',
    info: [
      {
        title: 'Freelancer - Fiverr',
        stage: '2018 - Present',
      },
      {
        title: 'Intern Software Engineer - Web Sevens',
        stage: '2021 Jul - 2022 Feb',
      },
    ],
  },
  {
    title: 'certifications',
    info: [
      {
        title: 'The Complete JavaScript Course 2022: From Zero to Expert!',
        stage: '2022',
      },
      {
        title: 'Modern HTML & CSS From The Beginning (Including Sass)',
        stage: '2021',
      },
    ],
  },
];

const About = () => {
  const [index, setIndex] = useState(0);

  return (
    <div className='h-full py-32 text-center bg-primary/30 xl:text-left'>
      <BottomRightImg />
      <BottomRightImg />
      <motion.div
        variants={fadeIn('right', 0.2)}
        initial='hidden'
        animate='show'
        exit='hidden'
        className='hidden absolute bottom-0 xl:flex -left-[370px]'
      >
        <Avatar />
      </motion.div>
      <div className='container flex flex-col items-center h-full mx-auto xl:flex-row gap-x-6'>
        <div className='flex flex-col justify-center flex-1'>
          <div className='relative'>
            <motion.h2
              variants={fadeIn('right', 0.2)}
              initial='hidden'
              animate='show'
              exit='hidden'
              className='h2'
            >
              Innovation <span className='text-accent'>thrives </span>
              on creative passion.
            </motion.h2>
            <motion.img
              variants={fadeIn('right', 0.2)}
              initial='hidden'
              animate='show'
              exit='hidden'
              className='absolute right-12 hidden h-16 bottom-[-20px] w-52 xl:block'
              src='./underline.svg'
              alt=''
            />
          </div>
          <motion.p
            variants={fadeIn('right', 0.4)}
            initial='hidden'
            animate='show'
            exit='hidden'
            className='max-w-[500px] mx-auto xl:mx-0 mb-6 xl:mb-12 px-2 xl:px-0 '
          >
            My name is Sadeepa Bandara, a 24-year-old from Sri Lanka. An alumnus
            of Maliyadeva Model School, Kurunegala, I hold a BSc (Hons) in
            Computing from Coventry University, UK. As an Investor,
            Entrepreneur, Developer, and Designer, I am dedicated to innovation
            and growth. Currently, I&apos;m pursuing a MSc in Information
            Technology Management at Deakin University, Australia, to further my
            expertise in the tech industry.
          </motion.p>
          <motion.div
            variants={fadeIn('right', 0.6)}
            initial='hidden'
            animate='show'
            exit='hidden'
            className='hidden mx-auto mb-8 md:flex md:max-w-xl xl:max-w-none xl:mx-0'
          >
            <div className='flex flex-1 xl:gap-x-6'>
              <div className='relative flex-1 after:w-[1px] after:h-full after:bg-white/10 after:absolute after:top-0 after:right-0'>
                <div className='mb-2 text-2xl font-extrabold xl:text-4xl text-accent'>
                  <CountUp start={0} end={2} duration={5} /> +
                </div>
                <div className='text-xs tracking-[1px] leading-[1.4] max-w-[100px] uppercase'>
                  Years of experience
                </div>
              </div>
              <div className='relative flex-1 after:w-[1px] after:h-full after:bg-white/10 after:absolute after:top-0 after:right-0'>
                <div className='mb-2 text-2xl font-extrabold xl:text-4xl text-accent'>
                  <CountUp start={0} end={25} duration={5} /> +
                </div>
                <div className='text-xs tracking-[1px] leading-[1.4] max-w-[100px] uppercase'>
                  Satisfied clients
                </div>
              </div>
              <div className='relative flex-1 after:w-[1px] after:h-full after:bg-white/10 after:absolute after:top-0 after:right-0'>
                <div className='mb-2 text-2xl font-extrabold xl:text-4xl text-accent'>
                  <CountUp start={0} end={100} duration={5} /> +
                </div>
                <div className='text-xs tracking-[1px] leading-[1.4] max-w-[100px] uppercase'>
                  Finished projects
                </div>
              </div>
              <div className='relative flex-1'>
                <div className='mb-2 text-2xl font-extrabold xl:text-4xl text-accent'>
                  <CountUp start={0} end={5} duration={5} />
                </div>
                <div className='text-xs tracking-[1px] leading-[1.4] max-w-[100px] uppercase'>
                  Stars
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        <motion.div
          variants={fadeIn('left', 0.4)}
          initial='hidden'
          animate='show'
          exit='hidden'
          className='flex flex-col w-full xl:max-w-[48%] h-[480px]'
        >
          <div className='flex mx-auto mb-4 gap-x-4 xl:gap-x-8 xl:mx-0'>
            {aboutData.map((item, itemIndex) => {
              return (
                <div
                  key={itemIndex}
                  className={`relative capitalize cursor-pointer xl:text-lg
    ${
      index === itemIndex
        ? 'text-accent after:w-[100%] after:bg-accent'
        : 'text-white after:w-8 after:bg-white'
    }
    after:h-[2px] after:absolute after:-bottom-1 after:left-0 after:transition-all after:duration-300
  `}
                  onClick={() => setIndex(itemIndex)}
                >
                  {item.title}
                </div>
              );
            })}
          </div>
          <div className='flex flex-col items-center py-2 xl:py-6 gap-y-2 xl:gap-y-4 xl:items-start'>
            {aboutData[index].info.map((item, itemIndex) => {
              return (
                <div
                  key={itemIndex}
                  className='flex flex-col items-center flex-1 text-white/60 md:flex-row max-w-max gap-x-2'
                >
                  <div className='mb-2 font-light md:mb-0'>{item.title}</div>
                  <div className='hidden md:flex'>-</div>
                  <div>{item.stage}</div>
                  <div className='flex gap-x-4'>
                    {item.icons?.map((icon, iconIndex) => {
                      return (
                        <div key={iconIndex} className='text-2xl text-white'>
                          {icon}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
