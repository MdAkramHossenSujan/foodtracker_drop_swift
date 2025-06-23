import React from "react";
import step1 from "../../assets/bookingIcon.png";
import step2 from "../../assets/tiny-deliveryman.png";
import step3 from "../../assets/safe-delivery.png";
import step4 from "../../assets/authImage.png";

const steps = [
  {
    title: "Parcel Collection",
    image: step1,
    description: "Agent collects the parcel and determines if it’s within the city.",
  },
  {
    title: "Sorting & Transport",
    image: step2,
    description:
      "If not within the city, the parcel is sent to the warehouse and dispatched to the destination hub.",
  },
  {
    title: "Delivery Assignment",
    image: step3,
    description: "Once the parcel reaches the destination, admin assigns a local agent.",
  },
  {
    title: "Final Delivery",
    image: step4,
    description: "Assigned agent delivers the parcel to the customer successfully.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-[#03373D] dark:text-white">
          How It Works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 150}
              className="bg-white dark:bg-gray-900 dark:border rounded-2xl p-6 shadow-md text-center transition-all duration-300 hover:shadow-lg"
            >
              <img
                src={step.image}
                alt={step.title}
                className="mx-auto mb-4 h-24 object-contain"
              />
              <h3 className="text-xl font-semibold mb-2 text-[#03373D] dark:text-white">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
