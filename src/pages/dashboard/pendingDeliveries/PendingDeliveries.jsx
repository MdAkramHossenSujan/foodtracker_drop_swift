import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useSecureAxios from '../../../hooks/useSecureAxios';
import useAuth from '../../../hooks/useAuth';

const PendingDeliveries = () => {
    const axiosSecure = useSecureAxios();
    const queryClient = useQueryClient();
    const { user, loading } = useAuth();

    const { data: parcels = [], isLoading, isError } = useQuery({
        queryKey: ['rider-parcels', user?.email],
        enabled: !loading && !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/rider/parcels?email=${user.email}`);
            return res.data;
        }
    });
    const mutation = useMutation({
        mutationFn: async ({ id, status }) => {
            const res = await axiosSecure.patch(`/parcels/${id}/condition`, {
                status
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['rider-parcels']);
            Swal.fire('Success', 'Parcel status updated!', 'success');
        },
        onError: () => {
            Swal.fire('Error', 'Failed to update status.', 'error');
        }
    });

    const handleStatusChange = (id, status) => {
        Swal.fire({
          title: 'Are you sure?',
          text: `This will mark the parcel as ${status}.`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, confirm!',
        }).then(result => {
          if (result.isConfirmed) {
            mutation.mutate({ id, status });
          }
        });
      };
      

    if (isLoading) return <p className="text-center">Loading...</p>;
    if (isError) return <p className="text-center text-red-500">Failed to load parcels.</p>;

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6 text-primary">Your Pending Deliveries</h2>
            {parcels.length === 0 ? (
                <p className="text-center text-gray-500">No assigned parcels found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-base-200">
                            <tr>
                                <th>Tracking ID</th>
                                <th>Receiver</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {parcels.map(parcel => (
                                <tr key={parcel._id}>
                                    <td>{parcel.tracking_id}</td>
                                    <td>
                                        {parcel.receiverName} <br />
                                        <span className="text-sm text-gray-500">{parcel.receiverService}</span>
                                    </td>
                                    <td>
                                        <span className="badge badge-info capitalize">{parcel.delivery_status}</span>
                                    </td>
                                    <td>
                                        {parcel.delivery_status !== 'delivered' && (
                                            <button
                                                className={`btn btn-sm ${parcel.delivery_status === 'rider-assigned' ? 'btn-warning' : 'btn-success'}`}
                                                onClick={() =>
                                                    handleStatusChange(
                                                        parcel._id,
                                                        parcel.delivery_status === 'rider-assigned' ? 'in_transit' : 'delivered'
                                                    )
                                                }
                                            >
                                                {parcel.delivery_status === 'rider-assigned'
                                                    ? 'Mark as picked up'
                                                    : 'Mark as delivered'}
                                            </button>
                                        )}

                                        {parcel.delivery_status === 'delivered' && (
                                            <span className="badge badge-success">Delivered</span>
                                        )}
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

export default PendingDeliveries;
