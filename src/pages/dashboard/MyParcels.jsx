import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FaCheckCircle, FaTimesCircle, FaEye, FaTrash, FaDollarSign } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import useSecureAxios from '../../hooks/useSecureAxios';
import Swal from 'sweetalert2';

const MyParcels = () => {
    const { user } = useAuth();
    const axiosSecure = useSecureAxios();


    const { data: parcels = [], isLoading, refetch } = useQuery({
        queryKey: ['my-parcels', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?email=${user.email}`);
            return res.data;
        }
    });

    const handlePay = async (id) => {
        try {
            // Your payment logic here, e.g. redirect to payment or call API
            alert(`Pay action clicked for parcel id: ${id}`);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'This parcel will be permanently deleted.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!',
            });

            if (result.isConfirmed) {
                await axiosSecure.delete(`/parcels/${id}`)
                    .then(res => {
                        if (res.data.deletedCount) {
                            Swal.fire({
                                title: 'Deleted!',
                                text: 'Parcel has been deleted.',
                                icon: 'success',
                                timer: 2000,
                                showConfirmButton: false,
                            });
                        }
                        refetch()
                    })
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to delete parcel.',
                icon: 'error',
            });
        }
    };


    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">
                My Parcels: {parcels.length}
            </h2>
            <div className="overflow-x-auto">
                <table className="table  w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Created At</th>
                            <th>Cost (৳)</th>
                            <th>Payment</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parcels.map((parcel, index) => (
                            <tr key={parcel._id}>
                                <td>{index + 1}</td>
                                <td>{parcel.title}</td>
                                <td className="capitalize">{parcel.type}</td>
                                <td>{parcel.creation_date}</td>
                                <td>{parcel.cost}</td>
                                <td>
                                    {parcel.payment_status === 'paid' ? (
                                        <span className="flex items-center gap-2 text-green-600 font-medium">
                                            <FaCheckCircle className="text-green-500" />
                                            Paid
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2 text-red-600 font-medium">
                                            <FaTimesCircle className="text-red-500" />
                                            Unpaid
                                        </span>
                                    )}
                                </td>

                                <td className="flex gap-2">
                                    <button
                                        className="btn btn-xs btn-outline btn-primary flex items-center gap-1"
                                        title="View Parcel"
                                        onClick={() => alert(`View parcel id: ${parcel._id}`)}
                                    >
                                        <FaEye />
                                        View
                                    </button>

                                    {parcel.payment_status === 'unPaid' && (
                                        <button
                                            className="btn btn-xs btn-outline btn-success flex items-center gap-1"
                                            title="Pay Now"
                                            onClick={() => handlePay(parcel._id)}
                                        >
                                            <FaDollarSign />
                                            Pay
                                        </button>
                                    )}

                                    <button
                                        className="btn btn-xs btn-outline btn-error flex items-center gap-1"
                                        title="Delete Parcel"
                                        onClick={() => handleDelete(parcel._id)}
                                    >
                                        <FaTrash />
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {parcels.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center text-gray-500 py-4">
                                    No parcels found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyParcels;

