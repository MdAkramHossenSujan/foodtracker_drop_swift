import React from 'react';
import { Link } from 'react-router';
import { FaLock } from 'react-icons/fa';

const Forbidden = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      <FaLock className="text-red-500 text-6xl mb-4" />
      <h1 className="text-4xl font-bold text-gray-600 mb-2">Access Forbidden</h1>
      <p className="text-gray-500 text-center mb-6 max-w-md">
        Sorry, you don’t have permission to access this page in the Parcel Delivery App.
      </p>
      <Link
        to="/"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default Forbidden;
