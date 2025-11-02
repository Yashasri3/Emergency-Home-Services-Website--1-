import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";



const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export function LandingPage({ onLoginSuccess }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("user");
  const [occupation, setOccupation] = useState("");

  // ✅ Signup Handler
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.currentTarget;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;

    try {
  const res = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, occupation }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Account created! Please log in.");
      form.reset();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Login Handler
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.currentTarget;
    const email = form.email.value;
    const password = form.password.value;

    try {
  const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("userOccupation", data.occupation || "");

      toast.success(`Welcome back, ${data.name}!`);
      onLoginSuccess(data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-center text-blue-600">
          Emergency Home Services
        </h1>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Signup</TabsTrigger>
          </TabsList>

          {/* LOGIN */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <Input name="email" type="email" placeholder="Email" required />
              <Input name="password" type="password" placeholder="Password" required />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </TabsContent>

          {/* SIGNUP */}
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <Input name="name" placeholder="Full Name" required />
              <Input name="email" type="email" placeholder="Email" required />
              <Input name="password" type="password" placeholder="Password" required />

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Select Role</label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="worker">Worker</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {role === "worker" && (
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Occupation</label>
                  <Select value={occupation} onValueChange={setOccupation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Occupation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electrician">Electrician</SelectItem>
                      <SelectItem value="Plumber">Plumber</SelectItem>
                      <SelectItem value="Carpenter">Carpenter</SelectItem>
                      <SelectItem value="Painter">Painter</SelectItem>
                      <SelectItem value="Mechanic">Mechanic</SelectItem>
                      <SelectItem value="Cleaner">Cleaner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Signup"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
