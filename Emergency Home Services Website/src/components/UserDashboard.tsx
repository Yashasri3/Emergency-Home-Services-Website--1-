import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";

export function UserDashboard({ user, onLogout }: any) {
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
  const [services, setServices] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/services`)
      .then((r) => r.json())
      .then(setServices)
      .catch(() => toast.error("Failed to load services"));
  }, []);

  const loadWorkers = async (occupation: string) => {
    setSelectedService(occupation);
    const res = await fetch(
      `${API_BASE}/api/workers?occupation=${occupation}`
    );
    setWorkers(await res.json());
  };

  const sendRequest = async (worker: any) => {
    if (!booking?.date || !booking?.payment) {
      toast.error("Please select booking details first.");
      return;
    }

    const details = {
      workerEmail: worker.email,
      serviceType: worker.occupation,
      description: booking.description || "Home service request",
      location: booking.location || "Hyderabad",
      date: booking.date,
      payment: booking.payment,
    };

    try {
      const res = await fetch(`${API_BASE}/api/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(details),
      });
      if (res.ok) {
        toast.success("Request sent successfully!");
        setBooking(null);
      } else toast.error("Failed to send request");
    } catch {
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">
          Welcome, {user.name}
        </h1>
        <Button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Logout
        </Button>
      </div>

      {!selectedService && (
        <>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Available Services
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {services.map((s) => (
              <Card
                key={s.id}
                className="cursor-pointer hover:shadow-lg transition-all border border-gray-200"
                onClick={() => loadWorkers(s.id)}
              >
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <span className="text-4xl mb-2">{s.icon}</span>
                  <p className="font-medium text-gray-700">{s.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {selectedService && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              {services.find((s) => s.id === selectedService)?.name} Workers
            </h2>
            <Button variant="outline" onClick={() => setSelectedService(null)}>
              ← Back
            </Button>
          </div>

          {workers.length === 0 ? (
            <p className="text-gray-500">No workers available yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {workers.map((w) => (
                <Card key={w.email} className="p-4 shadow-md border">
                  <p className="font-semibold text-blue-700">{w.name}</p>
                  <p className="text-sm text-gray-600 mb-3 capitalize">
                    {w.occupation}
                  </p>
                  <div className="space-y-2 mb-3">
                    <Input
                      type="datetime-local"
                      onChange={(e) =>
                        setBooking({ ...booking, date: e.target.value })
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Payment amount (₹)"
                      onChange={(e) =>
                        setBooking({ ...booking, payment: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Location"
                      onChange={(e) =>
                        setBooking({ ...booking, location: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Short Description"
                      onChange={(e) =>
                        setBooking({ ...booking, description: e.target.value })
                      }
                    />
                  </div>
                  <Button
                    onClick={() => sendRequest(w)}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                  >
                    Send Request
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
