import { useState, useContext } from "react";
import axios from "axios";
import { authService } from "../../services/auth.service";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import Swal from "sweetalert2";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { logIn } = useContext(UserContext)!;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await authService.login({ username, password });
      const userRole = res.data.user.role;
      logIn(res.data.user.accessToken, userRole);

      await Swal.fire({
        icon: 'success',
        title: 'เข้าสู่ระบบสำเร็จ',
        timer: 1500,
        showConfirmButton: false
      });
      
      if (userRole === 'admin') {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error: unknown) {
      console.error("Login failed:", error);
      let serverMsg = "เข้าสู่ระบบล้มเหลว";
      if (axios.isAxiosError(error)) {
        serverMsg = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        serverMsg = error.message;
      }
      setError(typeof serverMsg === "string" ? serverMsg : "เข้าสู่ระบบล้มเหลว");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] font-roboto">
      <div className="card w-96 bg-white/80 backdrop-blur-md shadow-2xl border border-white/50">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold font-pacifico text-teal-600 text-center w-full mb-4">เข้าสู่ระบบ</h2>
          <form onSubmit={submit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-slate-600">ชื่อผู้ใช้</span>
              </label>
              <input
                  type="text"
                className="input input-bordered bg-white/50 focus:bg-white focus:border-teal-400 transition-all"
                  placeholder="ชื่อผู้ใช้"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
              {error && (
                <p className="text-sm text-rose-500 mt-2 bg-rose-50 p-2 rounded-md border border-rose-100">{error}</p>
              )}
            <div className="form-control mt-2">
              <label className="label">
                <span className="label-text font-semibold text-slate-600">รหัสผ่าน</span>
              </label>
              <input
                type="password"
                className="input input-bordered bg-white/50 focus:bg-white focus:border-teal-400 transition-all"
                placeholder="รหัสผ่าน"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn bg-teal-500 hover:bg-teal-600 border-none text-white w-full mt-8 rounded-full shadow-lg shadow-teal-200">
              เข้าสู่ระบบ
            </button>
          </form>
          <p className="text-center mt-6 text-sm text-slate-500">
            ยังไม่มีบัญชี? <Link to="/register" className="link text-teal-600 font-bold hover:text-teal-700 no-underline">สมัครสมาชิก</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
