// ../data.js

  import { BsCheck, BsChevronRight } from 'react-icons/bs';

  import CourseImage1 from '../src/assets/img/coursepics/course-1.png';
  import CourseImage2 from '../src/assets/img/coursepics/course-2.png';
  import CourseImage3 from '../src/assets/img/coursepics/course-3.png';

  export const navigation = [
    { href: "/home", name: "Home" },
    { href: "/about", name: "About" },
    { href: "/services", name: "Services" },
    { href: "/contact", name: "Contact" },
  ];

  export const courses = [
    {
      image: CourseImage1,
      title: 'Resortive Yoga Training & Immersion',
      desc: 'Here is some tips for new job seekars who want to get a dream job and want to shine in his career.',
      link: 'Get started',
      delay: '600',
    },
    {
      image: CourseImage2,
      title: 'Resortive Yoga Training & Immersion',
      desc: 'Here is some tips for new job seekars who want to get a dream job and want to shine in his career.',
      link: 'Get started',
      delay: '800',
    },
    {
      image: CourseImage3,
      title: 'Resortive Yoga Training & Immersion',
      desc: 'Here is some tips for new job seekars who want to get a dream job and want to shine in his career.',
      link: 'Get started',
      delay: '900',
    },
  ];

  export const pricing = [
    {
      title: 'Single yoga class',
      price: '$15.',
      list: [
        {
          icon: <BsCheck />,
          name: 'Pay as you go',
        },
        {
          icon: <BsCheck />,
          name: 'Perfect for non-residence',
        },
        {
          icon: <BsCheck />,
          name: 'Acces to all classes',
        },
      ],
      buttonText: 'Book now',
      buttonIcon: <BsChevronRight />,
      delay: '600',
    },
    {
      title: 'Single yoga class',
      price: '$60.',
      list: [
        {
          icon: <BsCheck />,
          name: 'Pay as you go',
        },
        {
          icon: <BsCheck />,
          name: 'Perfect for non-residence',
        },
        {
          icon: <BsCheck />,
          name: 'Acces to all classes',
        },
        {
          icon: <BsCheck />,
          name: 'Acces to all mentors',
        },
      ],
      buttonText: 'Book now',
      buttonIcon: <BsChevronRight />,
      delay: '800',
    },
    {
      title: 'Single yoga class',
      price: '$150.',
      list: [
        {
          icon: <BsCheck />,
          name: 'Pay as you go',
        },
        {
          icon: <BsCheck />,
          name: 'Perfect for non-residence',
        },
        {
          icon: <BsCheck />,
          name: 'Acces to all classes',
        },
        {
          icon: <BsCheck />,
          name: 'Acces to all mentors',
        },
      ],
      buttonText: 'Book now',
      buttonIcon: <BsChevronRight />,
      delay: '900',
    },
  ];