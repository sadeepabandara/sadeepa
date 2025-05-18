import "../styles/globals.css";
import Layout from "../components/Layout";
import Transition from "../components/Transition";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import Script from "next/script";

function MyApp({ Component, pageProps }) {
    const router = useRouter();

    return (
        <>
            {/* Google Analytics */}
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-MP69DSCG62"
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-MP69DSCG62', {
                        page_path: window.location.pathname,
                    });
                `}
            </Script>

            <Layout>
                <AnimatePresence mode="wait">
                    <motion.div key={router.route} className="h-full">
                        <Transition />
                        <Component {...pageProps} />
                    </motion.div>
                </AnimatePresence>
            </Layout>
        </>
    );
}

export default MyApp;
