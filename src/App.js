import React from "react";

import Hero from './components/Hero';
import Header from './components/Header';
import MyParallaxComponent from "./components/myParallaxcomponent";
import NavMobile from "./components/NavMobile";

function App(){
  return(
    <div>
      <Header/>
      <Hero/>
      <MyParallaxComponent/>
      <NavMobile/>
      
      
    </div>
  );
}

export default App;


