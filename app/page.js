"use client"
import React, { useState, useEffect } from 'react';
// import SplashNavBar from '@components/SplashNavBar.js';
import SignUpButton from '@components/SplashSignUpButton';
import Header from "../components/Header/Header";
import "../styles/Home.scss";
import { Row, Col, Button } from "antd";
import Estimate from "../components/Landing/WhyEstimate";
import Steps from "../components/Landing/ThreeSteps";
import Featured from "../components/Landing/FeaturedProperties";
import Analytics from "../components/Landing/Analytics";
import Reviews from "../components/Landing/Reviews";
import Footer from "../components/Footer/Footer";
import { useRouter } from 'next/navigation';

export default function Page() {
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <div className="skeleton-layout">Loading...</div>;
  }

  const browseProperties = () => {
    router.push('/sign-in');
  }

  return (
    <div className='xlg:bg-splash-background-xlarge xs: h-full w-auto bg-splash-background-small bg-cover bg-[center_top] bg-no-repeat sm:bg-splash-background-medium lg:bg-splash-background-large xl:bg-[center_top_-4rem]'>
      <div className='h-full w-full bg-black bg-opacity-5'>
        {/* Navigation */}
        <Header />

        {/* Banner */}
        <div className='homeWrapper'>
          <Row gutter={16} className="bannerWrapper">
            <Col md={12} xs={24}>
              <div className='leftSection'>
                <div className='text'>
                  <h1>Smart Property Analytics</h1>
                  <span>Make data-driven decisions with comprehensive property analytics</span>
                </div>
                <div className='buttonSection'>
                  <Button className='demo'>View Demo</Button>
                  <Button className='browse' onClick={browseProperties}>Browse properties</Button>
                </div>
              </div>
            </Col>
          </Row>

          {/* Estimate */}
          <Row gutter={16}>
            <Col md={24} xs={24}>
              <Estimate />
            </Col>
          </Row>

          {/* Steps */}
          <Row gutter={16}>
            <Col md={24} xs={24}>
              <Steps />
            </Col>
          </Row>

          {/* Featured Properties */}
          <Row gutter={16}>
            <Col md={24} xs={24}>
              <Featured />
            </Col>
          </Row>

          {/* Analytics */}
          <Row gutter={16}>
            <Col md={24} xs={24}>
              <Analytics />
            </Col>
          </Row>

          {/* Analytics */}
          <Row gutter={16}>
            <Col md={24} xs={24}>
              <Reviews />
            </Col>
          </Row>

          {/* <SignUpButton /> */}
        </div>

        <Footer />
        {/* Footer */}
        {/* <div className='absolute bottom-0 flex w-full flex-row items-center justify-center gap-6 pb-3'>
          <p className="mb-2">© {new Date().getFullYear()} EstiMate. All rights reserved.</p>
          <a href='privacy-policy' className='text-white'>
            Privacy Policy
          </a>
          <a href='https://discord.gg/RXmpKUqz' className='text-white' target="_blank" rel="noopener noreferrer">
            Join our Discord
          </a>
        </div> */}
      </div>
    </div>
  );
}