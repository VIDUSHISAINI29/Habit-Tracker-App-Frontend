import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const [formData, setFormData] = useState({name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData.name, formData.email, formData.password);
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 border border-gray-200 shadow-2xl rounded-3xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg dark:border-gray-800"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 6 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="inline-flex items-center justify-center w-16 h-16 font-bold text-white shadow-lg rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500"
          >
            HF
          </motion.div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Join HabitFlow
          </h1>
          <p className="mt-1 text-sm text-center text-gray-500 dark:text-gray-400">
            Create your account and start building streaks 🚀
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
             {/* Name */}
          <div className="relative">
            <User className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full py-3 pl-10 pr-4 text-gray-900 transition border border-gray-300 shadow-sm outline-none rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 hover:shadow-md"
              required
            />
          </div>
          {/* Email */}
          <div className="relative">
            <Mail className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full py-3 pl-10 pr-4 text-gray-900 transition border border-gray-300 shadow-sm outline-none rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 hover:shadow-md"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full py-3 pl-10 pr-10 text-gray-900 transition border border-gray-300 shadow-sm outline-none rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 hover:shadow-md"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute text-gray-400 right-3 top-3 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 font-semibold text-white transition shadow-lg rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 focus:ring-4 focus:ring-pink-300 dark:focus:ring-pink-800"
          >
            Register
          </motion.button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-purple-600 transition hover:text-pink-500"
          >
            Log In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
