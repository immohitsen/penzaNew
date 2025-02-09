import React from "react";
import { X } from "lucide-react";

const EditTicketModal = ({
  showModal,
  setShowModal,
  formData,
  handleInputChange,
  handleUpdate,
  error,
  isUpdating,
}) => {
  if (!showModal) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white w-full max-w-2xl h-[500px] rounded-lg shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-lg font-semibold">Edit Ticket</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
        {/* Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {error && <div className="text-red-500 text-sm">{error}</div>}
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
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                required
                autoFocus
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
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Number *
              </label>
              <input
                type="tel"
                name="clientNumber"
                value={formData.clientNumber}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="border-t p-4 flex justify-end gap-4">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTicketModal;
