import { Sora } from 'next/font/google';

const sora = Sora({
  subsets: ['latin'],
  variable: ['--font-sora'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
});

import Nav from './Nav';
import Header from './Header';
import TopLeftImg from './TopLeftImg';
import AiChatButton from './AiChatButton';

const Layout = ({ children }) => {
  return (
    <div
      className={`text-white overflow-y-auto xl:overflow-hidden bg-no-repeat bg-gradient-to-br from-blue-900/10 via-blue-900/20 to-blue-900/40 bg-cover page ${sora.variable} font-sora relative`}
    >
      <TopLeftImg />
      <TopLeftImg />
      <Nav />
      <Header />
      {/* <AiChatButton /> */}
      {children}
    </div>
  );
};

export default Layout;
