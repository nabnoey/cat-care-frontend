import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-rose-50 via-white to-teal-50 text-slate-600 font-roboto">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-4 mt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;