import React from 'react';
import { Link } from 'react-router-dom';
import type { Cat } from '../types';

interface CatCardProps {
  cat: Cat;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

const CatCard: React.FC<CatCardProps> = ({ cat, onDelete, showActions = true }) => {
  return (
    <div className="card bg-base-100 shadow-xl image-full hover:scale-[1.02] transition-transform duration-300 group h-48">
      <figure>
        <img
          src={cat.imageUrl ? (cat.imageUrl.startsWith("http") ? cat.imageUrl : `http://localhost:5000${cat.imageUrl}`) : "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"}
          alt={cat.name}
          className="w-full h-full object-cover"
        />
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title text-white text-xl drop-shadow-md">{cat.name}</h2>
        <p className="text-white/90 text-sm drop-shadow-sm">อายุ: {cat.ageYears} ปี {cat.ageMonths} เดือน</p>
        {showActions && (
          <div className="card-actions justify-end mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200 gap-2">
            <Link to={`/cats/edit/${cat._id}`} className="btn btn-warning btn-xs text-white shadow-lg">แก้ไข</Link>
            {onDelete && (
              <button onClick={() => onDelete(cat._id)} className="btn btn-error btn-xs text-white shadow-lg">ลบ</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CatCard;