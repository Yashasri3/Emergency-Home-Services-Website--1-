import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { toast } from "sonner";

export function LoginSignupPage({ onLoginSuccess }: { onLoginSuccess: (data: any) => void }) {
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    occupation: "",
  });
  const [occupations, setOccupations] = useState([]);
  const [isSendingReset, setIsSendingReset] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/services`)
      .then((r) => r.json())
      .then(setOccupations)
      .catch(() => toast.error("Failed to load services"));
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const endpoint = isLogin ? "/api/login" : "/api/register";

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error");

      if (isLogin) {
        toast.success("Login successful!");
        onLoginSuccess(data);
      } else {
        toast.success("Signup successful! You can now log in.");
        setIsLogin(true);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const requestResetCode = async () => {
    if (!form.email) {
      toast.error("Please enter your email first");
      return;
    }
    setIsSendingReset(true);
    try {
      const res = await fetch(`${API_BASE}/api/request-reset-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send reset code");
      toast.success("Reset code sent to your email");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8 space-y-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-blue-700">
          {isLogin ? "Login to Continue" : "Create an Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <Input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          )}
          <Input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          {isLogin && (
            <div className="-mt-2 mb-2 text-right">
              <button
                type="button"
                onClick={requestResetCode}
                disabled={isSendingReset}
                className="text-sm text-blue-600 hover:underline disabled:opacity-60"
              >
                {isSendingReset ? "Sending..." : "Forgot password? Send reset code"}
              </button>
            </div>
          )}

          {!isLogin && (
            <>
              <Select
                value={form.role}
                onValueChange={(v) => setForm({ ...form, role: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="worker">Worker</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>

              {form.role === "worker" && (
                <Select
                  value={form.occupation}
                  onValueChange={(v) => setForm({ ...form, occupation: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Occupation" />
                  </SelectTrigger>
                  <SelectContent>
                    {occupations.map((o: any) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.icon} {o.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLogin ? "Login" : "Signup"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500">
          {isLogin ? "Don't have an account?" : "Already registered?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline"
          >
            {isLogin ? "Sign up here" : "Login here"}
          </button>
        </p>
      </div>
    </div>
  );
}
