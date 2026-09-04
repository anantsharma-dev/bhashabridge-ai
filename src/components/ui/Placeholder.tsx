import React from 'react';

export const Placeholder: React.FC<{ name: string }> = ({ name }) => (
  <div className="flex items-center justify-center min-h-[60vh] flex-col space-y-4">
    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{name} Page</h2>
    <p className="text-slate-500 dark:text-slate-400 italic">This screen is under development...</p>
  </div>
);

export default Placeholder;
