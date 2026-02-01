import { useState } from "react";
import { catService } from "../../services/cat.service";
import { useNavigate } from "react-router-dom";
import { FaCat } from "react-icons/fa";
import Swal from "sweetalert2"; // Import SweetAlert2

export default function AddCat() {
  const [name, setName] = useState("");
  const [ageYears, setAgeYears] = useState<number>(0);
  const [ageMonths, setAgeMonths] = useState<number>(0);
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("ageYears", String(ageYears));
    formData.append("ageMonths", String(ageMonths));
    if (image) formData.append("file", image);

    try {
      await catService.createCat(formData);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "เพิ่มแมวเรียบร้อย 🐱",
      });
      navigate("/cats"); 
    } catch (error) {
      console.error("Failed to add cat:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "ไม่สามารถเพิ่มแมวได้ 😿",
      });
    }
  };

  return (
    <div className="flex justify-center mt-12 font-roboto">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="text-3xl font-bold font-pacifico text-primary text-center w-full mb-6">
            <FaCat className="inline mr-2" /> เพิ่มข้อมูลแมว
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
           <label htmlFor="ageMonths" className="label">
  <span className="label-text">อายุ (เดือน)</span>
</label>

<select
  id="ageMonths"
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
              <label htmlFor="catImage" className="label">
  <span className="label-text">รูปภาพแมว</span>
</label>

<input
  id="catImage"
  type="file"
  className="file-input file-input-bordered w-full"
  onChange={(e) => setImage(e.target.files?.[0] || null)}
  accept="image/*"
/>

            </div>

            <button type="submit" className="btn btn-primary w-full">
              บันทึก
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
