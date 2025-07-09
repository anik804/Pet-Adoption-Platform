import React from 'react';
import Banner from '../../Components/Home Components/Banner';
import AboutUs from '../../Components/Home Components/AboutUs';
import CallToAction from '../../Components/Home Components/CallToAction';
import HowYouCanHelp from '../../Components/Home Components/HowYouCanHelp';
import SuccessStories from '../../Components/Home Components/SuccessStoriesSection';

const Home = () => {
  return (
    <div>
      {/* <h1>Welcome to the Pet Adoption Platform</h1> */}
      {/* <Banner></Banner> */}
      <Banner></Banner>
      <CallToAction></CallToAction>
      <AboutUs></AboutUs>
      <HowYouCanHelp></HowYouCanHelp>
      <SuccessStories></SuccessStories>
    </div>
  );
};

export default Home;