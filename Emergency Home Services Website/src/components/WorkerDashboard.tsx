import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { toast } from "sonner";

export function WorkerDashboard({ user, onLogout }: any) {
  const [requests, setRequests] = useState<any[]>([]);

  const fetchRequests = async () => {
    const res = await fetch("http://localhost:5000/api/requests/worker", {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setRequests(await res.json());
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`http://localhost:5000/api/requests/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ status }),
    });
    toast.success(`Marked as ${status}`);
    fetchRequests();
  };

  const renderList = (status: string) => {
    const list = requests.filter((r) => r.status === status);
    if (list.length === 0) return <p className="text-gray-500">No {status} requests</p>;

    return (
      <div className="grid md:grid-cols-2 gap-4">
        {list.map((r) => (
          <Card key={r._id} className="p-4 shadow-md border">
            <p className="font-semibold text-blue-700">{r.serviceType.toUpperCase()}</p>
            <p className="text-sm text-gray-600 mb-3">Client: {r.userEmail}</p>
            <p className="text-sm text-gray-600 mb-3">{r.description}</p>
            <p className="text-sm text-gray-600 mb-3">Location: {r.location}</p>
            <div className="flex gap-2">
              {status === "pending" && (
                <>
                  <Button onClick={() => updateStatus(r._id, "active")}>Accept</Button>
                  <Button variant="destructive" onClick={() => updateStatus(r._id, "rejected")}>
                    Reject
                  </Button>
                </>
              )}
              {status === "active" && (
                <Button onClick={() => updateStatus(r._id, "completed")}>Mark Complete</Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Worker Dashboard</h1>
        <Button onClick={onLogout} className="bg-red-600 hover:bg-red-700 text-white">
          Logout
        </Button>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md mb-4">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">{renderList("pending")}</TabsContent>
        <TabsContent value="active">{renderList("active")}</TabsContent>
        <TabsContent value="completed">{renderList("completed")}</TabsContent>
      </Tabs>
    </div>
  );
}
