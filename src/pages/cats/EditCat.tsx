import { useState, useEffect } from "react";
import { catService } from "../../services/cat.service";
import { useNavigate, useParams } from "react-router-dom";
import { FaCat } from "react-icons/fa";
import Swal from "sweetalert2";

export default function EditCat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [ageYears, setAgeYears] = useState<number>(0);
  const [ageMonths, setAgeMonths] = useState<number>(0);
  const [image, setImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      catService.getCat(id)
        .then((res) => {
          const cat = res.data;
          setName(cat.name);
          setAgeYears(cat.ageYears);
          setAgeMonths(cat.ageMonths);
          setCurrentImageUrl(cat.imageUrl);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch cat:", error);
          Swal.fire("Error", "ไม่สามารถโหลดข้อมูลแมวได้", "error");
          navigate("/cats");
        });
    }
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("ageYears", String(ageYears));
    formData.append("ageMonths", String(ageMonths));
    if (image) formData.append("image", image);

    try {
      await catService.updateCat(id, formData);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "แก้ไขข้อมูลแมวเรียบร้อย 🐱",
      });
      navigate("/cats");
    } catch (error) {
      console.error("Failed to update cat:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "ไม่สามารถแก้ไขข้อมูลได้ 😿",
      });
    }
  };

  if (loading) return <div className="text-center mt-10"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

  return (
    <div className="flex justify-center mt-12 font-roboto">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="text-3xl font-bold font-pacifico text-primary text-center w-full mb-6">
            <FaCat className="inline mr-2" /> แก้ไขข้อมูลแมว
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">ชื่อแมว</span>
              </label>
              <input
                className="input input-bordered w-full"
                placeholder="ชื่อแมว"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">อายุ (ปี)</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  placeholder="ปี"
                  value={ageYears}
                  onChange={(e) => setAgeYears(Number(e.target.value))}
                  min="0"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">อายุ (เดือน)</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={ageMonths}
                  onChange={(e) => setAgeMonths(Number(e.target.value))}
                >
                  {[...Array(12).keys()].map((m) => (
                    <option key={m} value={m}>
                      {m} เดือน
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text">รูปภาพแมว (เลือกใหม่เพื่อเปลี่ยน)</span>
              </label>
              {currentImageUrl && (
                <div className="mb-2">
                  <img 
                    src={currentImageUrl.startsWith("http") ? currentImageUrl : `http://localhost:5000${currentImageUrl}`} 
                    alt="Current" 
                    className="w-20 h-20 object-cover rounded-lg" 
                  />
                </div>
              )}
              <input
                type="file"
                className="file-input file-input-bordered w-full"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                accept="image/*"
              />
            </div>

            <button type="submit" className="btn btn-primary w-full">
              บันทึกการแก้ไข
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}