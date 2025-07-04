import React from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import Logo from '../shared/Logo';
import { FaBox, FaMoneyCheckAlt, FaMapMarkedAlt, FaUserCircle, FaHome, FaMotorcycle, FaUserClock } from "react-icons/fa";

const DashboardLayout = () => {
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col ">
                {/* Page content here */}
                <div className="navbar lg:hidden bg-base-300 w-full">
                    <div className="flex-none lg:hidden">
                        <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-6 w-6 stroke-current"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                ></path>
                            </svg>
                        </label>
                    </div>
                    <div className="mx-2 flex-1 px-2">Navbar Title</div>
                </div>
                <div className='px-6 md:px-8'>
                    <Outlet />
                </div>
            </div>

            <div className="drawer-side">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                    {/* Sidebar content here */}
                    <Logo />
                    <li><Link className='flex items-center gap-2' to={'/dashboard'}><FaHome /> Home</Link></li>

                    <li>
                        <NavLink to="/dashboard/myParcels" className="flex items-center gap-2">
                            <FaBox /> My Parcel
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/paymentsHistory" className="flex items-center gap-2">
                            <FaMoneyCheckAlt /> Payment History
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/track" className="flex items-center gap-2">
                            <FaMapMarkedAlt /> Track a package
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/profile" className="flex items-center gap-2">
                            <FaUserCircle /> Profile
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/active-rider" className="flex items-center gap-2">
                            <FaMotorcycle /> Active Rider
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/pending-riders" className="flex items-center gap-2">
                            <FaUserClock /> Pending Riders
                        </NavLink>
                    </li>

                </ul>
            </div>
        </div>
    );
};

export default DashboardLayout;