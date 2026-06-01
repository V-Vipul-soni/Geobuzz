import { Toaster } from "@/components/ui/sonner";
import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import "./index.css";
import Header from "./components/custom/Header.jsx";
import { HelmetProvider } from "react-helmet-async";
import { DarkModeProvider } from "./context/DarkModeContext";

// Lazy loading components
const App = lazy(() => import("./App.jsx"));
const CreateTrip = lazy(() => import("./create-trip/index.jsx"));
const MyTrips = lazy(() => import("./my-trips/index.jsx"));
const Viewtrip = lazy(() => import("./view-trip/[tripid]/index.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

import React from "react";
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-purple-50 flex flex-col items-center justify-center px-4 text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-200">
            <span className="text-white text-3xl">✈️</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Something went wrong</h1>
          <p className="text-gray-500 text-base max-w-sm mb-8">
            GeoBuzz hit an unexpected error. Don't worry — your trips are safe in the cloud.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity shadow-lg shadow-violet-200 text-base"
          >
            🔄 Reload App
          </button>
          <p className="text-gray-400 text-xs mt-6 font-mono">{this.state.error?.toString()}</p>
        </div>
      );
    }
    return this.props.children;
  }
}


const Layout = () => (
  <ErrorBoundary>
    <Header />
    <Suspense fallback={
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-medium">Loading...</p>
      </div>
    }>
      <Outlet />
    </Suspense>
  </ErrorBoundary>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "",            element: <App /> },
      { path: "create-trip", element: <CreateTrip /> },
      { path: "view-trip/:tripId", element: <Viewtrip /> },
      { path: "my-trips",    element: <MyTrips /> },
      { path: "*",           element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <DarkModeProvider>
          <Toaster />
          <RouterProvider router={router} />
        </DarkModeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>
);
