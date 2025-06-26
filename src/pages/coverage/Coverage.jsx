import React, { useState, useMemo, useRef } from "react";
import { useLoaderData } from "react-router";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaSearch } from "react-icons/fa";

// Fix Leaflet's default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

const Coverage = () => {
  const serviceData = useLoaderData();
  const mapRef = useRef(); // Map reference
  const inputRef = useRef(); // Input reference
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDistricts = useMemo(() => {
    if (!searchTerm) return serviceData;
    const lower = searchTerm.toLowerCase();
    return serviceData.filter(
      (district) =>
        district.district.toLowerCase().includes(lower) ||
        district.city.toLowerCase().includes(lower) ||
        district.region.toLowerCase().includes(lower)
    );
  }, [searchTerm, serviceData]);

  const handleSearch = (e) => {
    e.preventDefault(); // prevent page reload
    if (inputRef.current) {
      const term = inputRef.current.value;
      setSearchTerm(term);

      const match = serviceData.find(
        (district) =>
          district.district.toLowerCase().includes(term.toLowerCase()) ||
          district.city.toLowerCase().includes(term.toLowerCase()) ||
          district.region.toLowerCase().includes(term.toLowerCase())
      );

      if (match && mapRef.current) {
        mapRef.current.setView([match.latitude, match.longitude], 12);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-700 p-12 lg:p-20 rounded-2xl my-12">
      <p className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6">
        We are available in 64 districts
      </p>

      {/* Search Form */}
      <form
        className="form-control w-full max-w-md"
        onSubmit={handleSearch}
      >
        <div className="flex rounded-full">
          <input
            type="text"
            placeholder={`Search district, city, or region...`}
            ref={inputRef}
            onClick={handleSearch}
            className="input rounded-l-3xl input-bordered w-full"
          />
          <button type="submit" className="btn bg-lime-400 hover:bg-lime-500 rounded-r-3xl text-black">
            Search
          </button>
        </div>
      </form>
<p className="lg:text-3xl text-2xl font-extrabold py-6">We deliver almost all over Bangladesh</p>

      {/* Map */}
      <div className="h-[500px]  mt-6">
        <MapContainer
          center={[23.685, 90.356]}
          zoom={7}
          scrollWheelZoom={true}
          className="h-full w-full rounded-2xl"
          whenCreated={(mapInstance) => {
            mapRef.current = mapInstance;
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredDistricts.map((district, index) => (
            <Marker
              key={index}
              position={[district.latitude, district.longitude]}
            >
              <Popup>
                <div>
                  <h2 className="font-bold text-lg">{district.district}</h2>
                  <p><strong>Region:</strong> {district.region}</p>
                  <p><strong>City:</strong> {district.city}</p>
                  <p><strong>Status:</strong> {district.status}</p>
                  <p><strong>Covered Areas:</strong></p>
                  <p>
                    <strong>Coordinates:</strong>{" "}
                    {district.latitude.toFixed(4)}, {district.longitude.toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Coverage;



