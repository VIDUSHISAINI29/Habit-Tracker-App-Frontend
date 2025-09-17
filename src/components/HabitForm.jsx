import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { ApiContext } from "../context/apiContext";

const HabitForm = ({ onCancel }) => {
  const { user } = useContext(AuthContext);
  const { createHabit, getCategories } = useContext(ApiContext);

  const [habitName, setHabitName] = useState("");
  const [habitDates, setHabitDates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  // ✅ NEW: repeat option (Daily / Weekly / Custom)
  const [repeatType, setRepeatType] = useState("custom");
  const [weeksToGenerate, setWeeksToGenerate] = useState(4); // default: generate 4 weeks of dates

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories(user._id);
        if (res.data?.categories) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, [user._id, getCategories]);

  // ✅ Auto-generate dates based on repeatType
  useEffect(() => {
    if (repeatType === "daily") {
      generateDailyDates();
    } else if (repeatType === "weekly") {
      generateWeeklyDates();
    } else {
      setHabitDates([]); // custom handled manually
    }
  }, [repeatType, weeksToGenerate]);

  const generateDailyDates = () => {
    const today = new Date();
    const dates = [];
    for (let i = 0; i < weeksToGenerate * 7; i++) {
      const next = new Date(today);
      next.setDate(today.getDate() + i);
      dates.push(next.toISOString().split("T")[0]);
    }
    setHabitDates(dates);
  };

  const generateWeeklyDates = () => {
    const today = new Date();
    const dates = [];
    for (let i = 0; i < weeksToGenerate; i++) {
      const next = new Date(today);
      next.setDate(today.getDate() + i * 7);
      dates.push(next.toISOString().split("T")[0]);
    }
    setHabitDates(dates);
  };

  // ✅ Custom date adding
  const handleDateChange = (e) => {
    const date = e.target.value;
    if (date && !habitDates.includes(date)) {
      setHabitDates((prev) => [...prev, date]);
    }
  };

  const removeDate = (date) => {
    setHabitDates((prev) => prev.filter((d) => d !== date));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalCategory = customCategory.trim() || selectedCategory;

    if (!habitName || !finalCategory) {
      alert("Please add a habit name and category.");
      return;
    }

    try {
      await createHabit(user._id, habitName, habitDates, finalCategory);
      // reset
      setHabitName("");
      setSelectedCategory("");
      setCustomCategory("");
      setHabitDates([]);
      setRepeatType("custom");
      if (onCancel) onCancel();
    } catch (err) {
      console.error("Error creating habit:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Add a New Habit</h2>

      {/* Habit Name */}
      <div>
        <label className="block mb-1 text-sm font-medium">Habit Name *</label>
        <input
          type="text"
          value={habitName}
          onChange={(e) => setHabitName(e.target.value)}
          placeholder="e.g. Workout, Read book"
          required
          className="w-full px-4 py-2 border rounded-lg bg-background focus:ring focus:ring-primary/50"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block mb-1 text-sm font-medium">Category *</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg bg-background"
        >
          <option value="">-- Select a category --</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <div className="mt-2">
          <input
            type="text"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            placeholder="Or type a new category"
            className="w-full px-4 py-2 border rounded-lg bg-background"
          />
        </div>
      </div>

      {/* Repeat Option */}
      <div>
        <label className="block mb-1 text-sm font-medium">Repeat</label>
        <select
          value={repeatType}
          onChange={(e) => setRepeatType(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg bg-background"
        >
          <option value="custom">Custom (pick dates)</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>

        {(repeatType === "daily" || repeatType === "weekly") && (
          <div className="mt-2">
            <label className="block text-sm font-medium">Generate for Weeks</label>
            <input
              type="number"
              min="1"
              max="12"
              value={weeksToGenerate}
              onChange={(e) => setWeeksToGenerate(Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg bg-background"
            />
          </div>
        )}
      </div>

      {/* Dates (only if custom) */}
      {repeatType === "custom" && (
        <div>
          <label className="block mb-1 text-sm font-medium">Select Dates</label>
          <input
            type="date"
            onChange={handleDateChange}
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-4 py-2 border rounded-lg bg-background"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {habitDates.map((date) => (
              <span
                key={date}
                className="flex items-center gap-2 px-2 py-1 text-sm rounded-lg bg-primary text-primary-foreground"
              >
                {date}
                <button type="button" onClick={() => removeDate(date)}>
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 py-2 font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90"
        >
          Add Habit
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 font-semibold rounded-lg bg-muted text-foreground hover:bg-muted/70"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default HabitForm;
