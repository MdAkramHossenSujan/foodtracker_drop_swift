import React, { use } from 'react';
import { Link, NavLink } from 'react-router';
import Logo from './Logo';
import { AuthContext } from '../context/AuthContext';
import { Moon, Sun } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { theme, toggleTheme, user, logOut } = use(AuthContext)
  const navItems = <>
    <li><NavLink to={'/'}>Home</NavLink></li>
    <li><NavLink to={'/sendParcel'}>Send a parcel</NavLink></li>
    <li><NavLink to={'/about'}>About Us</NavLink></li>
    <li><NavLink to={'/coverage'}>Coverage</NavLink></li>
  </>
  const userNavbar = <>
    <li><NavLink to={'/dashboard'}>Dashboard</NavLink></li>
  </>
  const handleSignOut = () => {
    logOut()
      .then(() => {
        toast.success('Signed Out Successful')
      }).catch(error => {
        console.log(error)
      })
  }
  return (
    <div className="navbar rounded-3xl mb-8 bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            {
              navItems
            }
            {
              user && userNavbar
            }
          </ul>
        </div>
        <div className='lg:px-8'>
          <Logo />
        </div>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {
            navItems
          }
          {
            user && userNavbar
          }
        </ul>
      </div>
      <div className="navbar-end">

        {
          user ? <div className='pr-14 md:pr-12 flex gap-1 md:gap-2'>
            <div>
              <img
                data-tooltip-id="view-tooltip"
                data-tooltip-content={user.displayName}
                data-tooltip-place="top"
                className="w-12 hidden md:block h-12 rounded-full border-4 border-green-400 dark:border-green-700 shadow-lg cursor-pointer transition-transform hover:scale-105"
                src={user?.photoURL || 'https://i.ibb.co.com/hJztTMWF/La-suite-de-Dragon-Ball-Z-arrive-cet-ete.jpg'}
                alt="User"
              />
              <Tooltip id="view-tooltip" />
            </div>
            <button onClick={handleSignOut} className='btn my-auto btn-sm rounded-xl lg:btn lg:rounded-2xl lg:bg-[#CAEB66] bg-[#CAEB66]'>
              Sign Out
            </button>

          </div> :
            <div className='pr-14 md:pr-12 flex gap-1 md:gap-2'>
              <Link to={'/register'}> <button className='btn btn-sm rounded-xl lg:btn lg:rounded-2xl dark:border dark:border-white'>Sign Up</button></Link>
              <Link to={'login'}><button className='btn btn-sm rounded-xl lg:btn lg:rounded-2xl lg:bg-[#CAEB66] bg-[#CAEB66]'>Sign In</button></Link>
            </div>
        }
        <label onClick={toggleTheme} className={`cursor-pointer fixed bg-blue-600 dark:bg-blue-900
 md:p-2 p-1 z-100 rounded-full swap swap-rotate ${theme === 'dark' ? 'swap-active' : ''}`}>
          <Moon size={20} className="swap-on text-gray-400" />
          <Sun size={20} className="swap-off text-yellow-500" />
        </label>
      </div>
    </div>
  );
};

export default Navbar;