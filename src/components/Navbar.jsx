import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
const navLinks = [
  { to: "/", label: "Dashboard" },
  // { to: "/feed", label: "Feed" },
  // { to: "/leaderboard", label: "Leaderboard" },
];

const Navbar = () => {
  const {user, logout} = useContext(AuthContext);
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-md dark:bg-background/70 border-border">
      <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.span
            className="inline-flex items-center justify-center w-10 h-10 font-bold text-white shadow-lg rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500"
            whileHover={{ scale: 1.1, rotate: 6 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            HF
          </motion.span>
          <span className="text-xl font-extrabold tracking-tight text-foreground">
            HabitFlow
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="items-center hidden gap-6 md:flex">
          {navLinks.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`relative text-sm font-medium transition-colors duration-300 ${
                pathname === n.to
                  ? "text-primary"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {n.label}
              {/* underline hover animation */}
              <span
                className={`absolute left-0 -bottom-1 h-[2px] rounded-full transition-all duration-500 ${
                  pathname === n.to ? "w-full bg-primary" : "w-0 bg-primary group-hover:w-full"
                }`}
              ></span>
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="relative flex items-center gap-4">
          {/* Profile Menu */}
          {user && (
            <div className="relative">
              <button
                className="p-2 transition rounded-full hover:bg-muted"
                onClick={() => setProfileMenuOpen((prev) => !prev)}>
                <User className="w-6 h-6 text-foreground" />
              </button>

              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 w-48 py-2 mt-3 bg-white border shadow-xl dark:bg-background border-border rounded-xl"
                  >
                    {/* <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm transition rounded-md hover:bg-muted/60"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <User className="w-4 h-4" /> View Profile
                    </Link> */}
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        logout();
                      }}
                      className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left transition rounded-md hover:bg-muted/60"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="p-2 transition rounded-md md:hidden hover:bg-muted"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav - Slide from Right */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="fixed inset-y-0 right-0 z-40 flex flex-col w-64 p-6 bg-white border-l shadow-2xl dark:bg-background border-border"
          >
            <button
              className="self-end p-2 mb-6 rounded-md hover:bg-muted"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
            {navLinks.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={`block mb-3 text-lg font-medium transition-all ${
                  pathname === n.to
                    ? "text-primary"
                    : "text-foreground/70 hover:text-foreground"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {n.label}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
