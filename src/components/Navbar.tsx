import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { SlMenu } from "react-icons/sl";
import Swal from "sweetalert2";

const Navbar = () => {
  const { isAuthenticated, role, logout } = useContext(UserContext)!;
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: 'ยืนยันการออกจากระบบ?',
      text: "คุณต้องการออกจากระบบใช่หรือไม่",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ใช่, ออกจากระบบ',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/login");
        Swal.fire({
          icon: "success",
          title: "ออกจากระบบสำเร็จ",
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  const navLinks = (
    <>
      <li><Link to="/">หน้าแรก</Link></li>
      {role === 'admin' ? (
        <>
          <li><Link to="/admin">Dashboard</Link></li>
          <li><Link to="/admin/services">จัดการบริการ</Link></li>
        </>
      ) : (
        <>
          <li><Link to="/services">บริการ</Link></li>
          <li><Link to="/about">เกี่ยวกับเรา</Link></li>
        </>
      )}
    </>
  );

  return (
    <div className="navbar bg-white/70 backdrop-blur-md shadow-sm px-4 font-roboto border-b border-white/40">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <SlMenu className="h-5 w-5" />
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            {navLinks}
          </ul>
        </div>
        <Link to="/" className="text-2xl font-bold font-pacifico text-teal-600 hover:text-teal-700 transition-colors">
          Cat Care
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 font-medium">{navLinks}</ul>
      </div>
      <div className="navbar-end gap-2">
        {!isAuthenticated ? (
          <Link to="/login" className="btn bg-teal-500 hover:bg-teal-600 border-none text-white rounded-full px-6 shadow-md shadow-teal-200">
            เข้าสู่ระบบ
          </Link>
        ) : (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center border-2 border-white shadow-sm">
                <span className="text-xl font-bold">U</span>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile" className="justify-between">โปรไฟล์</Link>
              </li>
              {role !== 'admin' && (
                <li><Link to="/my-bookings">การจองของฉัน</Link></li>
              )}
              <li><button onClick={handleLogout}>ออกจากระบบ</button></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;