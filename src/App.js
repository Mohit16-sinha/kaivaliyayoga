import React from "react";

import Hero from './components/Hero';
import Header from './components/Header';
import MyParallaxComponent from "./components/myParallaxcomponent";
import NavMobile from "./components/NavMobile";
import Cards from "./components/Cards";

function App(){
  return(
    <div>
      <Header/>
      <Hero/>
      <MyParallaxComponent/>
      <NavMobile/>
      <Cards/>

      
      
    </div>
  );
}

export default App;


