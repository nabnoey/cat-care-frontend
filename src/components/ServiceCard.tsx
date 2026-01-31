import React from 'react';
import { Link } from 'react-router-dom';
import type { Service } from '../types';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className="card bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl hover:shadow-teal-100 transition-all duration-300 border border-white/50 hover:-translate-y-2 group h-full">
      <figure className="px-4 pt-4 overflow-hidden h-40">
         <img 
            src={service.imageUrl ? (service.imageUrl.startsWith("http") ? service.imageUrl : `http://localhost:5000${service.imageUrl}`) : "https://placehold.co/600x400?text=Service"} 
            alt={service.name} 
            className="rounded-xl w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
      </figure>
      <div className="card-body items-center text-center p-4">
        <h2 className="card-title text-lg font-bold text-slate-700">{service.name}</h2>
        <p className="text-slate-500 line-clamp-2 text-sm h-10">{service.description}</p>
        <div className="text-xl font-bold text-teal-600 my-2 font-pacifico">
          {service.price ? `฿${service.price}` : "ราคาตามตกลง"}
        </div>
        <div className="card-actions mt-auto w-full">
          <Link to={`/services/${service._id}`} className="btn bg-teal-500 hover:bg-teal-600 border-none text-white rounded-full w-full shadow-md shadow-teal-100">
            ดูรายละเอียด
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;