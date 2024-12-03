import React from "react";

import Hero from './components/Hero';
import Header from './components/Header';
import MyParallaxComponent from "./components/myParallaxcomponent";
import NavMobile from "./components/NavMobile";
import Cards from "./components/Cards";
import Facts from "./components/Facts";
import Features from "./components/Features";

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

      
      
    </div>
  );
}

export default App;


