import Head from "next/head";
import TestimonialSlider from "../../components/TestimonialSlider";
import { motion } from "framer-motion";
import { fadeIn } from "../../variants";

const Testimonials = () => {
    return (
        <>
            <Head>
                <title>Sadeepa | Testimonials</title>
                <meta
                    name="description"
                    content="Hear what clients say about working with Sadeepa. Real testimonials reflecting trust, quality, and creative excellence."
                />
                <meta
                    name="keywords"
                    content="Sadeepa, Sadeepa Bandara, testimonials, client feedback, reviews, reputation, services"
                />
                <meta name="author" content="Sadeepa Bandara" />
                <meta property="og:title" content="Sadeepa | Testimonials" />
                <meta
                    property="og:description"
                    content="Client testimonials about Sadeepa — trusted for development, design, and creative services."
                />
                <meta property="og:type" content="website" />
                <meta
                    property="og:url"
                    content="https://szdeepa.com/testimonials"
                />
                <meta
                    property="og:image"
                    content="https://szdeepa.com/og-image.jpg"
                />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Sadeepa | Testimonials" />
                <meta
                    name="twitter:description"
                    content="Discover what clients say about working with Sadeepa — authentic reviews and professional feedback."
                />
                <meta
                    name="twitter:image"
                    content="https://szdeepa.com/og-image.jpg"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="canonical" href="https://szdeepa.com/testimonials" />
            </Head>

            <div className="h-full py-32 text-center bg-primary/30">
                <div className="container flex flex-col justify-center h-full mx-auto">
                    <motion.h2
                        variants={fadeIn("up", 0.2)}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="pt-8 mb-8 h2 xl:mb-0 lg:pt-0"
                    >
                        What clients <span className="text-accent">say.</span>
                    </motion.h2>
                    <motion.div
                        variants={fadeIn("up", 0.4)}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                    >
                        <TestimonialSlider />
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default Testimonials;
