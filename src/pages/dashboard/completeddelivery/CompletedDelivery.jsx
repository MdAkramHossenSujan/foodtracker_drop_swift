import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth';
import useSecureAxios from '../../../hooks/useSecureAxios';

const CompletedDeliveries = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useSecureAxios();
    const queryClient = useQueryClient();

    const [isCashoutProcessing, setIsCashoutProcessing] = useState(false);

    const { data: parcels = [], isLoading, isError } = useQuery({
        queryKey: ['completed-parcels', user?.email],
        enabled: !loading && !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcel/delivered?email=${user.email}`);
            return res.data;
        }
    });
    const eligible = parcels.filter(p => p.rider_payment_status !== 'paid');
    const calculateEarnings = (parcel) => {
        const cost = Number(parcel.cost) || 0;
        const sameDistrict =
            parcel.senderRegion?.toLowerCase() === parcel.receiverRegion?.toLowerCase();
        const percentage = sameDistrict ? 0.3 : 0.8;
        return cost * percentage;
    };

    const { totalEarnings, eligibleParcels } = useMemo(() => {
        const eligible = parcels.filter(p => p.payout_status !== 'paid');
        const total = eligible.reduce((acc, p) => acc + calculateEarnings(p), 0);
        return {
            totalEarnings: total.toFixed(2),
            eligibleParcels: eligible
        };
    }, [parcels]);

    const cashoutMutation = useMutation({
        mutationFn: async ({ amount, parcelIds }) => {
            return await axiosSecure.post('/rider/cashout', {
                email: user.email,
                amount,
                parcelIds
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['completed-parcels']);
            Swal.fire('Success', 'Cashout completed successfully!', 'success');
            setIsCashoutProcessing(false);
        },
        onError: () => {
            Swal.fire('Error', 'Cashout failed.', 'error');
            setIsCashoutProcessing(false);
        }
    });

    const handleCashout = () => {
        if (!eligibleParcels.length) {
            Swal.fire('Oops', 'No eligible parcels for cashout.', 'info');
            return;
        }

        Swal.fire({
            title: 'Confirm Cashout',
            text: `You’re about to cash out ৳${totalEarnings}. Proceed?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Cash Out'
        }).then((result) => {
            if (result.isConfirmed) {
                setIsCashoutProcessing(true);
                cashoutMutation.mutate({
                    amount: Number(totalEarnings),
                    parcelIds: eligibleParcels.map(p => p._id)
                });
            }
        });
    };

    if (isLoading) return <p className="text-center">Loading...</p>;
    if (isError) return <p className="text-center text-red-500">Failed to load deliveries.</p>;

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4 text-primary">Completed Deliveries</h2>

            <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-semibold text-green-600">
                    Total Earnings (eligible for cashout): ৳{totalEarnings}
                </div>
                <button
                    className="btn btn-primary"
                    disabled={
                        isCashoutProcessing ||
                        totalEarnings === "0.00" ||
                        eligible.length === 0
                    }
                    onClick={handleCashout}
                >
                    {isCashoutProcessing ? 'Processing...' : 'Cash Out'}
                </button>

            </div>

            {parcels.length === 0 ? (
                <p className="text-gray-500 text-center">No completed deliveries found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-base-200">
                            <tr>
                                <th>Tracking ID</th>
                                <th>Sender District</th>
                                <th>Receiver District</th>
                                <th>Cost (৳)</th>
                                <th>Delivery Status</th>
                                <th>Earnings (৳)</th>
                                <th>Payout Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {parcels.map((parcel) => {
                                const earnings = calculateEarnings(parcel).toFixed(2);
                                return (
                                    <tr key={parcel._id}>
                                        <td>{parcel.tracking_id}</td>
                                        <td>{parcel.senderRegion}</td>
                                        <td>{parcel.receiverRegion}</td>
                                        <td>{parcel.cost}</td>
                                        <td>
                                            <span className="badge badge-success capitalize">
                                                {parcel.delivery_status}
                                            </span>
                                        </td>
                                        <td className="text-green-600 font-bold">{earnings}</td>
                                        <td>
                                            {parcel.rider_payment_status === 'paid' ? (
                                                <span className="badge badge-success">Paid</span>
                                            ) : (
                                                <span className="badge badge-warning">Pending</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CompletedDeliveries;
