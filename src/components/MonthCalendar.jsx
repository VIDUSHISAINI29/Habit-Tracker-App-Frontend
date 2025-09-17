import { useMemo, useState } from "react";

// Helpers
function startOfMonth(iso) {
   const d = new Date(iso);
   d.setDate(1);
   return d;
}
function isoOf(d) {
   return d.toISOString().slice(0, 10);
}

export default function MonthCalendar({
   selected,
   onSelect,
   completedDates = new Set(),
}) {
   const [month, setMonth] = useState(() =>
      startOfMonth(selected || isoOf(new Date()))
   );

   // Generate grid
   const grid = useMemo(() => {
      const first = new Date(month);
      const startWeekday = (first.getDay() + 7) % 7; // 0=Sun
      const daysInMonth = new Date(
         first.getFullYear(),
         first.getMonth() + 1,
         0
      ).getDate();

      const cells = [];
      for (let i = 0; i < startWeekday; i++) cells.push(null);
      for (let d = 1; d <= daysInMonth; d++) {
         const date = new Date(first.getFullYear(), first.getMonth(), d);
         cells.push(isoOf(date));
      }
      while (cells.length % 7 !== 0) cells.push(null);
      return cells;
   }, [month]);

   const todayIso = isoOf(new Date());
   const monthLabel = month.toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
   });

   return (
      <div className="w-full max-w-md p-5 bg-white border shadow-lg h-[350px] rounded-2xl dark:bg-gray-900">
         {/* Header */}
         <div className="flex items-center justify-between mb-4">
            <button
               onClick={() =>
                  setMonth(
                     new Date(month.getFullYear(), month.getMonth() - 1, 1)
                  )
               }
               className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition">
               ◀
            </button>
            <div className="text-lg font-semibold">{monthLabel}</div>
            <button
               onClick={() =>
                  setMonth(
                     new Date(month.getFullYear(), month.getMonth() + 1, 1)
                  )
               }
               className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition">
               ▶
            </button>
         </div>

         {/* Weekdays */}
         <div className="grid grid-cols-7 gap-1 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
               <div key={d} className="text-center">
                  {d}
               </div>
            ))}
         </div>

         {/* Days */}
         <div className="grid grid-cols-7 gap-1">
            {grid.map((iso, i) => {
               const isSelected = iso && selected === iso;
               const isCompleted = iso && completedDates.has(iso);
               const isToday = iso === todayIso;

               return (
                  <button
                     key={i}
                     disabled={!iso}
                     onClick={() => iso && onSelect(iso)}
                     className={`h-10 w-10 flex items-center justify-center rounded-lg text-sm transition-all
  ${!iso ? "opacity-0 cursor-default" : ""}
  ${isSelected ? "bg-blue-600 text-white shadow-md scale-110" : "hover:bg-blue-100 hover:scale-105"}
  ${completedDates.has(iso) ? "ring-2 ring-green-500" : ""}
`}>
                     {iso ? new Date(iso).getDate() : ""}
                  </button>
               );
            })}
         </div>

         {/* Footer */}
         {/* Footer */}
         <div className="flex justify-end ">
            <button
               onClick={() => {
                  const today = new Date();
                  setMonth(startOfMonth(today)); // jump to current month
                  onSelect(isoOf(today)); // update selected date
               }}
               className="text-xs font-medium text-gray-500 transition hover:text-blue-600">
               Today
            </button>
         </div>
      </div>
   );
}
