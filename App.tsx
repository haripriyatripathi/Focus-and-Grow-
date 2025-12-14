import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { useTheme } from './hooks/useTheme';
import { useHabits } from './hooks/useHabits';
import { Header } from './components/Header';
import { HabitTable } from './components/HabitTable';
import { AnalyticsChart } from './components/AnalyticsChart';
import { StatisticsPanel } from './components/StatisticsPanel';

const App: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const {
    habits,
    title,
    firstDayOfWeek,
    addHabit,
    deleteHabit,
    updateHabitName,
    updateHabitColor,
    toggleDay,
    setTitle,
    setFirstDayOfWeek,
    resetAllProgress
  } = useHabits();

  const chartRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (chartRef.current) {
      try {
        const canvas = await html2canvas(chartRef.current, {
          backgroundColor: isDark ? '#0f172a' : '#ffffff', // Match bg-gray-950 or white
          scale: 2 // High res
        });
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = image;
        link.download = `focus-grow-chart-${new Date().toISOString().split('T')[0]}.png`;
        link.click();
      } catch (err) {
        console.error("Export failed:", err);
        alert("Failed to export chart. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Header
        title={title}
        setTitle={setTitle}
        isDark={isDark}
        toggleTheme={toggleTheme}
        habits={habits}
        onAddHabit={addHabit}
        onExport={handleExport}
        onReset={resetAllProgress}
      />

      <main className="container mx-auto max-w-[95%] px-4 xl:max-w-7xl">
        
        {/* Main Tracker Section */}
        <section className="mb-10 animate-fade-in">
           <HabitTable
             habits={habits}
             firstDayOfWeek={firstDayOfWeek}
             setFirstDayOfWeek={setFirstDayOfWeek}
             deleteHabit={deleteHabit}
             updateHabitName={updateHabitName}
             updateHabitColor={updateHabitColor}
             toggleDay={toggleDay}
           />
        </section>

        {/* Analytics Section */}
        <div className="grid gap-8 lg:grid-cols-3">
            {/* Chart takes up 2 columns on large screens */}
            <section className="lg:col-span-2">
                <AnalyticsChart
                    habits={habits}
                    isDark={isDark}
                    chartRef={chartRef}
                />
            </section>

            {/* Stats take up 1 column on large screens, or full width below */}
            <section className="lg:col-span-1">
                 <div className="mb-4 flex items-center justify-between lg:hidden">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Habit Statistics</h3>
                 </div>
                 {/* Reusing stats panel but maybe in a simpler layout for side column? 
                     Actually, let's keep it responsive. 
                 */}
                 <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Quick Stats</h3>
                    <div className="flex flex-col gap-4">
                        {habits.map(h => (
                            <div key={h.id} className="flex flex-col gap-1 border-b border-gray-100 pb-2 last:border-0 dark:border-gray-800">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">{h.name}</span>
                                    <span className="font-bold transition-colors" style={{ color: h.color }}>{Math.round(h.done.length / 31 * 100)}%</span>
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                                    <div 
                                        className="h-full rounded-full transition-colors duration-300" 
                                        style={{ width: `${Math.round(h.done.length / 31 * 100)}%`, backgroundColor: h.color }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
            </section>
        </div>

        {/* Detailed Stats Grid below */}
        <section className="mt-10">
            <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">Detailed Breakdown</h3>
            <StatisticsPanel habits={habits} />
        </section>

      </main>
      
      <footer className="mt-20 py-8 text-center text-sm text-gray-500 dark:text-gray-500">
        <p>Focus & Grow • Local Storage Persisted • No Cloud Sync</p>
      </footer>
    </div>
  );
};

export default App;