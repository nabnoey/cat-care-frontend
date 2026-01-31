import { useState, useEffect } from "react";
import { bookingService } from "../../services/booking.service";
import type { Booking } from "../../types";
import Swal from "sweetalert2";

const AdminDashboard = () => {
  const [notifications, setNotifications] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [notifRes, allRes] = await Promise.all([
        bookingService.getNotifications(),
        bookingService.getAllBookings()
      ]);
      setNotifications(notifRes.data);
      setAllBookings(allRes.data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (id: string, status: 'confirmed' | 'rejected') => {
    let adminMessage = "";
    
    if (status === 'rejected') {
      const { value: text } = await Swal.fire({
        input: 'textarea',
        inputLabel: 'เหตุผลที่ปฏิเสธ',
        inputPlaceholder: 'กรุณาระบุเหตุผล...',
        inputAttributes: { 'aria-label': 'Type your message here' },
        showCancelButton: true
      });
      if (!text) return; 
      adminMessage = text;
    }

    try {
      await bookingService.updateBookingStatus(id, status, adminMessage);
      Swal.fire('Success', `สถานะถูกเปลี่ยนเป็น ${status}`, 'success');
      fetchData();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'เกิดข้อผิดพลาดในการอัปเดตสถานะ', 'error');
    }
  };

  if (loading) return <div className="text-center mt-10"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

  return (
    <div className="container mx-auto p-6 font-roboto">
      <h1 className="text-4xl font-bold font-pacifico text-primary mb-8">Admin Dashboard</h1>

 
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          🔔 รายการจองใหม่ (Pending) 
          <span className="badge badge-secondary">{notifications.length}</span>
        </h2>
        <div className="grid gap-4">
          {notifications.length === 0 ? <p className="text-gray-500">ไม่มีรายการจองใหม่</p> : 
            notifications.map(booking => (
              <div key={booking._id} className="card bg-base-100 shadow-md border-l-4 border-warning">
                <div className="card-body flex-row justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">{booking.service?.name}</h3>
                    <p>ลูกค้า: {typeof booking.owner === 'string' ? booking.owner : booking.owner.username} | แมว: {booking.cat?.name}</p>
                    <p>วันที่: {new Date(booking.bookingDate).toLocaleString('th-TH')}</p>
                    <p>เบอร์:{typeof booking.owner !== 'string' && booking.owner.phoneNumber}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleStatusUpdate(booking._id, 'confirmed')} className="btn btn-success text-white btn-sm">อนุมัติ</button>
                    <button onClick={() => handleStatusUpdate(booking._id, 'rejected')} className="btn btn-error text-white btn-sm">ปฏิเสธ</button>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>

     
      <div>
        <h2 className="text-2xl font-bold mb-4">📋 รายการจองทั้งหมด</h2>
        <div className="overflow-x-auto">
          <table className="table bg-base-100 shadow-xl rounded-xl">
            <thead>
              <tr>
                <th>วันที่</th>
                <th>บริการ</th>
                <th>ลูกค้า</th>
                <th>สถานะ</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {allBookings.map(booking => (
                <tr key={booking._id}>
                  <td>{new Date(booking.bookingDate).toLocaleString('th-TH')}</td>
                  <td>{booking.service?.name}</td>
                  <td>{typeof booking.owner === 'string' ? booking.owner : booking.owner.username}</td>
                  <td>
                    <span className={`badge ${
                      booking.status === 'confirmed' ? 'badge-success text-white' : 
                      booking.status === 'rejected' ? 'badge-error text-white' : 
                      booking.status === 'cancelled' ? 'badge-ghost' : 'badge-warning'
                    }`}>{booking.status}</span>
                  </td>
                  <td>
                    {booking.status === 'pending' && (
                      <div className="flex gap-1">
                        <button onClick={() => handleStatusUpdate(booking._id, 'confirmed')} className="btn btn-xs btn-success text-white">✓</button>
                        <button onClick={() => handleStatusUpdate(booking._id, 'rejected')} className="btn btn-xs btn-error text-white">✕</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;