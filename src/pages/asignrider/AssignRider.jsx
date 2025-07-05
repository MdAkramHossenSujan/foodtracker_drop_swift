import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useSecureAxios from '../../hooks/useSecureAxios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const AssignRider = () => {
    const axiosSecure = useSecureAxios();
    const queryClient = useQueryClient();

    const [selectedParcel, setSelectedParcel] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    // Fetch parcels
    const { data: parcels = [], isLoading, isError, error } = useQuery({
        queryKey: ['parcels', 'not-collected'],
        queryFn: async () => {
            const res = await axiosSecure.get('/parcels', {
                params: { delivery_status: 'not-collected' }
            });
            return res.data;
        }
    });

    // Fetch active riders (only when modal opens)
    const { data: riders = [], isLoading: ridersLoading } = useQuery({
        queryKey: ['riders'],
        queryFn: async () => {
            const res = await axiosSecure.get('/riders/active');
            return res.data;
        },
        enabled: modalOpen
    });

    const mutation = useMutation({
        mutationFn: async ({ parcelId, rider }) => {
          // PATCH only the parcel
          console.log(parcelId, rider)
          await axiosSecure.patch(`/parcels/${parcelId}/status`, {
            status: 'rider-assigned',
            assignedRiderId: rider._id,
            assignedRiderName: rider.name,
            assignedRiderEmail: rider.email
          });
        },
        onSuccess: () => {
          queryClient.invalidateQueries(['parcels', 'not-collected']);
          setModalOpen(false);
          MySwal.fire('Success', 'Rider assigned and parcel updated!', 'success');
        },
        onError: () => {
          MySwal.fire('Error', 'Failed to assign rider.', 'error');
          console.log(error)
        }
      });
      


const openAssignModal = (parcel) => {
    setSelectedParcel(parcel);
    setModalOpen(true);
};

const assignRider = (rider) => {
    MySwal.fire({
        title: 'Assign Rider?',
        html: `
        <p>Assign <strong>${rider.name}</strong> to parcel:</p>
        <p><strong>${selectedParcel.tracking_id}</strong></p>
      `,
        showCancelButton: true,
        confirmButtonText: 'Assign',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            mutation.mutate({
                parcelId: selectedParcel._id,
                riderId: rider._id,
                rider: rider
            });
        }
    });
};

if (isLoading) {
    return <p className="text-center">Loading parcels...</p>;
}

if (isError) {
    return (
        <p className="text-center text-red-500">
            Error fetching parcels: {error.message}
        </p>
    );
}

return (
    <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-3xl font-bold mb-6 text-primary">Parcels Awaiting Collection</h2>

        {parcels.length === 0 ? (
            <p className="text-gray-500">No parcels found.</p>
        ) : (
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead className="bg-primary text-white">
                        <tr>
                            <th>Tracking ID</th>
                            <th>Receiver Region</th>
                            <th>Title</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parcels.map((parcel) => (
                            <tr key={parcel._id}>
                                <td>{parcel.tracking_id}</td>
                                <td>{parcel.receiverRegion}</td>
                                <td>{parcel.title}</td>
                                <td>{parcel.creation_date}</td>
                                <td>
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => openAssignModal(parcel)}
                                    >
                                        Assign Rider
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {/* DaisyUI Modal */}
        <dialog className={`modal ${modalOpen ? 'modal-open' : ''}`}>
            <form method="dialog" className="modal-box max-w-5xl">
                <h3 className="font-bold text-lg mb-4">
                    Assign Rider for Parcel: {selectedParcel?.tracking_id}
                </h3>

                {ridersLoading ? (
                    <p className="text-center">Loading riders...</p>
                ) : (
                    <>
                        {riders.length === 0 && (
                            <div className="text-center text-gray-500 py-10">
                                🚫 No active riders available.
                            </div>
                        )}

                        {riders.length > 0 && (
                            <>
                                {riders.filter(r => r.region === selectedParcel?.receiverRegion).length === 0 && (
                                    <div className="text-center text-orange-500 font-medium mb-4">
                                        ⚠️ No riders found in{' '}
                                        <span className="font-bold">
                                            {selectedParcel?.receiverRegion}
                                        </span>{' '}
                                        region. Showing all active riders below:
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
                                    {riders.map((rider) => {
                                        const matches = rider.region === selectedParcel?.receiverRegion;
                                        return (
                                            <div
                                                key={rider._id}
                                                className={`card border hover:shadow-lg transition ${matches ? 'border-green-500 bg-green-800 text-white' : 'border-base-600'
                                                    }`}
                                            >
                                                <div className="card-body p-4">
                                                    <h2 className="card-title text-primary">{rider.name}</h2>
                                                    <p className="text-sm text-gray-300">{rider.email}</p>
                                                    <p className="text-sm">
                                                        Region: <span className="font-medium">{rider.region}</span>
                                                    </p>
                                                    <p className="text-sm">
                                                        Phone: <span className="font-medium">{rider.phone}</span>
                                                    </p>

                                                    {matches && (
                                                        <div className="badge badge-success mt-2">
                                                            Matches Receiver Region
                                                        </div>
                                                    )}

                                                    <button
                                                        onClick={() => assignRider(rider)}
                                                        className="btn btn-sm btn-accent mt-3"
                                                    >
                                                        Assign Rider
                                                    </button>
                                                </div>
                                            </div>

                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </>
                )}

                <div className="modal-action">
                    <button
                        className="btn"
                        onClick={() => setModalOpen(false)}
                    >
                        Close
                    </button>
                </div>
            </form>
        </dialog>
    </div>
);
};

export default AssignRider;




