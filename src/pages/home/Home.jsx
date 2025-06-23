import React from 'react';
import Banner from './Banner';
import OurServices from './Services';
import Brands from './Brands';
import Benefits from './Benefits';
import MerchantSection from './Marchant';
import HowItWorks from './HowItWorks';

const Home = () => {
    return (
        <div>
            <div>
                <Banner />
            </div>
            <div>
                <HowItWorks />
            </div>
            <div>
                <OurServices />
            </div>
            <div>
                <Brands />
            </div>
            <div>
                <Benefits />
            </div>
            <div>
                <MerchantSection />
            </div>
        </div>
    );
};

export default Home;