import React from "react";

import Hero from './components/Hero';
import Header from './components/Header';
import MyParallaxComponent from "./components/myParallaxcomponent";
import NavMobile from "./components/NavMobile";
import Cards from "./components/Cards";
import Facts from "./components/Facts";
import Features from "./components/Features";
import Courseva from "./components/Courseva";
import Pricing from "./components/Pricing";
import Newsletter from "./components/Newsletter";
import Contact from "./components/Contact";
import Footer from "./components/Footer";




function App(){
  return(
    <div>
      <Header/>
      <Hero/>
      <MyParallaxComponent/>
      <NavMobile/>
      <Cards/>
      <Facts/>
      <Features/>
      <Courseva/>
      <Pricing/>
      <Newsletter/>
      <Contact/>
      <Footer/>
      
      

      
      
    </div>
  );
}

export default App;


