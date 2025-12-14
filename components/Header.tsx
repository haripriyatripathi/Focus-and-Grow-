import React, { useState, useRef, useEffect } from 'react';
import { Habit } from '../types';
import { DAYS_IN_MONTH } from '../constants';

interface HeaderProps {
  title: string;
  setTitle: (t: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
  habits: Habit[];
  onAddHabit: () => void;
  onExport: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  setTitle,
  isDark,
  toggleTheme,
  habits,
  onAddHabit,
  onExport,
  onReset
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTempTitle(title);
  }, [title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (tempTitle.trim()) {
      setTitle(tempTitle.trim());
    } else {
      setTempTitle(title); // Revert if empty
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  // Calculate Global Consistency
  const totalPotential = habits.length * DAYS_IN_MONTH;
  const totalCompleted = habits.reduce((acc, h) => acc + h.done.length, 0);
  const consistency = totalPotential > 0 ? Math.round((totalCompleted / totalPotential) * 100) : 0;

  return (
    <header className="mb-8 flex flex-col gap-6 border-b border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="rounded border border-gray-300 bg-transparent px-2 py-1 text-3xl font-bold text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white"
            />
          ) : (
            <h1
              onClick={() => setIsEditing(true)}
              className="cursor-pointer rounded border border-transparent px-2 py-1 text-3xl font-bold text-gray-900 hover:border-gray-300 hover:bg-gray-50 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-800"
              title="Click to edit title"
            >
              {title}
            </h1>
          )}
          
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
           <span>Overall Consistency</span>
           <div className="h-2.5 w-32 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
             <div 
                className="h-full bg-brand-500 transition-all duration-500"
                style={{ width: `${consistency}%` }}
             />
           </div>
           <span className="font-medium">{consistency}%</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onAddHabit}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:ring-offset-gray-900"
        >
          + Add Habit
        </button>
        <button
          onClick={onExport}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:ring-offset-gray-900"
        >
          Export
        </button>
        <button
          onClick={onReset}
          className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm transition-colors hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-red-900/50 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20 dark:ring-offset-gray-900"
          title="Reset Month Progress"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        </button>
      </div>
    </header>
  );
};