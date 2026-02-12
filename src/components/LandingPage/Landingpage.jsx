import React from 'react';
import './Landingpage.css';
import Navbar from '../Navbar/Navbar';
import CategoryShowcase from './CategoryShowcase/';
import Testimonials from './testimonials';
import BannerCarousel from '../BannerCarousel/bannerCarousel';
import ProductFlow from "../ProductFlow/ProductFlow";

const Landingpage = () => {
  return (
    <>
      <div className="landingpage-container">
          <div className="home">
             <BannerCarousel />
             <CategoryShowcase />
              <ProductFlow/>
            <Testimonials />            
          </div>        
      </div>
    </>
  );
};

export default Landingpage;
