import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { serviceService } from "../services/service.service";
import type { Service } from "../types";
import { UserContext } from "../contexts/UserContext";

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useContext(UserContext)!;
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      serviceService.getService(id)
        .then(res => {
          setService(res.data);
          setError(null);
        })
        .catch(err => {
          console.error("Error fetching service:", err);
          setError("ไม่สามารถโหลดข้อมูลได้ กรุณาตรวจสอบการเชื่อมต่อหรือลองใหม่อีกครั้ง");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="text-center mt-10"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  
  if (error) return (
    <div className="text-center mt-10">
      <p className="text-error text-xl mb-4">{error}</p>
      <button onClick={() => navigate("/services")} className="btn btn-primary">กลับไปหน้ารายการ</button>
    </div>
  );

  if (!service) return <div className="text-center mt-10">ไม่พบข้อมูลบริการ</div>;

  return (
    <div className="container mx-auto px-4 py-8 font-roboto max-w-4xl">
      <button onClick={() => navigate(-1)} className="btn btn-ghost mb-4 text-slate-500 hover:text-teal-600">
        &larr; ย้อนกลับ
      </button>
      <div className="card lg:card-side bg-white/80 backdrop-blur-md shadow-xl border border-white/50 overflow-hidden h-auto lg:h-[450px]">
        <figure className="lg:w-1/2 h-64 lg:h-full relative">
          <img 
            src={service.imageUrl ? (service.imageUrl.startsWith("http") ? service.imageUrl : `${import.meta.env.VITE_BASE_URL}${service.imageUrl}`) : "https://placehold.co/800x600?text=Service"} 
            alt={service.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:hidden"></div>
        </figure>
        <div className="card-body lg:w-1/2 p-6 lg:p-8">
          <h2 className="card-title text-3xl lg:text-4xl font-bold font-pacifico text-slate-800 mb-2">{service.name}</h2>
          <div className="badge bg-teal-100 text-teal-700 border-none p-3 mb-4 self-start">{service.type || 'General'}</div>
          <p className="text-slate-600 text-base leading-relaxed mb-6 overflow-y-auto">{service.description}</p>
          <div className="flex flex-col sm:flex-row items-center justify-between mt-auto gap-4">
            <div className="text-center sm:text-left">
              <span className="text-slate-400 block text-xs uppercase tracking-wider font-semibold">ราคาเริ่มต้น</span>
              <span className="text-3xl font-bold text-teal-600 font-pacifico">{service.price ? `฿${service.price}` : "สอบถามราคา"}</span>
            </div>
            {role !== 'admin' && (
              <Link to={`/booking/${service._id}`} className="btn bg-rose-400 hover:bg-rose-500 border-none text-white btn-md rounded-full px-8 shadow-lg shadow-rose-200 w-full sm:w-auto">
                จองบริการนี้
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;