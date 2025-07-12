import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../../Hooks/useAuth";

const AdoptionRequestsDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // ✅ Fetch adoption requests for the current user's pets
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["adoption-requests", user?.uid],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3000/adoptions/owner/${user?.uid}`);
      return res.data;
    },
    enabled: !!user?.uid,
  });

  // ✅ Mutation to update request status and pet adoption state
  const updateRequestMutation = useMutation({
    mutationFn: async ({ requestId, petId, action }) => {
      if (action === "accepted") {
        // Accept request and mark pet as adopted
        await axios.patch(`http://localhost:3000/adoptions/${requestId}/accept`);
        await axios.patch(`http://localhost:3000/pets/${petId}`, { adopted: true });
      } else if (action === "rejected") {
        // Reject request only
        await axios.patch(`http://localhost:3000/adoptions/${requestId}/reject`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adoption-requests", user?.uid]);
    },
  });

  const handleAction = (requestId, petId, action) => {
    updateRequestMutation.mutate({ requestId, petId, action });
  };

  if (isLoading) return <p className="text-center py-6">Loading adoption requests...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Adoption Requests for Your Pets</h2>
      {requests.length === 0 ? (
        <p className="text-gray-500">No adoption requests yet.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const status = req.status || "pending";

            return (
              <div key={req._id} className="border rounded-lg p-4 shadow-sm bg-white">
                <p><strong>Pet:</strong> {req.pet?.name || "Unknown Pet"}</p>
                <p><strong>Requested By:</strong> {req.userEmail}</p>
                <p><strong>Status:</strong> {status}</p>

                {status === "pending" && (
                  <div className="mt-2 space-x-3">
                    <button
                      onClick={() => handleAction(req._id, req.petId, "accepted")}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      disabled={updateRequestMutation.isPending}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleAction(req._id, req.petId, "rejected")}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      disabled={updateRequestMutation.isPending}
                    >
                      Reject
                    </button>
                  </div>
                )}

                {status === "accepted" && (
                  <p className="text-green-600 mt-2 font-semibold">Accepted</p>
                )}
                {status === "rejected" && (
                  <p className="text-red-600 mt-2 font-semibold">Rejected</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdoptionRequestsDashboard;
