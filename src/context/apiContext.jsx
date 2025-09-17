import React, {useState, useContext, createContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import axios from 'axios';

export const ApiContext = createContext(null);

export const ApiProvider = ({children}) => {
  const {user, token} = useContext(AuthContext);
    const API = import.meta.env.VITE_BACKEND_URL;

    const createHabit = async(userId, habitName, habitDates, category) => {
        try {
            const res = await axios.post(`${API}/create-habit`, {userId, habitName, habitDates, category});
            //  console.log('habit created', res.data.habit);
        } catch (error) {
            console.error("Create habit error:", error.response?.data?.message || error.message);
            throw error;
        }
    };


    const getCategories = async(userId) => {
        try {
              const res = await axios.get(`${API}/get-categories/${userId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
            //  console.log('categories ', res.data.categories);
              return res;
        } catch (error) {
            console.error("Get categories error:", error.response?.data?.message || error.message);
            throw error;
        }
    };


    const getHabitsForDate = async() => {
        try {
              const res = await axios.get(`${API}/get-habits`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
             console.log('habits ', res.data.habits);
              return res;
        } catch (error) {
            console.error("Get Habits by date error:", error.response?.data?.message || error.message);
            throw error;
        }
    };


  const updateHabitStatus = async (habitId,  {date, ifCompleted }) => {
  try {
    const res = await axios.patch(
      `${API}/update-habit/${habitId}`,
      { date, ifCompleted },  // ✅ match backend
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("updated Habit ", res.data.updatedHabit);
    return res;
  } catch (error) {
    console.error("update habit error:", error.response?.data?.message || error.message);
    throw error;
  }
};


  const markDoneForStreak = async (habitId, date) => {
  try {
    const res = await axios.post(
      `${API}/mark-habit-done/${habitId}`,
      { date },  // ✅ match backend
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("streak of habit ", res.data.habit);
    return res;
  } catch (error) {
    console.error("mark done habit error:", error.response?.data?.message || error.message);
    throw error;
  }
};


     return (
        <ApiContext.Provider value={{ createHabit, getCategories, getHabitsForDate, updateHabitStatus, markDoneForStreak }}>
          {children}
        </ApiContext.Provider>
      );
    
}