import Head from "next/head";
import ServiceSlider from "../../components/ServiceSlider";
import Circles from "../../components/Circles";
import { motion } from "framer-motion";
import { fadeIn } from "../../variants";

const Services = () => {
    return (
        <>
            <Head>
                <title>Sadeepa Bandara | Services</title>
                <meta
                    name="description"
                    content="Explore a diverse range of services by Sadeepa Bandara — from web design and software development to painting, video editing, and more."
                />
                <meta
                    name="keywords"
                    content="Sadeepa Bandara, services, web design, SEO, content writing, software development, painting, video editing, game development"
                />
                <meta name="author" content="Sadeepa Bandara" />
                <meta
                    property="og:title"
                    content="Sadeepa Bandara | Services"
                />
                <meta
                    property="og:description"
                    content="Discover the full range of services offered by Sadeepa Bandara — creative, technical, and artistic solutions tailored to your needs."
                />
                <meta property="og:type" content="website" />
                <meta
                    property="og:url"
                    content="https://szdeepa.com/services"
                />
                <meta
                    property="og:image"
                    content="https://szdeepa.com/og-image.jpg"
                />
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content="Sadeepa Bandara | Services"
                />
                <meta
                    name="twitter:description"
                    content="Explore a variety of professional services from Sadeepa Bandara — creative, digital, and development work customized for you."
                />
                <meta
                    name="twitter:image"
                    content="https://szdeepa.com/og-image.jpg"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="canonical" href="https://szdeepa.com/services" />
            </Head>

            <div className="flex items-center h-full bg-primary/30 py-36">
                <Circles />
                <div className="container mx-auto">
                    <div className="flex flex-col items-center xl:flex gap-x-8">
                        <div className="flex flex-col mb-4 text-center xl:mb-6">
                            <motion.h2
                                variants={fadeIn("up", 0.3)}
                                initial="hidden"
                                animate="show"
                                exit="hidden"
                                className="pt-16 md:pt-32 lg:pt-0 h2 xl:mt-8 xl:mb-6"
                            >
                                My Services{" "}
                                <span className="text-accent">.</span>
                            </motion.h2>
                            <motion.img
                                variants={fadeIn("up", 0.3)}
                                initial="hidden"
                                animate="show"
                                exit="hidden"
                                className="hidden xl:absolute right-[560px] top-[170px] w-60 h-16"
                                src="./underline.svg"
                                alt=""
                            />
                            <motion.p
                                variants={fadeIn("up", 0.4)}
                                initial="hidden"
                                animate="show"
                                exit="hidden"
                                className="mb-4 max-w-[1000px] mx-auto lg:mx-0 lg:text-left"
                            >
                                Our diverse range of services includes web
                                design, SEO, graphic design, content writing,
                                software development, painting, video editing,
                                and game development. We provide tailored
                                solutions to elevate your online presence,
                                enhance brand identity, and deliver captivating
                                experiences across various platforms.
                            </motion.p>
                        </div>
                        <motion.div
                            variants={fadeIn("down", 0.6)}
                            initial="hidden"
                            animate="show"
                            exit="hidden"
                            className="w-full xl:max-w-[95%]"
                        >
                            <ServiceSlider />
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Services;
