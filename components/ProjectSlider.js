import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { Pagination } from 'swiper';
import { BsArrowRight } from 'react-icons/bs';
import Image from 'next/image';

const projectSlides = {
  webDevelopment: {
    slides: [
      {
        images: [
          { title: 'title', path: '/web-5.png' },
          { title: 'title', path: '/web-2.jpg' },
          { title: 'title', path: '/web-3.png' },
          { title: 'title', path: '/web-4.png' },
        ],
      },
      {
        images: [{ title: 'title', path: '/web-1.jpg' }],
      },
    ],
  },
  mobileDevelopment: {
    slides: [
      {
        images: [
          { title: 'title', path: '/mobile-1.png' },
          { title: 'title', path: '/ui-1.png' },
        ],
      },
    ],
  },
  logoDesign: {
    slides: [
      {
        images: [
          { title: 'title', path: '/logo-3.png' },
          { title: 'title', path: '/logo-2.png' },
          { title: 'title', path: '/logo-4.png' },
          { title: 'title', path: '/logo-6.png' },
        ],
      },
      {
        images: [{ title: 'title', path: '/logo-5.png' }],
      },
    ],
  },
  painting: {
    slides: [
      {
        images: [
          { title: 'title', path: '/painting01.jpeg' },
          { title: 'title', path: '/painting02.jpeg' },
          { title: 'title', path: '/painting03.jpeg' },
          { title: 'title', path: '/painting04.jpeg' },
        ],
      },
      {
        images: [
          { title: 'title', path: '/painting05.jpeg' },
          { title: 'title', path: '/painting06.jpeg' },
          { title: 'title', path: '/painting07.jpeg' },
          { title: 'title', path: '/painting08.jpeg' },
        ],
      },
      {
        images: [
          { title: 'title', path: '/painting09.jpeg' },
          { title: 'title', path: '/painting10.jpeg' },
          { title: 'title', path: '/painting11.jpeg' },
          { title: 'title', path: '/painting12.jpeg' },
        ],
      },
      {
        images: [
          { title: 'title', path: '/painting13.jpeg' },
          { title: 'title', path: '/painting14.jpeg' },
          { title: 'title', path: '/painting15.jpeg' },
          { title: 'title', path: '/painting16.jpeg' },
        ],
      },
      {
        images: [{ title: 'title', path: '/painting18.jpeg' }],
      },
    ],
  },
  illustrations: {
    slides: [
      {
        images: [
          { title: 'title', path: '/illustration01.jpeg' },
          { title: 'title', path: '/illustration02.jpeg' },
          { title: 'title', path: '/illustration15.jpeg' },
          { title: 'title', path: '/illustration11.jpeg' },
        ],
      },
      {
        images: [{ title: 'title', path: '/illustration10.jpeg' }],
      },
    ],
  },
};

const ProjectSlider = ({ category }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const slides = projectSlides[category]?.slides || [];

  const openModal = (imagePath) => {
    setSelectedImage(imagePath);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <Swiper
        spaceBetween={10}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        className='h-[280px] sm:h-[480px]'
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className='grid grid-cols-2 grid-rows-2 gap-4 cursor-pointer'>
              {slide.images.map((image, index) => (
                <div
                  className='relative flex items-center justify-center overflow-hidden rounded-lg group'
                  key={index}
                  onClick={() => openModal(image.path)}
                >
                  <div className='relative flex items-center justify-center overflow-hidden group'>
                    <Image
                      src={image.path}
                      width={500}
                      height={300}
                      alt={image.title}
                    />
                    <div className='absolute inset-0 bg-gradient-to-l from-transparent via-[#e838cc] to-[#4a22bd] opacity-0 group-hover:opacity-80 transition-all duration-700'></div>
                    <div className='absolute bottom-0 transition-all duration-300 translate-y-full group-hover:-translate-y-10 xl:group-hover:-translate-y-20'>
                      <div className='flex items-center gap-x-2 text-[13px] tracking-[0.2em]'>
                        <div className='delay-100'>LIVE</div>
                        <div className='translate-y-[500%] group-hover:translate-y-0 transition-all duration-300 delay-150'>
                          PROJECT
                        </div>
                        <div className='text-xl translate-y-[500%] group-hover:translate-y-0 transition-all duration-300 delay-200'>
                          <BsArrowRight />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {selectedImage && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75'
          onClick={closeModal}
        >
          <div className='relative' onClick={(e) => e.stopPropagation()}>
            <Image
              src={selectedImage}
              width={600}
              height={900}
              alt='Full screen image'
              className='rounded-lg h-[600px] object-contain'
            />
            <button
              onClick={closeModal}
              className='absolute text-3xl text-white top-2 right-2'
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectSlider;
