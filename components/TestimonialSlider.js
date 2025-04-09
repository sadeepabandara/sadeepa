// testimonial data
const testimonialData = [
  {
    image: '/customer-1.jpg',
    name: 'Anne Smith',
    position: 'Customer',
    message:
      "It's been great working with Sadeepa thus far and I look forward to our continued partnership! I was really surprised by the work quality. This is why you hire an expert and I'm so glad I went with his team so far!",
  },
  {
    image: '/customer-2.jpg',
    name: 'Kelly Watkins',
    position: 'Customer',
    message:
      'Amazing work! Sadeepa goes the extra mile to deliver a great service. I am so pleased with the website that Sadeepa delivered. He knows how to do business correctly and is always in great communication. Do not pass up doing business with Sadeepa.',
  },
  {
    image: '/customer-3.jpg',
    name: 'Marlene Ogata',
    position: 'Customer',
    message:
      'This man did an excellent job! I am really happy and satisfied with the work that was done for me. The communication was great, and everything was completed just the way I wanted. I would definitely recommend Sadeepa to others and would love to work with them again in the future. Thank you so much for the great service!',
  },
];

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper';
import { FaQuoteLeft } from 'react-icons/fa';
import Image from 'next/image';

const TestimonialSlider = () => {
  return (
    <Swiper
      navigation={true}
      pagination={{
        clickable: true,
      }}
      modules={[Navigation, Pagination]}
      className='h-[400px]'
    >
      {testimonialData.map((testimonial, index) => {
        return (
          <SwiperSlide key={index}>
            <div className='flex flex-col items-center h-full px-16 md:flex-row gap-x-8'>
              <div className='w-full max-w-[300px] flex flex-col xl:justify-center items-center relative mx-auto xl:mx-0'>
                <div className='flex flex-col justify-center text-center'>
                  <div className='mx-auto mb-2'>
                    <Image
                      src={testimonial.image}
                      width={100}
                      height={100}
                      className='object-cover rounded-full h-28 w-28'
                      alt=''
                    />
                  </div>
                  <div className='text-lg'>{testimonial.name}</div>
                  <div className='text-[12px] uppercase tracking-widest font-extralight'>
                    {testimonial.position}
                  </div>
                </div>
              </div>

              <div className='flex flex-col justify-center flex-1 before:w-[1px] xl:before:bg-white/20 xl:before:absolute xl:before:left-0 xl:before:h-[200px] relative xl:pl-20'>
                <div className='mb-4'>
                  <FaQuoteLeft className='mx-auto text-4xl text-accent/80 md:mx-0 xl:text-6xl' />
                </div>
                <div className='text-center xl:text-lg md:text-left'>
                  {testimonial.message}
                </div>
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default TestimonialSlider;
