import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FaUser, FaPhone } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import dayjs from 'dayjs';
import { useLoaderData, useNavigate } from 'react-router';
import useAuth from '../../hooks/useAuth';
import { v4 as uuidv4 } from 'uuid';
import useSecureAxios from '../../hooks/useSecureAxios';
import useTrackingLogger from '../../hooks/useTrackingLogger';

const MySwal = withReactContent(Swal);

const SendParcel = () => {
  const serviceData = useLoaderData();
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const navigate=useNavigate()
const {user}=useAuth()
const axiosSecure=useSecureAxios()
const {logTracking}=useTrackingLogger()
  const senderRegion = watch('senderRegion');
  const receiverRegion = watch('receiverRegion');
const generatedTrackingID = () => {
  return `PKG-${uuidv4().slice(0, 8).toUpperCase()}`;
};
  const getDistricts = region =>
    serviceData.find(item => item.region === region)?.covered_area || [];

  const calculateCost = (data) => {
    const weight = parseFloat(data.weight || 0);
    const sameDistrict = data.senderService === data.receiverService;

    let baseCost = 0;
    let weightSurcharge = 0;
    let distanceSurcharge = 0;

    if (data.type === 'document') {
      baseCost = sameDistrict ? 60 : 80;
    } else {
      baseCost = sameDistrict ? 110 : 150;
      if (weight > 3) {
        weightSurcharge = (weight - 3) * 40;
      }
      if (!sameDistrict) {
        distanceSurcharge = 40;
      }
    }

    const totalCost = baseCost + weightSurcharge + distanceSurcharge;

    return {
      baseCost,
      weightSurcharge,
      distanceSurcharge,
      totalCost,
    };
  };

  const onSubmit = (data) => {
    const { baseCost, weightSurcharge, distanceSurcharge, totalCost } = calculateCost(data);
    const weight = parseFloat(data.weight || 0);

    const costBreakdownLines = [
      `Base Cost: ৳${baseCost}`,
      weightSurcharge > 0 ? `Weight Surcharge: ৳${weightSurcharge}` : null,
      distanceSurcharge > 0 ? `Inter-District Charge: ৳${distanceSurcharge}` : null,
    ].filter(Boolean);

    const htmlContent = `
      <div style="text-align:left; font-family: Arial, sans-serif; line-height: 1.5;">
        <div style="margin-bottom: 1rem;">
          <h3 style="color:#22c55e; margin-bottom: 0.3rem;">Delivery Cost</h3>
          <p style="font-weight:bold; font-size:1.1rem; margin: 0 0 0.5rem 0;">৳${totalCost}</p>
          <div style="background:#f9f9f9; padding: 0.6rem 1rem; border-radius: 6px; font-size: 0.9rem;">
            ${costBreakdownLines.map(line => `<div>• ${line}</div>`).join('')}
          </div>
        </div>

        <div style="margin-bottom: 1rem;">
          <h3 style="color:#22c55e; margin-bottom: 0.3rem;">Sender Info</h3>
          <ul style="list-style:none; padding-left:0; margin: 0; font-size: 0.9rem;">
            <li><strong>Name:</strong> ${data.senderName}</li>
            <li><strong>Contact:</strong> ${data.senderContact}</li>
            <li><strong>Region:</strong> ${data.senderRegion}</li>
            <li><strong>Service Center:</strong> ${data.senderService}</li>
          </ul>
        </div>

        <div style="margin-bottom: 1rem;">
          <h3 style="color:#22c55e; margin-bottom: 0.3rem;">Receiver Info</h3>
          <ul style="list-style:none; padding-left:0; margin: 0; font-size: 0.9rem;">
            <li><strong>Name:</strong> ${data.receiverName}</li>
            <li><strong>Contact:</strong> ${data.receiverContact}</li>
            <li><strong>Region:</strong> ${data.receiverRegion}</li>
            <li><strong>Service Center:</strong> ${data.receiverService}</li>

          </ul>
        </div>

        <div style="margin-bottom: 1rem;">
          <h3 style="color:#22c55e; margin-bottom: 0.3rem;">Parcel Info</h3>
          <ul style="list-style:none; padding-left:0; margin: 0; font-size: 0.9rem;">
            <li><strong>Type:</strong> ${data.type}</li>
            <li><strong>Title:</strong> ${data.title}</li>
            <li><strong>Weight:</strong> ${weight} kg</li>
          </ul>
        </div>

        <p style="font-weight: 600; margin-top: 1rem;">Do you want to confirm and submit?</p>
      </div>
    `;

    MySwal.fire({
      title: 'Confirm Parcel Submission',
      html: htmlContent,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      width: '600px',
      customClass: {
        popup: 'swal2-shadow-lg swal2-border-radius-lg',
      }
    }).then(result => {
      if (result.isConfirmed) {
        const newParcel = {
          ...data,
          cost: totalCost,
          createdBy:user.email,
          delivery_status:'not-collected',
          payment_status:'unPaid',
          tracking_id:generatedTrackingID(),
          creation_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        };
        console.log('Parcel Saved:', newParcel);
        axiosSecure.post('parcels',newParcel)
        .then(async(res)=>{
          console.log(res.data)
         await logTracking({
            tracking_id:newParcel.tracking_id,
            status:'Parcel Submitted',
            details:`Created by ${user.displayName}`,
            location:newParcel.receiverRegion,
            updated_by:user.email
          })

          navigate('/dashboard/myParcels')
        })
        reset();
        MySwal.fire('Submitted!', 'Your parcel has been submitted.', 'success');
      }
    });
  };

  return (
    <div className="p-6 md:p-8 lg:p-12 xl:p-16 max-w-7xl mx-auto bg-base-100 shadow-xl rounded-2xl">
      <h1 className="text-3xl lg:text-5xl font-bold mb-1 text-start">Add Parcel</h1>
      <p className="text-start text-base-content mb-6">Enter your parcel details</p>
      <hr className="my-6 border-base-300" />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

        {/* Parcel Info */}
        <div>
          <h2 className="text-xl font-semibold mb-2">📦 Parcel Info</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Type */}
            <div>
              <label className="label">Type</label>
              <select {...register('type', { required: true })} className="select select-bordered w-full">
                <option value="document">Document</option>
                <option value="non-document">Non-Document</option>
              </select>
              {errors.type && <span className="text-error text-sm">Type is required</span>}
            </div>

            {/* Title */}
            <div>
              <label className="label">Parcel name</label>
              <input {...register('title', { required: true })} type="text" className="input input-bordered w-full" />
              {errors.title && <span className="text-error text-sm">Title is required</span>}
            </div>

            {/* Weight */}
            <div>
              <label className="label">Weight (kg)</label>
              <input
                {...register('weight', { required: true, min: 0 })}
                type="number"
                step="0.01"
                min={0}
                className="input input-bordered w-full"
              />
              {errors.weight && <span className="text-error text-sm">Weight is required</span>}
            </div>
          </div>
          <hr className="my-6 border-base-300" />
        </div>

        {/* Sender & Receiver Info */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sender Info */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Sender Info</h2>
            <div className="space-y-4">
              <label className="label font-bold"><FaUser className="inline mr-2" /> Sender Name</label>
              <input {...register('senderName', { required: true })} placeholder="Sender Name" className="input input-bordered w-full" />
              <label className="label font-bold"><FaPhone className="inline mr-2" /> Sender Contact</label>
              <input {...register('senderContact', { required: true })} placeholder="Contact Number" className="input input-bordered w-full" />
              <label className="label font-bold"><MdLocationOn className="inline mr-2" /> Sender Region</label>
              <select {...register('senderRegion', { required: true })} className="select select-bordered w-full">
                <option value="">Select Region</option>
                {serviceData.map((item, idx) => <option key={idx} value={item.region}>{item.region}</option>)}
              </select>
              <label className="label font-bold">Sender Service Center</label>
              <select {...register('senderService', { required: true })} className="select select-bordered w-full">
                <option value="">Select Service Center</option>
                {getDistricts(senderRegion).map((dist, idx) => <option key={idx} value={dist}>{dist}</option>)}
              </select>
              <label className="label font-bold">Sender Address</label>
              <input {...register('senderAddress', { required: true })} placeholder="Pickup Address" className="input input-bordered w-full" />
              <label className="label font-bold">Pickup Instructions</label>
              <textarea {...register('senderInstruction')} placeholder="Provide any pickup instructions here..." className="textarea textarea-bordered w-full" rows="3" />
            </div>
          </div>

          {/* Receiver Info */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Receiver Info</h2>
            <div className="space-y-4">
              <label className="label font-bold"><FaUser className="inline mr-2" /> Receiver Name</label>
              <input {...register('receiverName', { required: true })} placeholder="Receiver Name" className="input input-bordered w-full" />
              <label className="label font-bold"><FaPhone className="inline mr-2" /> Receiver Contact</label>
              <input {...register('receiverContact', { required: true })} placeholder="Contact Number" className="input input-bordered w-full" />
              <label className="label font-bold"><MdLocationOn className="inline mr-2" /> Receiver Region</label>
              <select {...register('receiverRegion', { required: true })} className="select select-bordered w-full">
                <option value="">Select Region</option>
                {serviceData.map((item, idx) => <option key={idx} value={item.region}>{item.region}</option>)}
              </select>
              <label className="label font-bold">Receiver Service Center</label>
              <select {...register('receiverService', { required: true })} className="select select-bordered w-full">
                <option value="">Select Service Center</option>
                {getDistricts(receiverRegion).map((dist, idx) => <option key={idx} value={dist}>{dist}</option>)}
              </select>
              <label className="label font-bold">Delivery Address</label>
              <input {...register('receiverAddress', { required: true })} placeholder="Delivery Address" className="input input-bordered w-full" />
              <label className="label font-bold">Delivery Instructions</label>
              <textarea {...register('receiverInstruction')} placeholder="Provide any delivery instructions here..." className="textarea textarea-bordered w-full" rows="3" />
            </div>
          </div>
        </div>

        <hr className="my-6 border-base-300" />

        <div className="text-center">
          <button type="submit" className="btn bg-lime-500 hover:bg-lime-600 text-white">Submit Parcel</button>
        </div>
      </form>
    </div>
  );
};

export default SendParcel;








