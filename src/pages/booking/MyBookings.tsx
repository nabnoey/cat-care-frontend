import { useState, useEffect } from "react";
import { bookingService } from "../../services/booking.service";
import type { Booking } from "../../types";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaPhone } from "react-icons/fa";

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await bookingService.getMyBookings();
      setBookings(res.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id: string) => {
    const result = await Swal.fire({
      title: 'ยืนยันการยกเลิก?',
      text: "คุณต้องการยกเลิกการจองนี้ใช่หรือไม่",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ยกเลิกเลย',
      cancelButtonText: 'ไม่'
    });

    if (result.isConfirmed) {
      try {
        await bookingService.cancelBooking(id);
        Swal.fire('ยกเลิกสำเร็จ', 'การจองถูกยกเลิกแล้ว', 'success');
        fetchBookings(); // Reload data
      } catch (error) {
        console.error(error);
        Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถยกเลิกได้', 'error');
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-10"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  }

  return (
    <div className="container mx-auto mt-10 font-roboto px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold font-pacifico text-primary mb-2">การจองของฉัน</h2>
        <div className="flex justify-center items-center gap-2 text-gray-600 bg-white/50 py-2 px-4 rounded-full inline-flex backdrop-blur-sm shadow-sm border border-white/50">
            <span>มีข้อสงสัย? ติดต่อเรา:</span>
            <a href="tel:099-999-9999" className="flex items-center gap-1 text-teal-600 font-bold hover:underline">
                <FaPhone className="text-sm" /> 099-999-9999
            </a>
        </div>
      </div>
      <div className="grid gap-4 max-w-3xl mx-auto">
        {bookings.length === 0 ? (
            <div className="text-center py-10 bg-base-100 rounded-xl shadow-sm border border-base-200">
                <p className="text-gray-500 text-lg">คุณยังไม่มีรายการจอง</p>
                <Link to="/services" className="btn btn-primary btn-sm mt-4 text-white rounded-full">จองบริการเลย</Link>
            </div>
        ) : (
            bookings.map((booking) => (
            <div key={booking._id} className="card bg-base-100 shadow-md border border-base-200 hover:shadow-lg transition-all">
                <div className="card-body">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h3 className="card-title text-secondary text-xl mb-2">
                                {booking.service?.name || "ไม่ระบุบริการ"}
                            </h3>
                            <div className="space-y-1">
                                <p className="text-gray-600 flex items-center gap-2">
                                    <span className="font-semibold">🐱 น้องแมว:</span> 
                                    {booking.cat?.name || "ไม่ระบุ"}
                                </p>
                                <p className="text-gray-600 flex items-center gap-2">
                                    <span className="font-semibold">📅 วันที่:</span> 
                                    {new Date(booking.bookingDate).toLocaleString('th-TH', {
                                        dateStyle: 'medium',
                                        timeStyle: 'short'
                                    })}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <div className={`badge ${booking.status === 'completed' ? 'badge-success text-white' : 'badge-primary badge-outline'} p-3 capitalize`}>
                                {booking.status || "รอดำเนินการ"}
                            </div>
                            {booking.status === 'pending' && (
                            <button onClick={() => handleCancel(booking._id)} className="btn btn-error btn-sm text-white">
                                ยกเลิก
                            </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default MyBookings;