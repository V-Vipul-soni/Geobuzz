import { Link } from "react-router-dom";
import { MdFlightTakeoff } from "react-icons/md";

function Footer() {
  return (
    <div className="mt-10 py-8 border-t border-gray-100">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
            <MdFlightTakeoff className="text-white text-sm" />
          </div>
          <span className="font-bold text-gray-700">GeoBuzz</span>
        </div>
        <p className="text-gray-400 text-sm">Designed by Team59™</p>
        <Link to="/" className="text-sm text-violet-600 hover:text-violet-700 font-medium hover:underline transition-colors">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Footer;
