// MyParallaxComponent.js
import React from 'react';
import { Parallax } from 'react-parallax';
import './myParallaxComponent.css';

function MyParallaxComponent() {
    return ( 
        <div className="parallax-container">
        
          <Parallax bgImage="./images/img1.jpg.jpg" strength={500}>
            <div style={{ height: 400 }}>
              <div style={{ color: 'black', paddingTop: 200, textAlign: 'center' }}>
              <h1>Welcome to our site</h1>
              </div>
            </div>
          </Parallax>

          {/* Second Parallax Image */}
          <Parallax bgImage="./images/bg.png" strength={300}>
           <div style={{
             height: 400,
             position:'relative',
             top:'10%',
             right:'10%',
             margin:'0',
            }}>
            <h1 style={{ 
                color: 'white', 
                paddingTop: 10,
                position:'absolute',
                top:'10px',
                right:'10px',
                textAlign: 'center',
                margin: 50,
                }}>
              
            </h1>
           </div>
          </Parallax>

        </div>
      );
}

export default MyParallaxComponent;
