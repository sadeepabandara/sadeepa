import React, { useRef } from 'react';
import { BsArrowRight } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { fadeIn } from '../../variants';
import emailjs from '@emailjs/browser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
  const ref = useRef();
  // const [success, setSuccess] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(ref.current);
    const requiredFields = ['name', 'email', 'subject', 'message'];
    let isFormValid = true;

    requiredFields.forEach((field) => {
      const value = formData.get(field);
      if (!value || value.trim() === '') {
        toast.error(`Please fill in ${field} field.`, {
          theme: 'dark',
        });
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      return;
    }

    emailjs
      .sendForm(
        'service_jlwhj0i',
        'template_h8fcpli',
        ref.current,
        's7PdHu5bSYNIsTc5R'
      )
      .then(
        () => {
          toast.success('Message sent successfully!', {
            theme: 'dark',
          });

          ref.current.reset();
        },
        () => {
          toast.error('Something went wrong!', {
            theme: 'dark',
          });
        }
      );
  };

  return (
    <div className='h-full bg-primary/30'>
      <div className='container flex items-center justify-center h-full py-32 mx-auto text-center xl:text-left'>
        <div className='flex flex-col w-full max-w-[700px]'>
          <motion.h2
            variants={fadeIn('up', 0.2)}
            initial='hidden'
            animate='show'
            exit='hidden'
            className='pt-16 mb-12 text-center h2 lg:pt-0'
          >
            Let's <span className='text-accent'>connect.</span>
          </motion.h2>

          <motion.form
            ref={ref}
            variants={fadeIn('up', 0.4)}
            initial='hidden'
            animate='show'
            exit='hidden'
            onSubmit={handleSubmit}
            className='flex flex-col flex-1 w-full gap-6 mx-auto'
          >
            <div className='flex w-full gap-x-6'>
              <input
                type='text'
                name='name'
                placeholder='name'
                className='input'
              />
              <input
                type='email'
                name='email'
                placeholder='email'
                className='input'
              />
            </div>
            <input
              type='text'
              name='subject'
              placeholder='subject'
              className='input'
            />
            <textarea
              name='message'
              cols='30'
              rows='10'
              placeholder='message'
              className='textarea'
            ></textarea>
            <button
              type='submit'
              className='border rounded-full btn border-white/50 max-w-[170px] px-8 transition-all duration-300 flex items-center justify-center overflow-hidden hover:border-accent group'
            >
              <span className='group-hover:-translate-y-[120%] group-hover:opacity-0 transition-all duration-500'>
                Let's talk
              </span>
              <BsArrowRight className='-translate-y-[120%] opacity-0 group-hover:flex group-hover:-translate-y-0 group-hover:opacity-100 transition-all duration-300 absolute text-[22px]' />
            </button>
            <ToastContainer />
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
