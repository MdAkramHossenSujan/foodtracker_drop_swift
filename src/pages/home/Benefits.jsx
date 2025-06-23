import React from "react";

import trackingImg from "../../assets/live-tracking.png";
import safeDeliveryImg from "../../assets/big-deliveryman.png";
import callSupportImg from "../../assets/safe-delivery.png"; // Update this to correct call support image if needed

const benefitsData = [
  {
    title: "Live Parcel Tracking",
    description:
      "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment’s journey and get instant status updates for complete peace of mind.",
    image: trackingImg,
  },
  {
    title: "100% Safe Delivery",
    description:
      "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
    image: safeDeliveryImg,
  },
  {
    title: "24/7 Call Center Support",
    description:
      "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
    image: callSupportImg,
  },
];

const Benefits = () => {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        {benefitsData.map((benefit, index) => (
          <div
            key={index}
            data-aos="fade-up"
            data-aos-delay={index * 100}
            className="flex flex-col border-1 border-green-900 dark:border-gray-300 md:flex-row items-center bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden transition-all duration-300"
          >
            <div className="px-16 py-8 flex justify-center">
              <img
                src={benefit.image}
                alt={benefit.title}
                className="border-b-2 md:border-0 pb-8 md:pb-0 border-dashed border-[#03464D] dark:border-[#4FA9B0] object-contain max-h-52"
              />
            </div>

            <div className="md:w-2/3 md:border-l-2 border-dashed border-[#03464D] dark:border-[#4FA9B0] pl-12 pr-4 md:py-6 pb-6 md:pb-0">
              <h3 className="text-xl md:text-2xl font-bold text-[#03373D] dark:text-white mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Benefits;

