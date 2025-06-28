import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import useSecureAxios from '../../../hooks/useSecureAxios';

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState()
    const { id } = useParams()
    const axiosSecure = useSecureAxios()
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
                    // name: user.displayName,
                    // email: user.email
                },
            },
        });
        if (result.error) {
            console.log(result.error.message);

        }
        else {
            if (result.paymentIntent.status === 'succeeded') {
                console.log('Payment Succeeded!')
                console.log(result)
            }
        }
    }
    return (
        <div>
            <form
                onSubmit={handleSubmit}
                className="max-w-md mx-auto bg-base-100 p-6 rounded-lg shadow-lg space-y-4"
            >
                <div className="border border-gray-300 dark:border-gray-700 p-4 rounded">
                    <CardElement

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