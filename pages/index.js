import Head from "next/head";
import ParticlesContainer from "../components/ParticlesContainer";
import ProjectsBtn from "../components/ProjectsBtn";
import { motion } from "framer-motion";
import { fadeIn } from "../variants";
import { TypeAnimation } from "react-type-animation";
import Avatar from "../components/Avatar";

const Home = () => {
    return (
        <div className="h-full">
            <Head>
                <title>Sadeepa | Software Developer & Designer</title>
                <meta
                    name="description"
                    content="Explore the digital portfolio of Sadeepa — investor, entrepreneur, developer, and designer. Discover a curated journey of creativity and innovation."
                />
                <meta
                    name="keywords"
                    content="Sadeepa, Sadeepa Bandara, developer, portfolio, web development, entrepreneur, designer, investor"
                />
                <meta name="author" content="Sadeepa Bandara" />
                <meta
                    property="og:title"
                    content="Sadeepa | Software Developer & Designer"
                />
                <meta
                    property="og:description"
                    content="Explore the digital portfolio of Sadeepa — investor, entrepreneur, developer, and designer. Discover a curated journey of creativity and innovation."
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://szdeepa.com" />
                <meta
                    property="og:image"
                    content="https://szdeepa.com/og-image.jpg"
                />
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content="Sadeepa | Software Developer & Designer"
                />
                <meta
                    name="twitter:description"
                    content="Explore the digital portfolio of Sadeepa — investor, entrepreneur, developer, and designer. Discover a curated journey of creativity and innovation."
                />
                <meta
                    name="twitter:image"
                    content="https://szdeepa.com/og-image.jpg"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="canonical" href="https://szdeepa.com" />

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Person",
                            name: "Sadeepa",
                            description:
                                "Explore the digital portfolio of Sadeepa — investor, entrepreneur, developer, and designer. Discover a curated journey of creativity and innovation.",
                            alternateName: "Sadeepa Bandara",
                            image: "https://szdeepa.com/og-image.jpg",
                            url: "https://szdeepa.com",
                            sameAs: [
                                "https://www.linkedin.com/in/sadeepa-bandara",
                                "https://github.com/sadeepabandara",
                            ],
                            jobTitle: "Software Developer & Designer",
                        }),
                    }}
                />
            </Head>

            <motion.div
                variants={fadeIn("right", 0.2)}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="hidden absolute z-1 bottom-0 -left-[370px]"
            >
                <Avatar />
            </motion.div>
            <div className="w-full h-full">
                <div className="container flex flex-col justify-center h-full mx-auto text-center xl:pt-40 xl:text-left">
                    <motion.h1
                        variants={fadeIn("down", 0.2)}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="h1"
                    >
                        Sadeepa Bandara <br /> I am{" "}
                        <TypeAnimation
                            sequence={[
                                "an Investor",
                                1000,
                                "an Entrepreneur",
                                1000,
                                "a Developer",
                                1000,
                                "a Designer",
                                1000,
                            ]}
                            speed={10}
                            className="text-accent"
                            wrapper="span"
                            repeat={Infinity}
                        />
                    </motion.h1>
                    <motion.p
                        variants={fadeIn("down", 0.3)}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="max-w-sm mx-auto mb-10 xl:max-w-xl xl:mx-0 xl:mb-16"
                    >
                        Explore my digital portfolio, where creativity and
                        innovation come to life. Discover a curated collection
                        of work that showcases my journey and the endless
                        possibilities of design and imagination.
                    </motion.p>
                    <div className="relative flex justify-center xl:hidden">
                        <ProjectsBtn />
                    </div>
                    <motion.div
                        variants={fadeIn("down", 0.4)}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="hidden xl:flex xl:z-10"
                    >
                        <ProjectsBtn />
                    </motion.div>
                </div>
            </div>
            <div className="w-[1450px] h-full absolute right-[-740px] md:right-[-440px] xl:left-[250px] xl:right-0 bottom-0">
                <div className="absolute w-full h-full bg-left bg-no-repeat bg-cover bg-anonymous xl:bg-right mix-blend-color-dodge translate-z-0"></div>
                <ParticlesContainer />
                <motion.div
                    variants={fadeIn("up", 0.5)}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="absolute -bottom-32 lg:bottom-0 lg:right-[0%]"
                ></motion.div>
            </div>
        </div>
    );
};

export default Home;
