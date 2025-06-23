import React from 'react';
import {
  FaTruckMoving,
  FaGlobeAsia,
  FaBoxOpen,
  FaMoneyBillWave,
  FaWarehouse,
  FaUndoAlt,
} from 'react-icons/fa';

const services = [
  {
    icon: <FaTruckMoving />,
    title: "Express & Standard Delivery",
    description:
      "We deliver parcels within 24–72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery available in Dhaka within 4–6 hours from pick-up to drop-off.",
  },
  {
    icon: <FaGlobeAsia />,
    title: "Nationwide Delivery",
    description:
      "We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48–72 hours.",
  },
  {
    icon: <FaBoxOpen />,
    title: "Fulfillment Solution",
    description:
      "We also offer customized service with inventory management support, online order processing, packaging, and after sales support.",
  },
  {
    icon: <FaMoneyBillWave />,
    title: "Cash on Home Delivery",
    description:
      "100% cash on delivery anywhere in Bangladesh with guaranteed safety of your product.",
  },
  {
    icon: <FaWarehouse />,
    title: "Corporate Service / Contract In Logistics",
    description:
      "Customized corporate services which includes warehouse and inventory management support.",
  },
  {
    icon: <FaUndoAlt />,
    title: "Parcel Return",
    description:
      "Through our reverse logistics facility we allow end customers to return or exchange their products with online business merchants.",
  },
];

const OurServices = () => {
  return (
    <section className="py-16 bg-[#03373D] text-white rounded-3xl my-8 dark:text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-2">Our Services</h2>
          <p className="text-lg text-gray-200 dark:text-gray-300">
            Comprehensive delivery and logistics solutions tailored for industrial use.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              data-aos="flip-up"
              data-aos-delay={index * 100}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 
                         transition-colors duration-300
                         hover:bg-[#CAEB66] dark:hover:bg-green-800"
            >
              <div className="flex justify-center mb-4">
                 <div
                  className="p-4 rounded-full bg-gradient-to-br from-[#EEEDFC] to-[#EEEDFC00]
                 dark:bg-gradient-to-br dark:from-[#EEEDFC] dark:to-[#EEEDFC]
"
                  
                >
                  <div className="text-3xl text-primary dark:text-[[#03373D] rounded-full p-2">
                    {service.icon}
                  </div>
                </div>
              </div>
              <h3 className="text-xl text-[#03373D] dark:text-white font-semibold text-center mb-2">{service.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServices;

