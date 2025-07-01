import React from 'react';
import useAuth from '../../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import useSecureAxios from '../../../hooks/useSecureAxios';


const PaymentHIstory = () => {
    const {user}=useAuth();
    const axiosSecure=useSecureAxios()
    const {isPending,data:payments=[]}=useQuery(
        {
            queryKey:['payments',user.email],
            queryFn:async ()=>{
                const res=await axiosSecure.get(`/payments?email=${user.email}`)
                return res.data
            }
        }
    )
    if(isPending){
        return <p>Loading.....</p>
    }
    console.log(payments)
    return (
        <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        {/* table header */}
        <thead className="bg-green-100 dark:bg-green-800 text-gray-800 dark:text-gray-100">
          <tr>
            <th>Transaction ID</th>
            <th>Amount</th>
            <th>Parcel ID</th>
            <th>Paid Time</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.transactionId}>
              <td className="text-sm break-all">{payment.transactionId}</td>
              <td className="text-sm text-green-700 dark:text-green-300 font-semibold">
                ${(payment.amount / 100).toFixed(2)}
              </td>
              <td className="text-sm break-all">{payment.parcelId}</td>
              <td className="text-sm">
                {new Date(payment.paidAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    );
};

export default PaymentHIstory;