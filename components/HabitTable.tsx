import React, { useState } from 'react';
import { Habit, WEEKDAYS } from '../types';

interface HabitTableProps {
  habits: Habit[];
  daysInMonth: number;
  startDayIndex: number; // 0 for Mon, 1 for Tue, etc based on WEEKDAYS array
  deleteHabit: (id: number) => void;
  updateHabitName: (id: number, name: string) => void;
  updateHabitColor: (id: number) => void;
  toggleDay: (habitId: number, day: number, type: 'left' | 'right') => void;
  currentMonthName: string;
}

export const HabitTable: React.FC<HabitTableProps> = ({
  habits,
  daysInMonth,
  startDayIndex,
  deleteHabit,
  updateHabitName,
  updateHabitColor,
  toggleDay,
  currentMonthName
}) => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');

  // Helper to get weekday for any day number (1-31)
  const getWeekday = (day: number) => {
    return WEEKDAYS[(startDayIndex + day - 1) % 7];
  };

  const getWeekGroup = (day: number) => {
    if (day <= 7) return 1;
    if (day <= 14) return 2;
    if (day <= 21) return 3;
    if (day <= 28) return 4;
    return 5;
  };

  const getWeeklyStats = (habit: Habit, start: number, end: number) => {
    let done = 0;
    let missed = 0;
    const effectiveEnd = Math.min(end, daysInMonth);
    const total = Math.max(0, effectiveEnd - start + 1);
    
    if (total === 0) return { done: 0, missed: 0, total: 0 };

    for (let i = start; i <= effectiveEnd; i++) {
        if (habit.done.includes(i)) done++;
        if (habit.notDone.includes(i)) missed++;
    }
    return { done, missed, total };
  };

  const WEEKS = [
    { id: 1, label: 'Week 1', sub: 'Days 1-7', start: 1, end: 7 },
    { id: 2, label: 'Week 2', sub: 'Days 8-14', start: 8, end: 14 },
    { id: 3, label: 'Week 3', sub: 'Days 15-21', start: 15, end: 21 },
    { id: 4, label: 'Week 4', sub: 'Days 22-28', start: 22, end: 28 },
    { id: 5, label: 'End', sub: `Days 29-${daysInMonth}`, start: 29, end: daysInMonth },
  ].filter(w => w.start <= daysInMonth);

  const isWeekEnd = (day: number) => [7, 14, 21, 28].includes(day);

  // --- Summary Calculation Helpers ---
  const getDayStats = (day: number) => {
    let doneCount = 0;
    const totalHabits = habits.length;

    habits.forEach(habit => {
        if (habit.done.includes(day)) doneCount++;
    });

    // Per user request: Not Done = Total - Done (Includes pending and explicitly missed)
    const notDoneCount = totalHabits - doneCount;

    const progress = totalHabits > 0 ? Math.round((doneCount / totalHabits) * 100) : 0;
    return { doneCount, notDoneCount, progress };
  };

  const renderDayHeader = (day: number) => {
    const weekday = getWeekday(day);
    const isWeekend = weekday === 'Sat' || weekday === 'Sun';
    const weekGroup = getWeekGroup(day);
    const isEvenWeek = weekGroup % 2 === 0;
    const isDivider = isWeekEnd(day);

    return (
      <th
        key={day}
        className={`min-w-[40px] border-b p-2 text-center text-xs dark:border-gray-700 ${
          isDivider 
            ? 'border-r-2 border-r-gray-300 dark:border-r-gray-600' 
            : 'border-r border-r-gray-200'
        } ${
          isEvenWeek ? 'bg-gray-50/50 dark:bg-gray-800/30' : 'bg-white dark:bg-gray-900'
        }`}
      >
        <div className={`mb-1 font-bold ${isWeekend ? 'text-brand-500 dark:text-brand-400' : 'text-gray-700 dark:text-gray-300'}`}>
          {weekday}
        </div>
        <div className="text-gray-400">{day}</div>
      </th>
    );
  };

  // --- Render Footer Rows ---
  const renderSummaryRow = (type: 'Progress' | 'Done' | 'Not Done') => {
    const labelClass = "sticky left-0 z-20 border-r border-t border-gray-200 bg-gray-50 px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400";
    const spacerClass = "sticky left-64 z-20 border-r border-t border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800";
    
    return (
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
        <td className={labelClass}>{type}</td>
        <td className={spacerClass}></td>
        
        {viewMode === 'daily' && (
             Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
               const { doneCount, notDoneCount, progress } = getDayStats(day);
               const isDivider = isWeekEnd(day);
               const weekGroup = getWeekGroup(day);
               const isEvenWeek = weekGroup % 2 === 0;

               let content;
               let cellColorClass = isEvenWeek ? 'bg-gray-50/30 dark:bg-gray-800/20' : '';
               
               if (type === 'Progress') {
                 if (progress === 100 && habits.length > 0) {
                    cellColorClass = "bg-green-50 dark:bg-green-900/20";
                    content = <span className="font-bold text-green-600 dark:text-green-400 animate-pulse">{progress}%</span>;
                 } else if (progress > 0) {
                    content = <span className="font-medium text-gray-600 dark:text-gray-400">{progress}%</span>;
                 } else {
                    content = <span className="text-gray-300 dark:text-gray-600">0%</span>;
                 }
               } else if (type === 'Done') {
                 content = doneCount > 0 ? <span className="font-semibold text-brand-600 dark:text-brand-400">{doneCount}</span> : <span className="text-gray-300">-</span>;
               } else if (type === 'Not Done') {
                 // Always show number if > 0
                 content = notDoneCount > 0 ? <span className="font-medium text-red-500">{notDoneCount}</span> : <span className="text-gray-300">-</span>;
               }

               return (
                 <td
                   key={day}
                   className={`h-10 border-t border-gray-200 text-center text-xs dark:border-gray-700 ${
                       isDivider 
                         ? 'border-r-2 border-r-gray-300 dark:border-r-gray-600' 
                         : 'border-r border-r-gray-100 dark:border-r-gray-800'
                   } ${cellColorClass}`}
                 >
                   {content}
                 </td>
               );
             })
        )}
      </tr>
    );
  };


  return (
    <div className="relative mb-8 flex w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      
      {/* Toolbar */}
      <div className="flex flex-col gap-4 border-b border-gray-100 bg-gray-50/50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/50 sm:flex-row sm:items-center sm:justify-between">
         <div className="flex items-center gap-4">
             <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Tracker View</h3>
             <div className="flex items-center gap-2 rounded-lg bg-gray-200 p-1 dark:bg-gray-700">
                <button 
                  onClick={() => setViewMode('daily')}
                  className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${viewMode === 'daily' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
                >
                  Daily
                </button>
                <button 
                  onClick={() => setViewMode('weekly')}
                  className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${viewMode === 'weekly' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
                >
                  Weekly
                </button>
             </div>
         </div>

         <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Current Month:</span>
            <div className="rounded bg-white px-3 py-1 text-sm font-bold text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700">
               {currentMonthName}
            </div>
         </div>
      </div>

      <div className="w-full overflow-x-auto pb-2">
        <table className="min-w-max border-collapse text-left">
          <thead className="z-40">
            <tr>
              <th className="sticky left-0 z-30 h-10 w-64 border-b border-r border-gray-200 bg-gray-50 px-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                Habits
              </th>
              <th className="sticky left-64 z-30 h-10 w-32 border-b border-r border-gray-200 bg-gray-50 px-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                Progress
              </th>
              
              {viewMode === 'daily' ? (
                <>
                  <th colSpan={7} className="border-b border-r-2 border-gray-200 border-r-gray-300 bg-gray-50 px-2 text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:border-r-gray-600 dark:bg-gray-800 dark:text-gray-400">Week 1</th>
                  <th colSpan={7} className="border-b border-r-2 border-gray-200 border-r-gray-300 bg-gray-100/50 px-2 text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:border-r-gray-600 dark:bg-gray-800/50 dark:text-gray-400">Week 2</th>
                  <th colSpan={7} className="border-b border-r-2 border-gray-200 border-r-gray-300 bg-gray-50 px-2 text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:border-r-gray-600 dark:bg-gray-800 dark:text-gray-400">Week 3</th>
                  <th colSpan={7} className="border-b border-r-2 border-gray-200 border-r-gray-300 bg-gray-100/50 px-2 text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:border-r-gray-600 dark:bg-gray-800/50 dark:text-gray-400">Week 4</th>
                  {daysInMonth > 28 && (
                      <th colSpan={daysInMonth - 28} className="border-b border-gray-200 bg-gray-50 px-2 text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">End</th>
                  )}
                </>
              ) : (
                  <th colSpan={WEEKS.length} className="border-b border-gray-200 bg-gray-50 px-2 text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                    Weekly Breakdown
                  </th>
              )}
            </tr>
            <tr>
              <th className="sticky left-0 z-30 border-b border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"></th>
              <th className="sticky left-64 z-30 border-b border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"></th>
              
              {viewMode === 'daily' ? (
                 Array.from({ length: daysInMonth }, (_, i) => i + 1).map(renderDayHeader)
              ) : (
                 WEEKS.map((week, idx) => (
                    <th key={week.id} className={`min-w-[140px] border-b border-r border-gray-200 p-2 text-center text-xs dark:border-gray-700 ${idx % 2 !== 0 ? 'bg-gray-50/50 dark:bg-gray-800/30' : 'bg-white dark:bg-gray-900'}`}>
                        <div className="font-bold text-gray-700 dark:text-gray-300">{week.label}</div>
                        <div className="text-gray-400">{week.sub}</div>
                    </th>
                 ))
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {habits.map((habit) => {
              const progress = Math.round((habit.done.length / daysInMonth) * 100);

              return (
                <tr key={habit.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="sticky left-0 z-20 w-64 border-r border-gray-200 bg-white px-4 py-3 group-hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:group-hover:bg-gray-800">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex w-full items-center gap-2">
                        <button
                            onClick={() => updateHabitColor(habit.id)}
                            className="h-3 w-3 shrink-0 rounded-full transition-transform hover:scale-125 focus:outline-none"
                            style={{ backgroundColor: habit.color }}
                            title="Change color"
                        />
                        <input
                            type="text"
                            value={habit.name}
                            onChange={(e) => updateHabitName(habit.id, e.target.value)}
                            className="w-full min-w-0 bg-transparent text-sm font-medium text-gray-900 focus:outline-none dark:text-gray-200"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteHabit(habit.id);
                        }}
                        className="shrink-0 text-red-400 opacity-0 transition-opacity hover:text-red-600 focus:opacity-100 group-hover:opacity-100"
                        title="Delete Habit"
                        aria-label="Delete Habit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </td>

                  <td className="sticky left-64 z-20 w-32 border-r border-gray-200 bg-white px-4 py-3 group-hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:group-hover:bg-gray-800">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{progress}%</span>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-full transition-colors duration-300"
                          style={{ width: `${progress}%`, backgroundColor: habit.color }}
                        />
                      </div>
                    </div>
                  </td>

                  {viewMode === 'daily' ? (
                     Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                       const isDone = habit.done.includes(day);
                       const isNotDone = habit.notDone.includes(day);
                       const weekGroup = getWeekGroup(day);
                       const isEvenWeek = weekGroup % 2 === 0;
                       const isDivider = isWeekEnd(day);

                       return (
                         <td
                           key={day}
                           onContextMenu={(e) => {
                             e.preventDefault();
                             toggleDay(habit.id, day, 'right');
                           }}
                           onClick={() => toggleDay(habit.id, day, 'left')}
                           className={`h-12 w-10 cursor-pointer border-b border-gray-100 p-0 text-center transition-colors dark:border-gray-800 ${
                               isDivider 
                                 ? 'border-r-2 border-r-gray-300 dark:border-r-gray-600' 
                                 : 'border-r border-r-gray-100 dark:border-r-gray-800'
                           } ${
                               isEvenWeek ? 'bg-gray-50/30 dark:bg-gray-800/20' : ''
                           }`}
                         >
                            <div className="flex h-full w-full items-center justify-center">
                              {isDone ? (
                                <div 
                                    className="flex h-6 w-6 items-center justify-center rounded text-white shadow-sm transition-transform hover:scale-110"
                                    style={{ backgroundColor: habit.color }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                </div>
                              ) : isNotDone ? (
                                <div className="flex h-6 w-6 items-center justify-center rounded bg-red-100 text-red-500 transition-transform hover:scale-110 dark:bg-red-900/30 dark:text-red-400">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                </div>
                              ) : (
                                <div className="h-6 w-6 rounded border border-gray-200 hover:border-brand-400 dark:border-gray-700 dark:hover:border-brand-600" />
                              )}
                            </div>
                         </td>
                       );
                     })
                  ) : (
                     WEEKS.map((week, idx) => {
                        const { done, missed, total } = getWeeklyStats(habit, week.start, week.end);
                        const percent = total > 0 ? Math.round((done / total) * 100) : 0;
                        const isEven = idx % 2 !== 0;

                        return (
                            <td key={week.id} className={`border-r border-gray-100 p-4 dark:border-gray-800 ${isEven ? 'bg-gray-50/30 dark:bg-gray-800/20' : ''}`}>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-end justify-between">
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">{done}<span className="text-sm font-normal text-gray-400">/{total}</span></span>
                                        {missed > 0 && <span className="text-xs font-medium text-red-500">{missed} missed</span>}
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                         <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: percent < 50 ? '#fb923c' : habit.color }}></div>
                                    </div>
                                </div>
                            </td>
                        )
                     })
                  )}
                </tr>
              );
            })}
            
            {/* Spacer Row to create gap before footer - Increased Padding to h-20 */}
            <tr className="h-20">
                <td className="sticky left-0 z-20 bg-white border-r border-gray-100 dark:bg-gray-900 dark:border-gray-800"></td>
                <td className="sticky left-64 z-20 bg-white border-r border-gray-100 dark:bg-gray-900 dark:border-gray-800"></td>
                <td colSpan={viewMode === 'daily' ? daysInMonth : WEEKS.length} className="bg-transparent"></td>
            </tr>

          </tbody>
          
          {/* Footer for Daily Overview - ONLY visible in Daily Mode */}
          {viewMode === 'daily' && (
            <tfoot className="z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] border-t-2 border-gray-100 dark:border-gray-800">
              {renderSummaryRow('Progress')}
              {renderSummaryRow('Done')}
              {renderSummaryRow('Not Done')}
            </tfoot>
          )}

        </table>
      </div>
    </div>
  );
};