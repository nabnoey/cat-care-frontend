import { useState, useEffect } from "react";
import { serviceService } from "../../../services/service.service";
import type { Service } from "../../../types";
import Swal from "sweetalert2";

const AdminServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    type: "",
    imageUrl: ""
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await serviceService.getServices();
      setServices(res.data);
    } catch (error) {
      console.error("Error fetching services:", error);
      Swal.fire("Error", "ไม่สามารถโหลดข้อมูลบริการได้", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        description: service.description || "",
        price: service.price || 0,
        type: service.type || "",
        imageUrl: service.imageUrl || ""
      });
    } else {
      setEditingService(null);
      setFormData({
        name: "",
        description: "",
        price: 0,
        type: "",
        imageUrl: ""
      });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("description", formData.description);
    submitData.append("price", formData.price.toString());
    submitData.append("type", formData.type);
    if (imageFile) {
      submitData.append("image", imageFile);
    }

    try {
      if (editingService) {
        await serviceService.updateService(editingService._id, submitData);
        Swal.fire("สำเร็จ", "แก้ไขบริการเรียบร้อยแล้ว", "success");
      } else {
        await serviceService.createService(submitData);
        Swal.fire("สำเร็จ", "เพิ่มบริการใหม่เรียบร้อยแล้ว", "success");
      }
      handleCloseModal();
      fetchServices();
    } catch (error) {
      console.error(error);
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้", "error");
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: "การลบนี้ไม่สามารถกู้คืนได้!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
      try {
        await serviceService.deleteService(id);
        Swal.fire('ลบเรียบร้อย!', 'บริการถูกลบออกจากระบบแล้ว', 'success');
        fetchServices();
      } catch (error) {
        console.error(error);
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบบริการได้", "error");
      }
    }
  };

  if (loading && services.length === 0) return <div className="text-center mt-10"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

  return (
    <div className="container mx-auto p-6 font-roboto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold font-pacifico text-primary">จัดการบริการ (Services)</h1>
        <button onClick={() => handleOpenModal()} className="btn btn-primary text-white">
          + เพิ่มบริการใหม่
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table bg-base-100 shadow-xl rounded-xl">
          <thead className="bg-base-200">
            <tr>
              <th>รูปภาพ</th>
              <th>ชื่อบริการ</th>
              <th>ประเภท</th>
              <th>ราคา</th>
              <th>คำอธิบาย</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service._id}>
                <td>
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <img 
                        src={service.imageUrl ? (service.imageUrl.startsWith("http") ? service.imageUrl : `${import.meta.env.VITE_BASE_URL}${service.imageUrl}`) : "https://placehold.co/100"} 
                        alt={service.name} 
                      />
                    </div>
                  </div>
                </td>
                <td className="font-bold">{service.name}</td>
                <td><span className="badge badge-ghost">{service.type}</span></td>
                <td>{service.price}</td>
                <td className="max-w-xs truncate">{service.description}</td>
                <td>
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenModal(service)} className="btn btn-sm btn-warning text-white">แก้ไข</button>
                    <button onClick={() => handleDelete(service._id)} className="btn btn-sm btn-error text-white">ลบ</button>
                  </div>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
                <tr>
                    <td colSpan={6} className="text-center py-4">ไม่พบข้อมูลบริการ</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">{editingService ? "แก้ไขบริการ" : "เพิ่มบริการใหม่"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-control w-full mb-2">
                <label className="label"><span className="label-text">ชื่อบริการ</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input input-bordered w-full" />
              </div>
              <div className="form-control w-full mb-2">
                <label className="label"><span className="label-text">ราคา (บาท)</span></label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required className="input input-bordered w-full" />
              </div>
              <div className="form-control w-full mb-2">
                <label className="label"><span className="label-text">ประเภท</span></label>
                <select name="type" value={formData.type} onChange={handleChange} className="select select-bordered w-full">
                    <option value="">-- เลือกประเภท --</option>
                    <option value="grooming">อาบน้ำ/ตัดขน (Grooming)</option>
                    <option value="hotel">ฝากเลี้ยง (Hotel)</option>
                    <option value="checkup">ตรวจสุขภาพ (Checkup)</option>
                    <option value="other">อื่นๆ</option>
                </select>
              </div>
              <div className="form-control w-full mb-2">
                <label className="label"><span className="label-text">รูปภาพ</span></label>
                <input type="file" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} className="file-input file-input-bordered w-full" accept="image/*" />
                {(imageFile || formData.imageUrl) && (
                  <div className="mt-2">
                    <img 
                      src={imageFile ? URL.createObjectURL(imageFile) : (formData.imageUrl.startsWith("http") ? formData.imageUrl : `${import.meta.env.VITE_BASE_URL}${formData.imageUrl}`)} 
                      alt="Preview" 
                      className="h-32 w-auto object-cover rounded-lg" 
                    />
                  </div>
                )}
              </div>
              <div className="form-control w-full mb-4">
                <label className="label"><span className="label-text">คำอธิบาย</span></label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="textarea textarea-bordered h-24"></textarea>
              </div>
              <div className="modal-action">
                <button type="button" className="btn" onClick={handleCloseModal}>ยกเลิก</button>
                <button type="submit" className="btn btn-primary text-white">บันทึก</button>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={handleCloseModal}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default AdminServices;
