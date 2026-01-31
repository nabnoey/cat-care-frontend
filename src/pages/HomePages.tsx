import { Link } from 'react-router-dom';
import { FaCat } from 'react-icons/fa';

function HomePages() {
  return (
    <>
      <div className="hero min-h-[80vh] font-roboto">
        <div className="hero-content flex-col lg:flex-row-reverse gap-12">
          <div className="relative">
            <div className="absolute -inset-4 bg-teal-200/30 rounded-full blur-3xl"></div>
            <FaCat className="relative text-9xl lg:text-[20rem] text-teal-500 drop-shadow-xl" />
          </div>
          <div className='max-w-md text-center lg:text-left'>
            <h1 className="text-6xl font-pacifico text-slate-800 mb-6 leading-tight">
              Welcome to <span className="text-teal-500">Cat Care</span>
            </h1>
            <p className="py-6 text-lg text-slate-600 leading-relaxed">
              Providing the best care for your furry friends. We offer a wide range of services to ensure your cat is happy and healthy.
            </p>
            <Link to="/services" className="btn bg-rose-400 hover:bg-rose-500 border-none text-white btn-lg rounded-full shadow-lg shadow-rose-200 px-8">
              Get Started
            </Link>
          </div>
        </div>
      </div>
     
    </>
  );
}

export default HomePages;