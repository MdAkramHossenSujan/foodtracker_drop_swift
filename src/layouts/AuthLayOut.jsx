import React from 'react';
import { Outlet } from 'react-router';
import authImage from '../assets/authImage.png'
import Logo from '../shared/Logo';
const AuthLayOut = () => {
    return (
        <div className="max-w-7xl relative mx-auto min-h-screen">
            <div className=' lg:p-12 lg:absolute p-6'>
                <Logo />
            </div>
            <div className="hero-content p-0 flex-col lg:flex-row-reverse">
                <div className='flex-1 lg:min-h-screen flex bg-[#FAFDF0]'>

                    <img
                        src={authImage}
                        className="max-w-sm md:max-w-md rounded-lg my-auto mx-auto"
                    />
                </div>
                <div className='flex-1 w-full'>
                    <Outlet />
                </div>
            </div>
        </div>

    );
};

export default AuthLayOut; 