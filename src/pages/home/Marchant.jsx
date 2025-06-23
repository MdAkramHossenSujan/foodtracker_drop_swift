import React from "react";
import bgImage from "../../assets/be-a-merchant-bg.png";
import locationImg from "../../assets/location-merchant.png";

const MerchantSection = () => {
  return (
    <section data-aos='zoom-in-up'
      className="rounded-3xl relative bg-[#03373D] py-12 lg:py-24 px-6 md:px-12 my-8 text-white"
    >
      <div className="max-w-7xl  mx-auto flex flex-col md:flex-row items-center justify-between gap-10 md:gap-0">
        
        <div className="md:w-1/2">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Merchant and Customer Satisfaction is Our First Priority
          </h2>
          <p className="text-sm md:text-base text-gray-200 mb-6">
            We offer the lowest delivery charge with the highest value along with 100% safety of your product. DropSwift Courier delivers your parcels in every corner of Bangladesh right on time.
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="bg-[#CAEB66] text-[#03373D] font-semibold btn border-none btn-sm lg:btn-lg rounded-full hover:brightness-110 transition-all">
              Become a Merchant
            </button>
            <button className="border border-[#CAEB66] text-white btn btn-sm lg:btn-lg bg-[#03373D] rounded-full hover:bg-[#CAEB66] hover:text-[#03373D] transition-all">
              Earn with DropSwift
            </button>
          </div>
        </div>

        {/* Right image */}
        <div className="lg:w-1/2 flex justify-center md:justify-end">
          <img
            src={locationImg}
            alt="Location"
            className="w-64 md:w-76 lg:w-100 object-contain"
          />
        </div>
        <div>
            <img className="absolute top-0 left-0" src={bgImage} alt="" />
        </div>
      </div>
    </section>
  );
};

export default MerchantSection;
