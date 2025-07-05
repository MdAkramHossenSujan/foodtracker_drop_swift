import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useSecureAxios from '../../../hooks/useSecureAxios';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

const RiderEarningsDashboard = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useSecureAxios();
  const queryClient = useQueryClient();
  const [isCashoutProcessing, setIsCashoutProcessing] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['rider-earnings', user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/rider/earnings?email=${user.email}`);
      return res.data;
    }
  });

  const summary = useMemo(() => {
    if (!data) return {
      pendingEarningsLocal: 0,
      pendingEarningsInter: 0,
      totalPendingEarnings: 0,
      todayEarnings: 0,
      weekEarnings: 0,
      monthEarnings: 0,
      yearEarnings: 0,
      totalPaid: 0,
      totalPaidParcels: 0,
      pendingParcelsCount: 0
    };

    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToMonday = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek);
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + diffToMonday);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    let pendingLocal = 0;
    let pendingInter = 0;
    let todayEarnings = 0;
    let weekEarnings = 0;
    let monthEarnings = 0;
    let yearEarnings = 0;
    let totalPaid = 0;
    let totalPaidParcels = 0;

    for (const p of data.pendingParcels) {
      const cost = Number(p.cost) || 0;
      const sameDistrict = (p.senderRegion?.toLowerCase() === p.receiverRegion?.toLowerCase());
      const percentage = sameDistrict ? 0.3 : 0.8;
      const earning = cost * percentage;

      if (sameDistrict) {
        pendingLocal += earning;
      } else {
        pendingInter += earning;
      }
    }

    for (const payment of data.riderPayments) {
      const amount = Number(payment.amount) || 0;
      totalPaid += amount;
      totalPaidParcels += payment.parcelIds?.length || 0;

      const payoutDate = new Date(payment.payoutDate);

      if (payoutDate.toDateString() === now.toDateString()) {
        todayEarnings += amount;
      }

      if (payoutDate >= weekStart && payoutDate <= weekEnd) {
        weekEarnings += amount;
      }

      if (
        payoutDate.getFullYear() === now.getFullYear() &&
        payoutDate.getMonth() === now.getMonth()
      ) {
        monthEarnings += amount;
      }

      if (payoutDate.getFullYear() === now.getFullYear()) {
        yearEarnings += amount;
      }
    }

    return {
      pendingEarningsLocal: pendingLocal.toFixed(2),
      pendingEarningsInter: pendingInter.toFixed(2),
      totalPendingEarnings: (pendingLocal + pendingInter).toFixed(2),
      todayEarnings: todayEarnings.toFixed(2),
      weekEarnings: weekEarnings.toFixed(2),
      monthEarnings: monthEarnings.toFixed(2),
      yearEarnings: yearEarnings.toFixed(2),
      totalPaid: totalPaid.toFixed(2),
      totalPaidParcels,
      pendingParcelsCount: data.pendingParcels.length
    };
  }, [data]);

  const handleCashout = () => {
    Swal.fire({
      title: 'Confirm Cashout',
      text: `Cash out ৳${summary.totalPendingEarnings}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Cash Out'
    }).then(result => {
      if (result.isConfirmed) {
        setIsCashoutProcessing(true);
       
      }
    });
  };

  if (isLoading) return <p className="text-center mt-10">Loading earnings...</p>;
  if (isError) return <p className="text-center text-red-500 mt-10">Failed to load earnings.</p>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-8 text-primary">Rider Earnings Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <SummaryCard label="Pending Earnings (Local)" value={`৳${summary.pendingEarningsLocal}`} color="success" />
        <SummaryCard label="Pending Earnings (Inter-district)" value={`৳${summary.pendingEarningsInter}`} color="warning" />
        <SummaryCard label="Total Pending Earnings" value={`৳${summary.totalPendingEarnings}`} color="primary" />
        <SummaryCard label="Today’s Earnings" value={`৳${summary.todayEarnings}`} color="info" />
        <SummaryCard label="This Week" value={`৳${summary.weekEarnings}`} color="info" />
        <SummaryCard label="This Month" value={`৳${summary.monthEarnings}`} color="secondary" />
        <SummaryCard label="This Year" value={`৳${summary.yearEarnings}`} color="accent" />
        <SummaryCard label="Total Paid" value={`৳${summary.totalPaid}`} color="neutral" />
        <SummaryCard label="Pending Parcels Count" value={summary.pendingParcelsCount} color="ghost" />
      </div>

      <h3 className="text-2xl font-bold mb-4">Cashout History</h3>
      {data?.riderPayments?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200">
              <tr>
                <th>Date</th>
                <th>Amount (৳)</th>
                <th>No. of Parcels</th>
              </tr>
            </thead>
            <tbody>
              {data.riderPayments.map((payment) => (
                <tr key={payment._id}>
                  <td>{dayjs(payment.payoutDate).format('DD MMM YYYY')}</td>
                  <td>৳{payment.amount}</td>
                  <td>{payment.parcelIds.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">No cashout records found.</p>
      )}
    </div>
  );
};

const SummaryCard = ({ label, value, color }) => (
  <div className={`card bg-base-100 shadow border border-base-300`}>
    <div className="card-body">
      <h3 className={`text-lg font-semibold text-${color}`}>{label}</h3>
      <p className={`text-2xl font-bold text-${color}`}>{value}</p>
    </div>
  </div>
);

export default RiderEarningsDashboard;
