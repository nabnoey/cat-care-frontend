import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { catService } from "../../services/cat.service";
import { serviceService } from "../../services/service.service";
import { bookingService } from "../../services/booking.service";
import type { Cat, Service } from "../../types";
import axios from "axios";
import Swal from "sweetalert2";

const Booking = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const [cats, setCats] = useState<Cat[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCat, setSelectedCat] = useState("");
  const [selectedService, setSelectedService] = useState(serviceId || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, servicesRes] = await Promise.all([
          catService.getCats(),
          serviceService.getServices(),
        ]);
        setCats(catsRes.data);
        setServices(servicesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (serviceId) {
      setSelectedService(serviceId);
    }
  }, [serviceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCat || !selectedService || !date || !time) {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
    }

    const bookingDate = `${date}T${time}`;
    const selectedDate = new Date(bookingDate);
    const hours = selectedDate.getHours();
    const minutes = selectedDate.getMinutes();

    if (hours < 9 || hours > 17 || (hours === 17 && minutes > 0)) {
      Swal.fire({
        icon: 'warning',
        title: 'อยู่นอกเวลาทำการ',
        text: 'กรุณาเลือกเวลาจองระหว่าง 09:00 - 17:00 น.',
      });
      return;
    }

    try {
      await bookingService.createBooking({
        catId: selectedCat,
        serviceId: selectedService,
        bookingDate,
      });
      
      await Swal.fire({
        icon: "success",
        title: "จองบริการสำเร็จ!",
        text: "การจองของคุณถูกบันทึกเรียบร้อยแล้ว",
        confirmButtonText: "ตกลง"
      });
      navigate("/my-bookings");
      
    } catch (error: unknown) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        Swal.fire({
          icon: 'warning',
          title: 'คิวเต็ม!',
          text: error.response.data.message || 'ขออภัย วันนี้คิวเต็มแล้ว กรุณาเลือกวันอื่น',
        });
      } else {
        alert("การจองล้มเหลว โปรดลองอีกครั้ง");
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-10"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4 font-roboto">
      <div className="card w-full max-w-2xl bg-base-100 shadow-xl border border-base-200">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center mb-6 font-pacifico text-primary">
            📝 จองคิวบริการ
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-lg">เลือกน้องแมวของคุณ</span>
              </label>
              <select
                className="select select-bordered w-full text-base"
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                required
              >
                <option value="">-- กรุณาเลือกแมว --</option>
                {cats.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    🐱 {cat.name} (อายุ {cat.ageYears} ปี {cat.ageMonths} เดือน)
                  </option>
                ))}
              </select>
              {cats.length === 0 && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    คุณยังไม่มีข้อมูลแมว <a href="/cats/add" className="link link-primary font-bold underline">เพิ่มแมวที่นี่</a>
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-lg">เลือกบริการ</span>
              </label>
              <select
                className="select select-bordered w-full text-base"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                required
              >
                <option value="">-- กรุณาเลือกบริการ --</option>
                {services.map((service) => (
                  <option key={service._id} value={service._id}>
                    ✨ {service.name} {service.price ? `(${service.price} บาท)` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-lg">วันที่ต้องการจอง</span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full text-base"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-lg">เวลาที่ต้องการ (09:00 - 17:00)</span>
              </label>
              <select className="select select-bordered w-full text-base" value={time} onChange={(e) => setTime(e.target.value)} required>
                <option value="">-- เลือกเวลา --</option>
                {["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"].map((t) => (
                  <option key={t} value={t}>{t} น.</option>
                ))}
              </select>
            </div>

            <div className="form-control mt-6">
              <button 
                type="submit" 
                className="btn btn-primary w-full text-white rounded-full text-lg shadow-md hover:shadow-lg transition-all"
                disabled={cats.length === 0}
              >
                ยืนยันการจอง
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;