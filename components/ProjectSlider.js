import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { Pagination } from 'swiper';
import { BsArrowRight } from 'react-icons/bs';
import Image from 'next/image';
import desktopProjectSlides from '../data/desktopProjectSlides';
import mobileProjectSlides from '../data/mobileProjectSlides';

const ProjectSlider = ({ category }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleMediaChange = (e) => setIsMobile(e.matches);
    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  // Choose the appropriate slides based on device
  const slides = isMobile
    ? mobileProjectSlides[category]?.slides || []
    : desktopProjectSlides[category]?.slides || [];

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
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            {isMobile ? (
              <div className='relative flex items-center justify-center overflow-hidden rounded-lg cursor-pointer group'>
                <div className='relative flex items-center justify-center max-h-[400px] overflow-hidden group'>
                  <Image
                    src={slide.images[0].path}
                    width={500}
                    height={300}
                    alt={slide.images[0].title}
                    className='object-cover w-full h-full'
                    onClick={() => openModal(slide.images[0].path)}
                  />
                  {/* Overlay effects remain the same */}
                  <div className='absolute inset-0 bg-gradient-to-l from-transparent via-[#e838cc] to-[#4a22bd] opacity-0 group-hover:opacity-80 transition-all duration-700'></div>
                  <div className='absolute inset-0 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100'>
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
            ) : (
              <div className='grid grid-cols-2 grid-rows-2 gap-4 cursor-pointer'>
                {slide.images.map((image, idx) => (
                  <div
                    className='relative flex items-center justify-center overflow-hidden rounded-lg group'
                    key={idx}
                    onClick={() => openModal(image.path)}
                  >
                    <div className='relative flex items-center justify-center max-h-[200px] overflow-hidden group'>
                      <Image
                        src={image.path}
                        width={500}
                        height={300}
                        alt={image.title}
                        className='object-cover w-full h-full'
                      />
                      <div className='absolute inset-0 bg-gradient-to-l from-transparent via-[#e838cc] to-[#4a22bd] opacity-0 group-hover:opacity-80 transition-all duration-700'></div>
                      <div className='absolute inset-0 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100'>
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
            )}
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
