import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { auth } from "@/service/firebaseConfig";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { MdFlightTakeoff } from "react-icons/md";
import { HiMoon, HiSun } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { useDarkMode } from "@/context/DarkModeContext";

function Header() {
  const [user, setUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isDark, toggleDark } = useDarkMode();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Save relevant info to localStorage for other components
        localStorage.setItem("user", JSON.stringify({
          name: currentUser.displayName,
          email: currentUser.email,
          picture: currentUser.photoURL,
          uid: currentUser.uid
        }));
      } else {
        localStorage.removeItem("user");
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        localStorage.setItem("user", JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          picture: result.user.photoURL,
          uid: result.user.uid
        }));
      }
      setOpenDialog(false);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

  return (
    <div className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/60 dark:border-gray-800/60 shadow-sm flex justify-between items-center px-6 py-3 transition-all duration-300">
      <Link to="/">
        <img src="/logo.svg" alt="GeoBuzz" className="h-[30px]" />
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-3">
        {user ? (
          <>
            <Link to="/create-trip">
              <Button variant="outline" className="rounded-full border-violet-300 text-violet-700 hover:bg-violet-50 hover:border-violet-400 dark:border-violet-500 dark:text-violet-300 dark:hover:bg-violet-950/40 dark:hover:border-violet-400 transition-all">
                Create Trip
              </Button>
            </Link>
            <Link to="/my-trips">
              <Button variant="outline" className="rounded-full border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 dark:border-blue-500 dark:text-blue-300 dark:hover:bg-blue-950/40 dark:hover:border-blue-400 transition-all">
                My Trips
              </Button>
            </Link>
            <Popover>
              <PopoverTrigger asChild>
                <img src={user?.photoURL || "/placeholder.jpg"} referrerPolicy="no-referrer" className="rounded-full h-[35px] w-[35px] cursor-pointer" alt="Profile" />
              </PopoverTrigger>
              <PopoverContent>
                <h2 className="cursor-pointer" onClick={handleSignOut}>Sign Out</h2>
              </PopoverContent>
            </Popover>
          </>
        ) : (
          <Button
            onClick={() => setOpenDialog(true)}
            className="rounded-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white border-0 px-6"
          >
            Sign In
          </Button>
        )}
        <button
          onClick={toggleDark}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          {isDark ? <HiSun className="text-xl" /> : <HiMoon className="text-xl" />}
        </button>
      </div>

      {/* Mobile toggle */}
      <div className="md:hidden flex items-center gap-3">
        <button
          onClick={toggleDark}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          {isDark ? <HiSun className="text-xl" /> : <HiMoon className="text-xl" />}
        </button>
        <button className="md:hidden text-2xl text-gray-700 dark:text-gray-300" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 right-5 bg-white dark:bg-gray-900 shadow-lg dark:shadow-gray-950/50 border dark:border-gray-800 p-4 rounded-xl w-44 z-10 flex flex-col gap-2">
          {user ? (
            <>
              <Link to="/create-trip">
                <Button variant="outline" className="w-full rounded-full">Create Trip</Button>
              </Link>
              <Link to="/my-trips">
                <Button variant="outline" className="w-full rounded-full">My Trips</Button>
              </Link>
              <button onClick={handleSignOut} className="text-sm text-red-500 mt-1 text-left px-1">
                Sign Out
              </button>
            </>
          ) : (
            <Button
              onClick={() => setOpenDialog(true)}
              className="w-full rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white border-0"
            >
              Sign In
            </Button>
          )}
        </div>
      )}

      {/* Sign-in dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogDescription asChild>
              <div className="text-center py-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center mx-auto mb-4">
                  <MdFlightTakeoff className="text-white text-2xl" />
                </div>
                <motion.h2 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="font-extrabold text-xl text-gray-900 dark:text-white mb-1"
                >
                  Sign in to continue
                </motion.h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Access your adventures securely with Google.</p>
                <button
                  onClick={login}
                  className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 transition-all"
                >
                  <FcGoogle className="text-xl" /> Continue with Google
                </button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Header;
