import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router';

const PrivateRoute = ({children}) => {
    const {user,loading}=useAuth()
    if(loading){
        return  <div className='min-h-screen max-w-screen mx-auto flex justify-center'>
                    <span className="loading loading-dots loading-xl"></span>
                </div>
    }
    if(!user){
        <Navigate to={'/login'}></Navigate>
    }
    return children
};

export default PrivateRoute;