import { FaFacebook, FaTwitter, FaInstagram, FaCat } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="w-full bg-white/80 backdrop-blur-md border-t border-white/50 text-slate-600 font-roboto">
      <div className="px-12 py-8 flex flex-wrap items-center justify-between gap-8">

     
        <div className="flex items-center gap-4 max-w-md">
          <div className="p-3 bg-teal-100 rounded-full">
            <FaCat className="text-4xl text-teal-500" />
          </div>
          <div>
            <p className="text-2xl font-bold font-pacifico text-teal-600">
              Cat Care
            </p>
            <p className="text-sm text-slate-500">
              Providing reliable cat care since 2024
            </p>
          </div>
        </div>

        
        <div className="flex flex-col gap-3">
          <span className="text-lg font-semibold text-teal-700">
            Services
          </span>
          <div className="flex gap-6 text-base justify-center mr-20">
            <Link to="/services" className="hover:text-teal-500 transition">
              Grooming
            </Link>
            <Link to="/services" className="hover:text-teal-500 transition">
              Hotel
            </Link>
            <Link to="/services" className="hover:text-teal-500 transition">
              Checkup
            </Link>
          </div>
        </div>

      
        <div className="flex flex-col gap-3">
          <span className="text-lg font-semibold text-teal-700">
            Follow Us
          </span>
          <div className="flex gap-5 text-2xl">
            <FaTwitter className="text-slate-400 hover:text-teal-500 transition cursor-pointer" />
            <FaFacebook className="text-slate-400 hover:text-teal-500 transition cursor-pointer" />
            <FaInstagram className="text-slate-400 hover:text-teal-500 transition cursor-pointer" />
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
