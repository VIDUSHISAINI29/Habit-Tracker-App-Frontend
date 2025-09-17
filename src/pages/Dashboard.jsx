import { useContext, useEffect, useState } from "react";
import MonthCalendar from "../components/MonthCalendar.jsx";
import ProgressWheel from "../components/ProgressWheel";
import HabitForm from "../components/HabitForm";
import { ApiContext } from "../context/apiContext";
import { AuthContext } from "../context/AuthContext";

const isoOf = (d) => d.toISOString().slice(0, 10);
const todayISO = () => isoOf(new Date());

const formatNice = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const {
    getCategories,
    createHabit,
    getHabitsForDate,
    updateHabitStatus,
    markDoneForStreak,
  } = useContext(ApiContext);

  const [categories, setCategories] = useState([]);
  const [habitsForSelectedDate, setHabitsForSelectedDate] = useState([]);
  const [habitData, setHabitData] = useState({
    userId: "",
    habitName: "",
    habitDates: [],
    category: "",
  });
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showHabitForm, setShowHabitForm] = useState(false);

  // Get all habits for the user and filter on frontend
  const getHabitForDateFunction = async () => {
    try {
      const res = await getHabitsForDate(); // now returns all user habits
      const habitsByCategory = res.data.habits
        .filter(
          (habit) =>
            selectedCategory === "All" || habit.category === selectedCategory
        )
        .filter(
          (habit) =>
            // Filter habits where selected date exists in history OR habitDates
            habit.history?.some(
              (entry) => entry.date.slice(0, 10) === selectedDate
            ) ||
            habit.habitDates?.some((d) => d.slice(0, 10) === selectedDate)
        );

      setHabitsForSelectedDate(habitsByCategory);
    } catch (error) {
      console.log("Error in getting habits for date.", error.message);
    }
  };

  // Post habit
  const postHabit = async () => {
    habitData.userId = user._id;
    await createHabit(
      habitData.userId,
      habitData.habitName,
      habitData.habitDates,
      habitData.category
    );
    setShowHabitForm(false);
    await getHabitForDateFunction();
  };

  // Get categories
  const getCategoriesFunction = async () => {
    try {
      const res = await getCategories(user._id);
      setCategories(res.data.categories);
    } catch (error) {
      console.log("Error in getting categories", error.message);
    }
  };

  useEffect(() => {
    getHabitForDateFunction();
    getCategoriesFunction();
  }, [user?._id, selectedCategory, selectedDate]);

  const updateHabitFunction = async (habitId, date, status) => {
    const isoDate = new Date(date).toISOString().slice(0, 10);
    try {
      await updateHabitStatus(habitId, { date: isoDate, ifCompleted: status });
    } catch (error) {
      console.log("Error in update habit function ", error.message);
    }
  };

  const markDoneForSelected = async (habitId, status, selectedDate) => {
    const isoDate = new Date(selectedDate).toISOString().slice(0, 10);

    // Optimistic local update
    setHabitsForSelectedDate((prev) =>
      prev.map((habit) =>
        habit._id === habitId
          ? { ...habit, history: updateHistory(habit.history, isoDate, status) }
          : habit
      )
    );

    try {
      await updateHabitFunction(habitId, isoDate, status);
      await markDoneForStreak(habitId, new Date());
      // await getHabitForDateFunction();
    } catch (error) {
      console.error("Error updating habit:", error.message);
    }
  };

  const updateHistory = (history, date, status) => {
    const isoDate = new Date(date).toISOString().slice(0, 10);
    const exists = history.find((h) => h.date.slice(0, 10) === isoDate);
    if (exists) {
      return history.map((h) =>
        h.date.slice(0, 10) === isoDate
          ? { ...h, ifCompleted: status, date: isoDate }
          : h
      );
    }
    return [...history, { date: isoDate, ifCompleted: status }];
  };

  const dayPercent = habitsForSelectedDate.length
    ? Math.round(
        (habitsForSelectedDate.filter((h) =>
          h.history.some(
            (entry) =>
              entry.date.slice(0, 10) === selectedDate && entry.ifCompleted
          )
        ).length /
          habitsForSelectedDate.length) *
          100
      )
    : 0;

  const bestStreak = habitsForSelectedDate.length
    ? Math.max(...habitsForSelectedDate.map((h) => h.streak || 0))
    : 0;

  const stats = [
    { label: "Total Habits", value: habitsForSelectedDate.length, color: "from-sky-400 to-cyan-300" },
    { label: "Points", value: 100, color: "from-orange-400 to-amber-300" },
    { label: "Best Streak", value: `${bestStreak} days`, color: "from-violet-400 to-purple-300" },
  ];

  return (
    <div className="p-5 space-y-10">
      {/* Hero Section */}
      <section className="p-8 border shadow-lg rounded-3xl bg-gradient-to-br from-primary/10 via-accent/20 to-transparent">
        <h1 className="text-4xl font-extrabold">Build Streaks. Stay Accountable.</h1>
        <p className="mt-3 text-lg text-foreground/70">
          Your journey to discipline, focus, and growth begins here —
        </p>
        <span className="text-lg text-foreground/70">
          Track your habits, celebrate your progress, and build the life you deserve.
        </span>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`p-6 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300`}>
            <div className="text-xs opacity-80">{stat.label}</div>
            <div className="mt-2 text-3xl font-extrabold">{stat.value}</div>
          </div>
        ))}
        <div className="flex items-center justify-between gap-4 p-6 text-white shadow-md rounded-2xl bg-gradient-to-br from-emerald-400 to-green-300">
          <div>
            <div className="text-xs opacity-80">Completion</div>
            <div className="text-sm opacity-90">{formatNice(selectedDate)}</div>
          </div>
          <ProgressWheel percent={dayPercent} />
        </div>
      </section>

      {/* Left Sidebar */}
      <section className="flex flex-wrap justify-around gap-5">
        {/* Add Habit Trigger */}
        <div className="h-32 p-6 border shadow-sm rounded-2xl bg-card">
          <h2 className="mb-2 text-lg font-semibold">Habits</h2>
          <button onClick={() => setShowHabitForm(true)} className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground">
            + Add Habit
          </button>
        </div>

        {/* Habits List */}
        <div className="p-6 border shadow-sm rounded-2xl bg-card">
          <h2 className="mb-3 text-lg font-semibold">Habits for {formatNice(selectedDate)}</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            <button onClick={() => setSelectedCategory("All")} className={`px-3 py-1.5 rounded-full ${selectedCategory === "All" ? "bg-primary text-white" : "bg-muted"}`}>All</button>
            {categories.map((c) => (
              <button key={c} onClick={() => setSelectedCategory(c)} className={`px-3 py-1.5 rounded-full ${selectedCategory === c ? "bg-primary text-white" : "bg-muted"}`}>
                {c}
              </button>
            ))}
          </div>
          <ul className="space-y-3">
            {habitsForSelectedDate.length ? (
              habitsForSelectedDate.map((h) => {
                const streak = h.streak;
                return (
                  <li key={h._id} className="flex items-center justify-between p-4 border rounded-xl">
                    <div className="flex items-center gap-3">
                      <label className="relative flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          disabled={new Date(selectedDate) > new Date()}
                          checked={h.history?.some(entry => entry.date.slice(0, 10) === selectedDate && entry.ifCompleted) || false}
                          onChange={(e) => markDoneForSelected(h._id, e.target.checked, selectedDate)}
                          className="absolute w-0 h-0 opacity-0 peer"
                        />
                        <span className={`flex items-center justify-center w-6 h-6 mr-2 border-2 rounded-lg ${new Date(selectedDate) > new Date() ? "border-gray-300 bg-gray-200 cursor-not-allowed" : "border-gray-300 peer-checked:bg-primary peer-checked:border-primary"}`} />
                      </label>
                      <div>
                        <div className="font-medium">{h.habitName}</div>
                        <div className="text-xs text-foreground/60">Category: {h.category} | Streak: {streak}d</div>
                      </div>
                    </div>
                  </li>
                );
              })
            ) : (
              <p className="text-sm text-foreground/50">No habits scheduled for this day.</p>
            )}
          </ul>
        </div>

        {/* Monthly Calendar */}
        <MonthCalendar selected={selectedDate} onSelect={setSelectedDate} />
      </section>

      {/* Right Sidebar */}
      <section className="p-6 text-center border shadow-sm rounded-2xl bg-card text-foreground/60">
        📊 Use categories to organize your habits. Add new ones directly inside the habit form.
      </section>

      {/* HabitForm Modal */}
      {showHabitForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-lg p-6 shadow-lg bg-card rounded-2xl">
            <button onClick={() => setShowHabitForm(false)} className="absolute text-gray-500 top-3 right-3 hover:text-gray-800">✕</button>
            <HabitForm onSubmit={() => setShowHabitForm(false)} onCancel={() => setShowHabitForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
