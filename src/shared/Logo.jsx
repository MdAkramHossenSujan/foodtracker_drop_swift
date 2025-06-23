import React from 'react';
import logo from '../assets/logo.png'
const Logo = () => {
    return (
        <div className='flex items-center'>
            <img className='mb-6' src={logo} alt="" />
            <p className='md:text-3xl  font-extrabold -ml-4'>DropSwift</p>
        </div>
    );
};

export default Logo;