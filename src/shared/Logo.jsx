import React from 'react';
import logo from '../assets/logo.png'
import { Link } from 'react-router';
const Logo = () => {
    return (
        <Link to={'/'}>
            <div className='flex items-center'>
                <img className='mb-6' src={logo} alt="" />
                <p className='md:text-3xl  font-extrabold -ml-4'>DropSwift</p>
            </div>
        </Link>
    );
};

export default Logo;