import { useState } from "react";
import axios from "axios";
import { authService } from "../../services/auth.service";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

interface RegisterForm {
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<RegisterForm>({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user.username || !user.email || !user.phoneNumber || !user.password || !user.confirmPassword) {
      setError("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    if (user.password !== user.confirmPassword) {
      setError("รหัสผ่านทั้งสองช่องไม่ตรงกัน");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.register({
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        password: user.password,
        confirmPassword:user.confirmPassword
      });
      console.debug("Register response:", res?.data);
      await Swal.fire({
        icon: "success",
        title: "สมัครสมาชิกสำเร็จ",
        text: "กรุณาเข้าสู่ระบบเพื่อใช้งาน",
        confirmButtonText: "ตกลง"
      });
      navigate("/login");
    } catch (error: unknown) {
      console.error("Registration failed:", error);
      let serverMsg = "การสมัครสมาชิกล้มเหลว โปรดลองอีกครั้ง";
      if (axios.isAxiosError(error)) {
        serverMsg = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        serverMsg = error.message;
      }
      setError(typeof serverMsg === "string" ? serverMsg : "การสมัครสมาชิกล้มเหลว โปรดลองอีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] font-roboto py-10">
      <div className="card w-96 bg-white/80 backdrop-blur-md shadow-2xl border border-white/50">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold font-pacifico text-teal-600 text-center w-full mb-4">สมัครสมาชิก</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-slate-600">ชื่อผู้ใช้</span>
              </label>
              <input
                type="text"
                name="username"
                className="input input-bordered bg-white/50 focus:bg-white focus:border-teal-400 transition-all"
                placeholder="ชื่อผู้ใช้"
                value={user.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-slate-600">อีเมล</span>
              </label>
              <input
                type="email"
                name="email"
                className="input input-bordered bg-white/50 focus:bg-white focus:border-teal-400 transition-all"
                placeholder="อีเมล"
                value={user.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-slate-600">เบอร์โทรศัพท์</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                className="input input-bordered bg-white/50 focus:bg-white focus:border-teal-400 transition-all"
                placeholder="เบอร์โทรศัพท์ (10 หลัก)"
                value={user.phoneNumber}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                title="กรุณากรอกเบอร์โทรศัพท์ 10 หลัก"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-slate-600">รหัสผ่าน</span>
              </label>
              <input
                type="password"
                name="password"
                className="input input-bordered bg-white/50 focus:bg-white focus:border-teal-400 transition-all"
                placeholder="รหัสผ่าน"
                value={user.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-slate-600">ยืนยันรหัสผ่าน</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="input input-bordered bg-white/50 focus:bg-white focus:border-teal-400 transition-all"
                placeholder="ยืนยันรหัสผ่าน"
                value={user.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            {error && (
              <p className="text-sm text-rose-500 mt-2 bg-rose-50 p-2 rounded-md border border-rose-100">{error}</p>
            )}
            <button type="submit" className="btn bg-teal-500 hover:bg-teal-600 border-none text-white w-full mt-6 rounded-full shadow-lg shadow-teal-200" disabled={loading}>
              {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
            </button>
          </form>
          <p className="text-center mt-6 text-sm text-slate-500">
            มีบัญชีอยู่แล้ว? <Link to="/login" className="link text-teal-600 font-bold hover:text-teal-700 no-underline">เข้าสู่ระบบ</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;