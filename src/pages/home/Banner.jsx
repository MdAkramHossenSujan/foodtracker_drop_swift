import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import bannerOne from '../../assets/banner/banner1.png'
import bannerTwo from '../../assets/banner/banner2.png'
import bannerThree from '../../assets/banner/banner3.png'
import { Carousel } from 'react-responsive-carousel';
const Banner = () => {
    return (
       <Carousel autoPlay={true} infiniteLoop={true} showThumbs={false} showStatus={false}
>
                <div>
                    <img src={bannerOne} />
                </div>
                <div>
                    <img src={bannerTwo} />
                   
                </div>
                <div>
                    <img src={bannerThree} />
                   
                </div>
            </Carousel>
    );
};

export default Banner;