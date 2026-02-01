import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { serviceService } from "../services/service.service";
import type { Service } from "../types";
import { UserContext } from "../contexts/UserContext";

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isAuthenticated, role } = useContext(UserContext)!;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    serviceService
      .getService(id)
      .then((res) => {
        setService(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching service:", err);
        setError("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleBooking = () => {
   if (!isAuthenticated) {
    navigate("/login", {
      state: { from: `/services/${service?._id}` },
    });
    return;
  }

  navigate(`/booking/${service?._id}`);
};

  if (loading) {
    return (
      <div className="text-center mt-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20">
        <p className="text-error text-xl mb-4">{error}</p>
        <button
          onClick={() => navigate("/services")}
          className="btn btn-primary"
        >
          กลับไปหน้ารายการ
        </button>
      </div>
    );
  }

  if (!service) {
    return <div className="text-center mt-20">ไม่พบข้อมูลบริการ</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 font-roboto max-w-4xl">
      <button
        onClick={() => navigate(-1)}
        className="btn btn-ghost mb-4 text-slate-500 hover:text-teal-600"
      >
        &larr; ย้อนกลับ
      </button>

      <div className="card lg:card-side bg-white/80 backdrop-blur-md shadow-xl border border-white/50 overflow-hidden">
        <figure className="lg:w-1/2 h-64 lg:h-[450px]">
          <img
            src={
              service.imageUrl
                ? service.imageUrl.startsWith("http")
                  ? service.imageUrl
                  : `${import.meta.env.VITE_BASE_URL}${service.imageUrl}`
                : "https://placehold.co/800x600?text=Service"
            }
            alt={service.name}
            className="w-full h-full object-cover"
          />
        </figure>

        <div className="card-body lg:w-1/2 p-6 lg:p-8">
          <h2 className="text-3xl lg:text-4xl font-bold font-pacifico text-slate-800 mb-2">
            {service.name}
          </h2>

          <div className="badge bg-teal-100 text-teal-700 border-none p-3 mb-4 self-start">
            {service.type || "General"}
          </div>

          <p className="text-slate-600 leading-relaxed mb-6">
            {service.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
            <div className="text-center sm:text-left">
              <span className="text-slate-400 block text-xs uppercase tracking-wider font-semibold">
                ราคาเริ่มต้น
              </span>
              <span className="text-3xl font-bold text-teal-600 font-pacifico">
                {service.price ? `฿${service.price}` : "สอบถามราคา"}
              </span>
            </div>

            {role !== "admin" && (
              <button
                onClick={handleBooking}
                className="btn bg-rose-400 hover:bg-rose-500 border-none text-white rounded-full px-8 shadow-lg shadow-rose-200 w-full sm:w-auto"
              >
                จองบริการนี้
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
