import { useEffect, useState } from "react";
import { catService } from "../../services/cat.service";
import type { Cat } from "../../types";
import { Link } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import CatCard from "../../components/CatCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState"

const CatList = () => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCats = async () => {
    try {
      const res = await catService.getCats();
      setCats(res.data);
    } catch (err) {
      setError("Failed to fetch cats.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'ยืนยันการลบ?',
      text: "คุณต้องการลบข้อมูลน้องแมวตัวนี้ใช่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ใช่, ลบเลย',
      cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
      try {
        await catService.deleteCat(id);
        Swal.fire('ลบสำเร็จ!', 'ข้อมูลถูกลบเรียบร้อยแล้ว', 'success');
        fetchCats(); // Refresh list
      } catch (error) {
        console.error(error);
        Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถลบข้อมูลได้', 'error');
      }
    }
  };

  if (loading) {
    return (
      <LoadingSpinner />
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen font-roboto">
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error! {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 font-roboto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-pacifico text-primary">Our Lovely Cats</h1>
        <Link to="/cats/add" className="btn btn-primary">
          <FaPlusCircle className="mr-2" />
          Add New Cat
        </Link>
      </div>

      {cats.length === 0 ? (
        <EmptyState 
          message="ยังไม่มีข้อมูลแมว เพิ่มแมวตัวแรกของคุณเลย!" 
          actionLabel="เพิ่มแมว" 
          actionLink="/cats/add" 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cats.map((cat) => (
            <CatCard key={cat._id} cat={cat} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CatList;
