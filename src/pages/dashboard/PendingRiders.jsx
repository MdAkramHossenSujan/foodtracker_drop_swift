import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import useSecureAxios from '../../hooks/useSecureAxios';
import { FaCheck, FaEye, FaTimes } from 'react-icons/fa';

const MySwal = withReactContent(Swal);

const PendingRiders = () => {
  const axiosSecure = useSecureAxios();

  // Fetch pending riders
  const { data: pendingRiders = [], isLoading, refetch } = useQuery({
    queryKey: ['pendingRiders'],
    queryFn: async () => {
      const res = await axiosSecure.get('/riders/pending');
      return Array.isArray(res.data) ? res.data : [res.data];
    }
  });
console.log(pendingRiders)
  const handleApprove = async (riderId, action) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${action} this rider?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${action}!`
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.patch(`/riders/${riderId}`, {
            status: action === 'approve' ? 'approved' : 'rejected'
          });
          refetch();
          Swal.fire('Success', `Rider has been ${action}d successfully.`, 'success');
        } catch (err) {
          console.error(err);
          Swal.fire('Error', 'Could not update status.', err);
        }
      }
    });
  };

  const [selectedRider, setSelectedRider] = useState(null);

  const openModal = (rider) => {
    setSelectedRider(rider);
    MySwal.fire({
      title: `<strong>Rider Details</strong>`,
      html: `
        <p><strong>Name:</strong> ${rider.name}</p>
        <p><strong>Email:</strong> ${rider.email}</p>
        <p><strong>Status:</strong> ${rider.status}</p>
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
      <h2 className="text-2xl font-bold mb-4">Pending Riders</h2>
      {pendingRiders.length === 0 ? (
        <p className="text-gray-500">No pending riders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Email</th>
                  <th className="py-2 px-4 border-b text-left">District</th>
                   <td className="py-2 px-4 border-b">Vehicle</td>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingRiders.map((rider) => (
                <tr key={rider._id}>
                  <td className="py-2 px-4 border-b">{rider.name}</td>
                  <td className="py-2 px-4 border-b">{rider.email}</td>
                   <td className="py-2 px-4 border-b">{rider.district}</td>
                    <td className="py-2 px-4 border-b">{rider.vehicleType}</td>
                  <td className="py-2 px-4 border-b capitalize">{rider.status}</td>
                  <td className="py-2 px-4 border-b text-center space-x-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => openModal(rider)}
                    >
                     <FaEye/>
                    </button>
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      onClick={() => handleApprove(rider._id, 'approve')}
                    >
                      <FaCheck/>
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => handleApprove(rider._id,'reject')}
                    >
                      <FaTimes/>
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

export default PendingRiders;
