// MyParallaxComponent.js
import React from 'react';
import { Parallax } from 'react-parallax';
import './myParallaxComponent.css';

function MyParallaxComponent() {
  return (
    <div className="parallax-container">
      {/* First Parallax Section (Decreased Height) */}
      <Parallax
        bgImage="./images/img1.jpg.jpg"  // The first image as background
        strength={300}
        bgImageStyle={{ objectFit: 'contain', objectPosition: 'top-right' }}
      >
        <div style={{ height: 300 }}>  {/* Decreased height of the first parallax */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              right: '10%',
              transform: 'translateY(-50%)',
              textAlign: 'right',
              color: 'black',
            }}
          >
            <h4 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
              Yoga to <br /> Release Stress
            </h4>
            <p style={{ maxWidth: '300px', lineHeight: '1.5' }}>
              Yoga is a way of life, rather than a chore. Counteract the stress
              of modern life by becoming more mindful and compassionate.
            </p>
          </div>
        </div>
      </Parallax>

      {/* Second Parallax Section (Background Image) */}
      <Parallax
        bgImage="./images/bg.png"  // The second image as background
        strength={300}
        bgImageStyle={{ objectFit: 'cover', objectPosition: 'center' }}
      >
        <div style={{ height: 400 }}>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              right: '10%',
              transform: 'translateY(-50%)',
              textAlign: 'right',
              color: 'black',
            }}
          >
            <h4 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
              Welcome to our site
            </h4>
            <p style={{ maxWidth: '300px', lineHeight: '1.5' }}>
              Discover the joy of mindfulness and balance with our guidance. Join us to embrace a peaceful life.
            </p>
          </div>
        </div>
      </Parallax>
    </div>
  );
}

export default MyParallaxComponent;
