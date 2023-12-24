import Footer from "./Footer";
import Navbar from "./Navbar";
import { Toaster } from 'react-hot-toast';

const Layout = ({ children }) => {
  return (
    <>
    <Toaster/>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
