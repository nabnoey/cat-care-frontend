import { useState, useEffect, useContext } from "react";
import { catService } from "../../services/cat.service";
import { authService } from "../../services/auth.service";
import type { Cat, User } from "../../types";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { UserContext } from "../../contexts/UserContext";
import { FaCamera, FaEnvelope, FaPhone } from "react-icons/fa";
import CatCard from "../../components/CatCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";

const Profile = () => {
  const { role } = useContext(UserContext)!;
  const [cats, setCats] = useState<Cat[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authService.getProfile();
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();

    if (role === 'admin') {
      setLoading(false);
    } else {
      fetchCats();
    }
  }, [role]);

  const fetchCats = async () => {
    try {
      const res = await catService.getCats();
      setCats(res.data);
    } catch (error) {
      console.error("Error fetching cats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);

      try {
        await authService.updateProfileImage(formData);
        const res = await authService.getProfile();
        setUser(res.data);
        Swal.fire("สำเร็จ", "อัปเดตรูปโปรไฟล์เรียบร้อย", "success");
      } catch (error) {
        console.error(error);
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถอัปเดตรูปโปรไฟล์ได้", "error");
      }
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
        title: 'คุณแน่ใจหรือไม่?',
        text: "คุณจะไม่สามารถกู้คืนข้อมูลนี้ได้!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'ใช่, ลบเลย!',
        cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
        try {
            await catService.deleteCat(id);
            Swal.fire(
                'ลบเรียบร้อย!',
                'ข้อมูลน้องแมวถูกลบแล้ว.',
                'success'
            );
            fetchCats();
        } catch (error) {
            console.error(error);
            Swal.fire(
                'เกิดข้อผิดพลาด!',
                'ไม่สามารถลบข้อมูลได้.',
                'error'
            );
        }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (role === 'admin') {
    return (
      <div className="container mx-auto mt-10 px-4 font-roboto mb-20">
        <div className="flex flex-col items-center mb-10">
          <div className="relative group">
            <div className="avatar placeholder mb-4">
              <div className="bg-neutral text-neutral-content rounded-full w-32 h-32 ring ring-primary ring-offset-base-100 ring-offset-2 flex items-center justify-center overflow-hidden">
                {user?.profileImage ? (
                  <img src={user.profileImage.startsWith("http") ? user.profileImage : `http://localhost:5000${user.profileImage}`} alt="Profile" />
                ) : (
                  <span className="text-4xl">{user?.username?.charAt(0).toUpperCase() || "A"}</span>
                )}
              </div>
            </div>
            <label className="absolute bottom-4 right-0 btn btn-circle btn-sm btn-primary cursor-pointer">
              <FaCamera className="text-white" />
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>
          <h2 className="text-2xl font-bold">{user?.username || "Admin"}</h2>
          <div className="flex items-center gap-2 text-gray-500 mt-1">
            <FaEnvelope className="text-sm" /> <span>{user?.email}</span>
          </div>
          {user?.phoneNumber && (
            <div className="flex items-center gap-2 text-gray-500 mt-1">
              <FaPhone className="text-sm" /> <span>{user?.phoneNumber}</span>
            </div>
          )}
          <div className="badge badge-primary mt-2">Administrator</div>
        </div>

        <div className="divider">เมนูจัดการ</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Link to="/admin" className="card bg-base-100 shadow-md hover:shadow-xl transition-all border border-base-200">
            <div className="card-body items-center text-center">
              <h2 className="card-title">Dashboard</h2>
              <p>ดูรายการจองและจัดการสถานะ</p>
            </div>
          </Link>
          <Link to="/admin/services" className="card bg-base-100 shadow-md hover:shadow-xl transition-all border border-base-200">
            <div className="card-body items-center text-center">
              <h2 className="card-title">จัดการบริการ</h2>
              <p>เพิ่ม/ลบ/แก้ไข บริการของร้าน</p>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 px-4 font-roboto mb-20">
      <div className="flex flex-col items-center mb-10">
        <div className="relative group">
          <div className="avatar placeholder mb-4">
            <div className="bg-neutral text-neutral-content rounded-full w-32 h-32 ring ring-primary ring-offset-base-100 ring-offset-2 flex items-center justify-center overflow-hidden">
              {user?.profileImage ? (
                <img src={user.profileImage.startsWith("http") ? user.profileImage : `http://localhost:5000${user.profileImage}`} alt="Profile" />
              ) : (
                <span className="text-4xl">{user?.username?.charAt(0).toUpperCase() || "U"}</span>
              )}
            </div>
          </div>
          <label className="absolute bottom-4 right-0 btn btn-circle btn-sm btn-primary cursor-pointer">
            <FaCamera className="text-white" />
            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
          </label>
        </div>
        <h2 className="text-2xl font-bold">{user?.username || "User"}</h2>
        <div className="flex items-center gap-2 text-gray-500 mt-1">
          <FaEnvelope className="text-sm" /> <span>{user?.email}</span>
        </div>
        {user?.phoneNumber && (
          <div className="flex items-center gap-2 text-gray-500 mt-1">
            <FaPhone className="text-sm" /> <span>{user?.phoneNumber}</span>
          </div>
        )}
      </div>

      <div className="divider"></div>

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-primary font-pacifico">น้องแมวของฉัน ({cats.length})</h3>
        <Link to="/cats/add" className="btn btn-sm btn-primary text-white rounded-full px-4 shadow-sm">
          + เพิ่มแมว
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cats.length === 0 ? (
            <div className="col-span-full">
              <EmptyState 
                message="ยังไม่มีข้อมูลแมว" 
                actionLabel="เพิ่มแมวตัวแรกของคุณที่นี่" 
                actionLink="/cats/add" 
              />
            </div>
        ) : (
            cats.map((cat) => (
              <CatCard key={cat._id} cat={cat} onDelete={handleDelete} />
            ))
        )}
      </div>
    </div>
  );
};

export default Profile;