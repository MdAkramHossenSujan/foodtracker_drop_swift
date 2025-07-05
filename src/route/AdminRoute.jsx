import React from 'react';
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';
import { Navigate, useLocation } from 'react-router';

const AdminRoute = ({children}) => {
    const { user, loading } = useAuth()
    const {role,roleLoading}=useUserRole()
    const location=useLocation()
    if (loading || roleLoading) {
        return <div className='min-h-screen max-w-screen mx-auto flex justify-center'>
            <span className="loading loading-dots loading-xl"></span>
        </div>
    }
    if(!user || role !== 'admin'){
        return <Navigate state={{from:location.pathname}} to={'/forbidden'}></Navigate>
    }
    return children;
};

export default AdminRoute;