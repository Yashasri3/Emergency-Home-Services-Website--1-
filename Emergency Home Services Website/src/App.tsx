import { useState } from "react";
import { LoginSignupPage } from "./components/LoginSignupPage";
import { UserDashboard } from "./components/UserDashboard";
import { WorkerDashboard } from "./components/WorkerDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { Toaster } from "sonner";
import { Button } from "./components/ui/button";

export default function App() {
  const [userData, setUserData] = useState<any>(
    localStorage.getItem("token")
      ? {
          token: localStorage.getItem("token"),
          name: localStorage.getItem("userName"),
          email: localStorage.getItem("userEmail"),
          role: localStorage.getItem("userRole"),
          occupation: localStorage.getItem("userOccupation"),
        }
      : null
  );

  const handleLoginSuccess = (data: any) => {
    setUserData(data);
    localStorage.setItem("token", data.token);
    localStorage.setItem("userEmail", data.email);
    localStorage.setItem("userName", data.name);
    localStorage.setItem("userRole", data.role);
    localStorage.setItem("userOccupation", data.occupation || "");
  };

  const handleLogout = () => {
    localStorage.clear();
    setUserData(null);
  };

  // Show login/signup if not logged in
  if (!userData) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#e0f2fe,_#ffffff,_#dbeafe)] flex items-center justify-center">
        <LoginSignupPage onLoginSuccess={handleLoginSuccess} />
        <Toaster position="top-right" richColors />
      </div>
    );
  }

  // Dashboard for logged-in users
  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top_left,_#f0f9ff,_#ffffff,_#dbeafe)] animate-gradient-slow">
      <div className="flex-1">
        {userData.role === "admin" ? (
          <AdminDashboard user={userData} onLogout={handleLogout} />
        ) : userData.role === "worker" ? (
          <WorkerDashboard user={userData} onLogout={handleLogout} />
        ) : (
          <UserDashboard user={userData} onLogout={handleLogout} />
        )}
      </div>

      {/* Persistent Reset Footer */}
      <footer className="text-center py-4 border-t bg-white/70 backdrop-blur-sm">
        <Button
          variant="outline"
          className="text-gray-600 hover:text-red-600 transition-all duration-200"
          onClick={handleLogout}
        >
          🔄 Reset Session
        </Button>
      </footer>

      <Toaster position="top-right" richColors />
    </div>
  );
}
