import React from 'react';

//import data
import {courses} from '../data';

//import icons
import{ BsStarFill } from 'react-icons/bs'


const Coursevacomponent = () => {
  return <div className='section-sm lg:section-lg'>
    <div className='container mx-auto'>
     {/*text */}
      <div className='text-center mb-16 lg:mb-32'>
        <h2 className='h2 mb-3 lg:mb-[18px]'>Popular Courses</h2>
        <p className='max-w-[480px] mx-auto'>
        Practice anywhere, anytime. Explore a new way 
        to exercise and learn 
        more about yourself. We are providing the best.
        </p>
      </div>
      {/*course list */}
      <div>
      {courses.map((item,index)=>{
        //destructure item 
        const{image,title,desc,link,delay} = item;
        return <div key={index}>
          <div>
            <img src={image} alt=''/>
          </div>
          {/* text  */}
          <div>
            <h4>{title}</h4>
            <p>{desc}</p>
          </div>
          {/* bottom */}
          <div>
            {/* stars */}
            <div>
              <BsStarFill/>
              <BsStarFill/>
              <BsStarFill/>
              <BsStarFill/>
              <BsStarFill/>
            </div>
          </div>
        </div>
      })}
      </div>

      {/*btn */}

      <div>
        <button>Browse all</button>
      </div>

    </div>
  </div>;
};

export default Coursevacomponent;