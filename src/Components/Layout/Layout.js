import React from 'react'
import Footer from './Footer';
import { Navbar } from './Navbar';

const Layout = ({children}) => {
  return (
    <div>
        <Navbar/>
        <main style={{minHeight: "100vh"}}>
            {children}
        </main>
        <Footer/>
    </div>
  );
}

export default Layout;