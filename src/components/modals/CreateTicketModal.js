import React, { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";


const host = process.env.REACT_APP_host;

const AddTicketModal = ({ showModal, setShowModal, onTicketCreated }) => {
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientNumber: "",
    description: "",
    status: "Pending",
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes for each field
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Validate and send a POST request to create a new ticket
  const handleCreateTicket = async () => {
    // Basic validation: Name, Number, and Description are required.
    if (
      !formData.clientName.trim() ||
      !formData.clientNumber.trim() ||
      !formData.description.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }
    setCreating(true);
    setError("");
    try {
      const response = await axios.post(
        `${host}/api/v1/ticket/create`,
        formData,
        { withCredentials: true }
      );
      // Optionally, call a callback to update the ticket list in your parent component
      if (onTicketCreated) {
        onTicketCreated(response.data.data);
      }
      // Clear the form and close the modal
      setFormData({
        clientName: "",
        clientEmail: "",
        clientNumber: "",
        description: "",
        status: "Pending",
      });
      setShowModal(false);
    } catch (err) {
      console.error("Error creating ticket:", err);
      setError("Failed to create ticket. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  if (!showModal) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-40 bg-black/50 backdrop-blur-sm bg-opacity-50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white w-full max-w-2xl h-[500px] rounded-lg shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-lg font-semibold">Add Ticket</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close add ticket modal"
          >
            <X size={24} />
          </button>
        </div>
        {/* Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name *
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                placeholder="Enter client name"
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Email
              </label>
              <input
                type="email"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleInputChange}
                placeholder="Enter client email"
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Number *
              </label>
              <input
                type="text"
                name="clientNumber"
                value={formData.clientNumber}
                onChange={handleInputChange}
                placeholder="Enter client number"
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter ticket description"
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm h-22"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <input
              type="text"
              value={formData.status}
              disabled
              className="w-full border rounded-md p-2 text-sm bg-gray-100 focus:outline-none"
            />
          </div>
        </div>
        {/* Footer / Action Buttons */}
        <div className="border-t p-4 flex justify-end gap-4">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateTicket}
            disabled={creating}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            {creating ? "Creating..." : "Create Ticket"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTicketModal;
