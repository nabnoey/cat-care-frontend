import { useState, useEffect } from "react";
import { serviceService } from "../services/service.service";
import ServiceCard from "../components/ServiceCard";

const Services = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await serviceService.getServices();
        console.log("FULL RESPONSE", res);
console.log("DATA", res.data);
        setServices(res.data?.services ?? []);
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // 👇 ใช้ loading ตรงนี้
  if (loading) {
    return (
      <div className="text-center py-20 text-slate-500">
        กำลังโหลดบริการ...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 font-roboto">
      <h1 className="text-4xl font-bold text-center mb-12 font-pacifico text-slate-800">
        <span className="border-b-4 border-teal-200 px-4">บริการของเรา</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.length > 0 ? (
          services.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            ไม่พบบริการ
          </p>
        )}
      </div>
    </div>
  );
};

export default Services;
