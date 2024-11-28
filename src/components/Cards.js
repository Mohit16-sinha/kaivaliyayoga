import React from 'react';

// Import images
import card1 from '../assets/img/cards/card-1.png';
import card2 from '../assets/img/cards/card-2.png';
import card3 from '../assets/img/cards/card-3.png';
import card4 from '../assets/img/cards/bg1.png';

const Cards = () => {
  return ( 
    <section className=''>
      <div className='container mx-auto'>
        <div>
          <div> card1 </div>
          <div> card2 </div>
        </div>
        <div> card3 </div>
      </div>
    </section>
  );
};

export default Cards;
