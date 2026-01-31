import { useState, useEffect } from "react";
import { bookingService } from "../../../services/booking.service";
import type { Booking } from "../../../types";
import Swal from "sweetalert2";
import { FaPhone } from "react-icons/fa";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [historyFilter, setHistoryFilter] = useState<'confirmed' | 'rejected'>('confirmed');
  const [notifications, setNotifications] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const notifRes = await bookingService.getNotifications();
      setNotifications(notifRes.data);
      
      if (activeTab === 'history') {
        const allRes = await bookingService.getAllBookings();
        setAllBookings(allRes.data);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleStatusUpdate = async (id: string, status: 'confirmed' | 'rejected') => {
    let adminMessage = "";
    
    if (status === 'rejected') {
      const { value: reason } = await Swal.fire({
        title: 'เลือกเหตุผลที่ปฏิเสธ',
        input: 'select',
        inputOptions: {
          'full': 'วันนี้คิวเต็มแล้ว ขออภัยครับ สามารถเลือกจองได้ในวันถัดไป',
          'closed': 'วันนี้ร้านปิดทำการ',
        },
        inputPlaceholder: 'กรุณาเลือกเหตุผล',
        showCancelButton: true,
        cancelButtonText: 'ยกเลิก',
        confirmButtonText: 'ตกลง',
        inputValidator: (value) => {
          if (!value) {
            return 'กรุณาเลือกเหตุผล';
          }
        }
      });

      if (!reason) return;

      const options: Record<string, string> = {
        'full': 'วันนี้คิวเต็มแล้ว ขออภัยครับ สามารถเลือกจองได้ในวันถัดไป',
        'closed': 'วันนี้ร้านปิดทำการ',
      };
      adminMessage = options[reason];
    }

    try {
      await bookingService.updateBookingStatus(id, status, adminMessage);
      Swal.fire('สำเร็จ', `สถานะถูกเปลี่ยนเป็น ${status}`, 'success');
      fetchData();
    } catch (error) {
      console.error(error);
      Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถอัปเดตสถานะได้', 'error');
    }
  };

  if (loading && activeTab === 'pending' && notifications.length === 0) return <div className="text-center mt-10"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

  return (
    <div className="container mx-auto p-6 font-roboto">
      <h1 className="text-4xl font-bold font-pacifico text-primary mb-8">Admin Dashboard</h1>

      <div className="flex justify-center mb-8">
        <div role="tablist" className="tabs tabs-boxed bg-base-200 p-2 rounded-full">
          <a 
            role="tab" 
            className={`tab rounded-full ${activeTab === 'pending' ? 'tab-active bg-primary text-white' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            รายการใหม่ {notifications.length > 0 && <span className="badge badge-sm badge-warning ml-2">{notifications.length}</span>}
          </a>
          <a 
            role="tab" 
            className={`tab rounded-full ${activeTab === 'history' ? 'tab-active bg-primary text-white' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            ประวัติการจองทั้งหมด
          </a>
        </div>
      </div>

      {activeTab === 'pending' ? (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            🔔 รายการจองใหม่ (Pending) 
          </h2>
          <div className="grid gap-4">
            {notifications.length === 0 ? <p className="text-gray-500 text-center py-10">ไม่มีรายการจองใหม่</p> : 
              notifications.map(booking => (
                <div key={booking._id} className="card bg-base-100 shadow-md border-l-4 border-warning">
                  <div className="card-body flex-row justify-between items-center flex-wrap gap-4">
                    <div>
                      <h3 className="font-bold text-lg">{booking.service?.name}</h3>
                      <p className="flex flex-wrap items-center text-gray-600">
                        ลูกค้า: <span className="font-semibold ml-1 text-slate-800">{typeof booking.owner === 'string' ? booking.owner : booking.owner.username}</span>
                        {typeof booking.owner !== 'string' && booking.owner.phoneNumber && (
                          <a href={`tel:${booking.owner.phoneNumber}`} className="flex items-center text-sm text-teal-600 ml-2 hover:underline bg-teal-50 px-2 py-0.5 rounded-full">
                            <FaPhone className="mr-1 text-xs" /> {booking.owner.phoneNumber}
                          </a>
                        )}
                        <span className="mx-2 text-gray-300">|</span> 
                        แมว: <span className="font-semibold ml-1 text-slate-800">{booking.cat?.name}</span>
                      </p>
                      <p>วันที่: {new Date(booking.bookingDate).toLocaleString('th-TH')}</p>
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
      ) : (
        <div>
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-2xl font-bold mb-4">📋 ประวัติการจองทั้งหมด</h2>
            <div className="join">
              <button 
                className={`join-item btn ${historyFilter === 'confirmed' ? 'btn-success text-white' : 'btn-outline btn-success'}`}
                onClick={() => setHistoryFilter('confirmed')}
              >
                ✅ รายการที่อนุมัติแล้ว
              </button>
              <button 
                className={`join-item btn ${historyFilter === 'rejected' ? 'btn-error text-white' : 'btn-outline btn-error'}`}
                onClick={() => setHistoryFilter('rejected')}
              >
                ❌ รายการที่ยกเลิก/ปฏิเสธ
              </button>
            </div>
          </div>

          {loading ? (
             <div className="text-center mt-10"><span className="loading loading-spinner loading-lg text-primary"></span></div>
          ) : (
            <div className="overflow-x-auto">
              {historyFilter === 'confirmed' ? (
                <table className="table bg-base-100 shadow-xl rounded-xl">
                  <thead className="bg-base-200">
                    <tr>
                      <th>วันที่</th>
                      <th>บริการ</th>
                      <th>ลูกค้า</th>
                      <th>สถานะ</th>
                      <th>จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allBookings.filter(b => b.status === 'confirmed').length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-4">ไม่พบข้อมูล</td></tr>
                    ) : (
                      allBookings.filter(b => b.status === 'confirmed').map(booking => (
                        <tr key={booking._id}>
                          <td>{new Date(booking.bookingDate).toLocaleString('th-TH')}</td>
                          <td>{booking.service?.name}</td>
                            <td>
                              <div className="font-bold">{typeof booking.owner === 'string' ? booking.owner : booking.owner.username}</div>
                              {typeof booking.owner !== 'string' && booking.owner.phoneNumber && (
                                <a href={`tel:${booking.owner.phoneNumber}`} className="flex items-center text-xs text-gray-500 mt-1 hover:text-teal-600">
                                  <FaPhone className="mr-1" /> {booking.owner.phoneNumber}
                                </a>
                              )}
                            </td>
                          <td>
                            <span className="badge badge-success text-white">Confirmed</span>
                          </td>
                          <td>
                            <button onClick={() => handleStatusUpdate(booking._id, 'rejected')} className="btn btn-xs btn-error text-white">ยกเลิก</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              ) : (
                <table className="table bg-base-100 shadow-xl rounded-xl opacity-75">
                  <thead className="bg-base-200">
                    <tr>
                      <th>วันที่</th>
                      <th>บริการ</th>
                      <th>ลูกค้า</th>
                      <th>สถานะ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allBookings.filter(b => ['rejected', 'cancelled'].includes(b.status || '')).length === 0 ? (
                      <tr><td colSpan={4} className="text-center py-4">ไม่พบข้อมูล</td></tr>
                    ) : (
                      allBookings.filter(b => ['rejected', 'cancelled'].includes(b.status || '')).map(booking => (
                        <tr key={booking._id}>
                          <td>{new Date(booking.bookingDate).toLocaleString('th-TH')}</td>
                          <td>{booking.service?.name}</td>
                            <td>
                              <div className="font-bold">{typeof booking.owner === 'string' ? booking.owner : booking.owner.username}</div>
                              {typeof booking.owner !== 'string' && booking.owner.phoneNumber && (
                                <a href={`tel:${booking.owner.phoneNumber}`} className="flex items-center text-xs text-gray-500 mt-1 hover:text-teal-600">
                                  <FaPhone className="mr-1" /> {booking.owner.phoneNumber}
                                </a>
                              )}
                            </td>
                          <td>
                            <span className={`badge ${booking.status === 'rejected' ? 'badge-error text-white' : 'badge-ghost'}`}>
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;