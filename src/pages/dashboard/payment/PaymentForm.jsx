import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import React, { use, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import useSecureAxios from '../../../hooks/useSecureAxios';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';
import useTrackingLogger from '../../../hooks/useTrackingLogger';

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState()
    const { id } = useParams()
    const axiosSecure = useSecureAxios()
    const { theme, user } = useAuth()
    const navigate = useNavigate();
    const { logTracking } = useTrackingLogger()
    console.log(id)
    const { isPending, data: parcelInfo = {} } = useQuery({
        queryKey: ['parcels', id],
        queryFn: async (e) => {
            const res = await axiosSecure.get(`/parcels/${id}`)
            return res.data;
        }
    })
    if (isPending) {
        return <p>Loading........</p>
    }
    console.log(parcelInfo)
    const costAmount = parcelInfo.cost;
    const amountInCent = costAmount * 100;
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) {
            return
        }
        const card = elements.getElement(CardElement)
        if (!card) {
            return
        }
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card
        })
        if (error) {
            setError(error.message)
            console.log('error', error)
        }
        else {
            setError('')
            console.log('Payment method', paymentMethod)
        }
        //Payment Intent
        const res = await axiosSecure.post('/create-payment-intent', {
            amountInCent,
            id
        })
        const clientSecret = res.data.clientSecret
        console.log(res)
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: user.displayName,
                    email: user.email
                },
            },
        });
        if (result.error) {
            setError(result.error.message);

        }
        else {
            setError('')
            if (result.paymentIntent.status === 'succeeded') {
                console.log('Payment Succeeded!')
                console.log(result)
                //Create payment history api
                const paymentData = {
                    parcelId: id,
                    email: user.email,
                    amount: amountInCent,
                    paymentMethod: result.paymentIntent.payment_method_types[0],
                    transactionId: result.paymentIntent.id,

                }
                const paymentRes = await axiosSecure.post('payments', paymentData);
                if (paymentRes.data.insertedId) {

                    Swal.fire({
                        icon: 'success',
                        title: 'Payment Successful!',
                        html: `
        <p><strong>Transaction ID:</strong> ${result.paymentIntent.id}</p>
        <p><strong>Amount:</strong> $${(amountInCent / 100).toFixed(2)}</p>
        <p><strong>Payment Method:</strong> ${result.paymentIntent.payment_method_types[0]}</p>
      `,
                        confirmButtonText: 'Go to My Parcels',
                        confirmButtonColor: '#22c55e', // Tailwind green-500
                    }).then(async () => {

                        await logTracking({
                            tracking_id: parcelInfo.tracking_id,
                            status: 'Parcel Expense Paid',
                            details: `Paid by ${user.displayName}`,
                            location: parcelInfo.receiverRegion,
                            updated_by: user.email
                        })
                        navigate('/dashboard/myParcels');
                    });
                }
            }
        }

    }
    return (
        <div >
            <form
                onSubmit={handleSubmit}
                className="max-w-md mx-auto bg-base-100 p-6   rounded-lg shadow-lg space-y-4"
            >
                <div className="border border-gray-300  dark:border-gray-700 p-4 rounded">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    color: theme ? '#ffffff' : '#1a202c',
                                    '::placeholder': {
                                        color: theme ? '#cccccc' : '#718096',
                                    },
                                },
                                invalid: {
                                    color: '#ff4d4f',
                                },
                            },
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={!stripe}
                    className="btn btn-accent w-full"
                >
                    Pay ${costAmount}
                </button>
                {
                    error && <p className='text-red-500 text-sm'>{error}</p>
                }
            </form>


        </div>
    );
};

export default PaymentForm;