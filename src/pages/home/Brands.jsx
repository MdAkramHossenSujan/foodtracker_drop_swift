import React from "react";
import Marquee from "react-fast-marquee";

// Import your brand logos from assets
import brand1 from "../../assets/brands/amazon.png";
import brand2 from "../../assets/brands/amazon_vector.png";
import brand3 from "../../assets/brands/casio.png";
import brand4 from "../../assets/brands/moonstar.png";
import brand5 from "../../assets/brands/randstad.png";
import brand6 from "../../assets/brands/start-people 1.png";
import brand7 from "../../assets/brands/start.png";

const brandLogos = [brand1, brand2, brand3, brand4, brand5, brand6, brand7];

const Brands = () => {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[#03373D] dark:text-white mb-8">
          We've helped thousands of sales teams
        </h2>
        

        <Marquee
          gradient={false}
          speed={40}
          pauseOnHover={true}
          className="flex items-center gap-8"
        >
          {brandLogos.map((logo, index) => (
            <div key={index} className="mx-6 flex items-center justify-center">
              <img
                src={logo}
                alt={`Brand ${index + 1}`}
                className="w-auto object-contain transition-all duration-300"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default Brands;
