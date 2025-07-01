import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import RiderImage from "../../assets/agent-pending.png";
import { FaArrowRight } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

const BeaRider = () => {
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    resetField,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.displayName || "",
      email: user?.email || "",
      region: "",
      district: "",
      city: "",
      warehouse: "",
      phone: "",
      nid: "",
      vehicleType: "",
      vehicleNumber: "",
    },
  });

  const [warehouseData, setWarehouseData] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);

  // Load warehouses.json on mount
  useEffect(() => {
    fetch("/warehouses.json")
      .then((res) => res.json())
      .then((data) => {
        setWarehouseData(data);
      });
  }, []);

  // Watch form values
  const selectedRegion = watch("region");
  const selectedDistrict = watch("district");

  // When region changes, update districts
  useEffect(() => {
    if (selectedRegion) {
      const filteredDistricts = warehouseData
        .filter((item) => item.region === selectedRegion)
        .map((item) => item.district);
      setDistricts([...new Set(filteredDistricts)]);
      resetField("district");
      resetField("city");
    }
  }, [selectedRegion, warehouseData, resetField]);

  // When district changes, update cities
  useEffect(() => {
    if (selectedDistrict) {
      const filteredCities = warehouseData
        .filter((item) => item.district === selectedDistrict)
        .map((item) => item.city);
      setCities([...new Set(filteredCities)]);
      resetField("city");
    }
  }, [selectedDistrict, warehouseData, resetField]);

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    // handle your API call here
  };

  return (
    <div className="w-full min-h-screen rounded-3xl bg-base-100 flex flex-col md:flex-row items-center justify-center p-8 md:p-16">
      {/* Left Form */}
      <div className="md:w-1/2 w-full space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#CAEB66]">
            Be a Rider
          </h1>
          <p className="text- mt-2 max-w-md">
            Enjoy fast, reliable parcel delivery with real-time tracking and zero
            hassle. From personal packages to business shipments — we deliver on
            time, every time.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Name */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              {...register("name", { required: true })}
              type="text"
              placeholder="Your Name"
              className="input input-bordered w-full"
              disabled
            />
          </div>

          {/* Email */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              {...register("email", { required: true })}
              type="email"
              placeholder="Email Address"
              className="input input-bordered w-full"
              disabled
            />
          </div>

          {/* Phone */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Phone</span>
            </label>
            <input
              {...register("phone", { required: true })}
              type="text"
              placeholder="Phone Number"
              className="input input-bordered w-full"
            />
            {errors.phone && (
              <span className="text-error text-xs mt-1">
                Phone number is required
              </span>
            )}
          </div>

          {/* NID */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">NID Number</span>
            </label>
            <input
              {...register("nid", { required: true })}
              type="text"
              placeholder="Your NID Number"
              className="input input-bordered w-full"
            />
            {errors.nid && (
              <span className="text-error text-xs mt-1">
                NID number is required
              </span>
            )}
          </div>

          {/* Region */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Region</span>
            </label>
            <select
              {...register("region", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="">Select your region</option>
              {[...new Set(warehouseData.map((item) => item.region))].map(
                (region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                )
              )}
            </select>
            {errors.region && (
              <span className="text-error text-xs mt-1">
                Region is required
              </span>
            )}
          </div>

          {/* District */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">District</span>
            </label>
            <select
              {...register("district", { required: true })}
              className="select select-bordered w-full"
              disabled={!districts.length}
            >
              <option value="">Select your district</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
            {errors.district && (
              <span className="text-error text-xs mt-1">
                District is required
              </span>
            )}
          </div>

          {/* City */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">City</span>
            </label>
            <select
              {...register("city", { required: true })}
              className="select select-bordered w-full"
              disabled={!cities.length}
            >
              <option value="">Select your city</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {errors.city && (
              <span className="text-error text-xs mt-1">
                City is required
              </span>
            )}
          </div>

          {/* Warehouse */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Preferred Warehouse</span>
            </label>
            <select
              {...register("warehouse", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="">Select warehouse</option>
              <option value="Warehouse A">Warehouse A</option>
              <option value="Warehouse B">Warehouse B</option>
              <option value="Warehouse C">Warehouse C</option>
            </select>
            {errors.warehouse && (
              <span className="text-error text-xs mt-1">
                Warehouse is required
              </span>
            )}
          </div>

          {/* Vehicle Type */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Vehicle Type</span>
            </label>
            <select
              {...register("vehicleType", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="">Select vehicle type</option>
              <option value="Bike">Bike</option>
              <option value="Car">Car</option>
              <option value="Van">Van</option>
            </select>
            {errors.vehicleType && (
              <span className="text-error text-xs mt-1">
                Vehicle type is required
              </span>
            )}
          </div>

          {/* Vehicle Number */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Vehicle Number</span>
            </label>
            <input
              {...register("vehicleNumber", { required: true })}
              type="text"
              placeholder="Vehicle Number Plate"
              className="input input-bordered w-full"
            />
            {errors.vehicleNumber && (
              <span className="text-error text-xs mt-1">
                Vehicle number is required
              </span>
            )}
          </div>

          {/* Button */}
          <div className="col-span-1 md:col-span-2 mt-4">
            <button
              type="submit"
              className="btn bg-[#CAEB66] text-black rounded-2xl w-full flex justify-center gap-2"
            >
              Continue
              <FaArrowRight />
            </button>
          </div>
        </form>
      </div>

      {/* Right Image */}
      <div className="md:w-1/2 w-full mt-10 md:mt-0 flex justify-center">
        <img
          src={RiderImage}
          alt="Rider"
          className="max-w-xs lg:max-w-md"
        />
      </div>
    </div>
  );
};

export default BeaRider;
