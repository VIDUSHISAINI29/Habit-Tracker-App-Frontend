import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
const Login = () => {
  const {user, login} = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    console.log("Logging in:", formData);
    login(formData.email, formData.password);    
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 border border-gray-200 shadow-2xl rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg dark:border-gray-800"
      >
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-8">
          {/* HF Logo */}
          <motion.div
            initial={{ rotate: -5 }}
            animate={{ rotate: 0 }}
            whileHover={{ rotate: 5, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="inline-flex items-center justify-center w-16 h-16 font-bold text-white shadow-lg rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500"
          >
            HF
          </motion.div>
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Log in to continue building your streaks 🚀
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 outline-none py-2.5 border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
              required
            />
          </div>

          {/* Password */}
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

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 font-semibold text-white transition rounded-lg shadow-md bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-pink-500 focus:ring-4 focus:ring-pink-300 dark:focus:ring-pink-800"
          >
            Log In
          </motion.button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-purple-600 transition hover:text-pink-500"
          >
            Register
          </Link>
        </div>

        {/* Optional Social Login */}
        <div className="flex gap-4 mt-6">
          <button className="flex-1 py-2 text-sm font-medium text-white transition bg-blue-500 rounded-lg shadow-md hover:bg-blue-600">
            Continue with Google
          </button>
          <button className="flex-1 py-2 text-sm font-medium text-white transition bg-gray-800 rounded-lg shadow-md hover:bg-gray-900">
            Continue with GitHub
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
