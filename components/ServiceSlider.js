// icons
import {
  RxCrop,
  RxPencil2,
  RxDesktop,
  RxReader,
  RxRocket,
  RxArrowRight,
  RxArrowTopRight,
  RxVideo,
  RxCamera,
} from 'react-icons/rx';
import { VscPaintcan } from 'react-icons/vsc';
import { IoVideocamOutline } from "react-icons/io5";
import { IoGameControllerOutline } from "react-icons/io5";



// data
const serviceData = [
  {
    icon: <RxCrop />,
    title: 'Web Design & Development',
    description:
      'We create stunning, user-friendly websites using the latest design trends and development techniques, ensuring a seamless and engaging user experience for all visitors.',
  },
  {
    icon: <RxRocket />,
    title: 'Search Engine Optimization',
    description:
      'We boost your online visibility with expert SEO strategies, improving search rankings, driving organic traffic, and increasing conversions for your business.',
  },
  {
    icon: <RxPencil2 />,
    title: 'Graphic Design',
    description:
      'We create compelling visuals with innovative graphic design, enhancing brand identity and engaging audiences through aesthetically pleasing and effective designs.',
  },
  {
    icon: <RxReader />,
    title: 'Content Writing',
    description:
      "We craft engaging, high-quality content tailored to your audience, enhancing your brand's voice and driving customer engagement and conversions.",
  },
  {
    icon: <RxDesktop />,
    title: 'Software Development',
    description:
      'We deliver custom software solutions, focusing on functionality and innovation to meet your unique business needs and drive digital transformation.',
  },
  {
    icon: <VscPaintcan />,
    title: 'Painting',
    description:
      'We create captivating paintings, infusing creativity and passion into every stroke, offering unique artworks that evoke emotion and enhance any space.',
  },
  {
    icon: <IoVideocamOutline />,
    title: 'Video Editing',
    description:
      'We specialize in professional video editing, transforming raw footage into polished, captivating content, tailored to your vision and audience, ensuring maximum impact and engagement.',
  },
  {
    icon: <IoGameControllerOutline />,
    title: 'Game Development',
    description:
      'We craft immersive games, blending creativity and technology to deliver captivating experiences across various platforms, engaging players and pushing boundaries in the gaming industry.',
  },
];

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { FreeMode, Pagination } from 'swiper';

const ServiceSlider = () => {
  return (
    <Swiper
      breakpoints={{
        320: {
          slidesPerView: 1,
          spaceBetween: 15,
        },
        640: {
          slidesPerView: 3,
          spaceBetween: 15,
        },
      }}
      freeMode={true}
      pagination={{
        clickable: true,
      }}
      modules={[FreeMode, Pagination]}
      className='h-[240px] sm:h-[340px]'
    >
      {serviceData.map((service, index) => {
        return (
          <SwiperSlide key={index}>
            <div className='bg-[rgba(65,47,123,0.15)] h-max rounded-lg px-6 py-8 flex sm:flex-col gap-x-6 sm:gap-x-0 group cursor-pointer hover:bg-[rgba(89,65,169,0.15)]'>
              <div className='mb-4 text-4xl text-accent'>{service.icon}</div>
              <div className='mb-8'>
                <div className='mb-2 text-lg'>{service.title}</div>
                <p className='max-w-[350px] leading-normal'>
                  {service.description}
                </p>
              </div>
              <div className='text-3xl'>
                <RxArrowTopRight className='transition-all duration-300 group-hover:rotate-45 group-hover:text-accent' />
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default ServiceSlider;
