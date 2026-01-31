import React from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  actionLink?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, actionLabel, onAction, actionLink }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-white/50 rounded-xl border-2 border-dashed border-slate-300 text-center w-full">
      <p className="text-lg text-slate-500 mb-4">{message}</p>
      {actionLabel && (
        actionLink ? (
          <Link to={actionLink} className="btn bg-teal-500 hover:bg-teal-600 border-none text-white rounded-full shadow-md">
            {actionLabel}
          </Link>
        ) : (
          <button onClick={onAction} className="btn bg-teal-500 hover:bg-teal-600 border-none text-white rounded-full shadow-md">
            {actionLabel}
          </button>
        )
      )}
    </div>
  );
};

export default EmptyState;