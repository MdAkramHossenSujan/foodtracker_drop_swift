import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import useSecureAxios from '../../hooks/useSecureAxios';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const MySwal = withReactContent(Swal);

const ApprovedRiders = () => {
    const axiosSecure = useSecureAxios();

    // Fetch active riders
    const { data: activeRiders = [], isLoading, refetch } = useQuery({
        queryKey: ['activeRiders'],
        queryFn: async () => {
            const res = await axiosSecure.get('/riders/active');
            return Array.isArray(res.data) ? res.data : [res.data];
        }
    });
    console.log(activeRiders)
    const handleDeactivate = (riderId) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: 'This will deactivate the rider.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e3342f',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, deactivate!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.patch(`/riders/${riderId}`, {
                        status: 'inactive'
                    });
                    refetch();
                    Swal.fire('Deactivated!', 'Rider has been deactivated.', 'success');
                } catch (error) {
                    console.error(error);
                    Swal.fire('Error', 'Could not deactivate rider.', 'error');
                }
            }
        });
    };

    const openModal = (rider) => {
        MySwal.fire({
            title: `<strong>Rider Details</strong>`,
            html: `
       <p><strong>Name:</strong> ${rider.name}</p>
        <p><strong>Email:</strong> ${rider.email}</p>
        <p><strong>Status:</strong> ${rider.status}</p>
        <p><strong>Rider Status:</strong> ${rider?.work_status || 'Not Assigned'}</p>
       <p><strong>Applied At:</strong> ${new Date(rider.createdAt).toLocaleString()}</p>
       <p><strong>City:</strong> ${rider.city}</p>
      <p><strong>Contact:</strong> ${rider.phone}</p>
      <p><strong>NID:</strong> ${rider.nid}</p>
      `,
            showCloseButton: true,
            confirmButtonText: 'Close',
        });
    };

    if (isLoading) {
        return <p className="text-center">Loading...</p>;
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Approved Riders</h2>
            {activeRiders.length === 0 ? (
                <p className="text-gray-500">No active riders found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b text-left">Name</th>
                                <th className="py-2 px-4 border-b text-left">Email</th>
                                <th className="py-2 px-4 border-b text-center">Status</th>
                                <th className="py-2 px-4 border-b text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeRiders.map((rider) => (
                                <tr key={rider._id}>
                                    <td className="py-2 px-4 border-b">{rider.name}</td>
                                    <td className="py-2 px-4 border-b">{rider.email}</td>
                                    <td className="py-2 px-4 border-b text-center">
                                        {rider.status === 'approved' ?
                                            <FaCheckCircle className="text-green-500 inline-block" /> : <FaTimesCircle className='text-red-500' />
                                        }
                                    </td>
                                    <td className="py-2 px-4 border-b text-center space-x-2">
                                        <button
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                            onClick={() => openModal(rider)}
                                        >
                                            View
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            onClick={() => handleDeactivate(rider._id)}
                                        >
                                            <FaTimesCircle className="inline-block mr-1" />
                                            Deactivate
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ApprovedRiders;
