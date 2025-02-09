import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash, MessageSquare } from "lucide-react";
import EditTicketModal from "./modals/EditTicketModal";
import ChatModal from "./modals/ChatModal";
import AddTicketModal from "./modals/CreateTicketModal"; // New import for add ticket modal

const host = process.env.REACT_APP_host;

const TicketTable = () => {
  // State management
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // For editing ticket
  const [filterStatus, setFilterStatus] = useState("All");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deletedTicket, setDeletedTicket] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // For editing tickets
  const [formData, setFormData] = useState({
    _id: "",
    clientName: "",
    clientEmail: "",
    clientNumber: "",
    description: "",
    status: "Pending",
  });

  // For chat functionality
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [chatTicket, setChatTicket] = useState(null);

  // For add ticket functionality
  const [showAddTicketModal, setShowAddTicketModal] = useState(false);

  // Fetch tickets on mount
  useEffect(() => {
    fetchTickets();
  }, []);

  // Filter tickets when status or tickets change
  useEffect(() => {
    filterTickets();
  }, [filterStatus, tickets]);

  // Keyboard navigation for closing modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (showModal) setShowModal(false);
        if (chatModalVisible) setChatModalVisible(false);
        if (showAddTicketModal) setShowAddTicketModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showModal, chatModalVisible, showAddTicketModal]);

  const filterTickets = () => {
    setFilteredTickets(
      filterStatus === "All"
        ? tickets
        : tickets.filter((ticket) => ticket.status === filterStatus)
    );
  };

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${host}/api/v1/ticket/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        {
          withCredentials: true,
        }
      );
      setTickets(response.data.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;

    const ticketToDelete = tickets.find((t) => t._id === id);
    setDeletedTicket(ticketToDelete);

    // Optimistic update
    setTickets(tickets.filter((ticket) => ticket._id !== id));

    try {
      await axios.delete(`${host}/api/v1/ticket/delete?id=${id}`, {
        withCredentials: true,
      });
      setSuccessMessage("Ticket deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting ticket:", error);
      setTickets([...tickets]);
      setError("Failed to delete ticket. Please try again.");
    }
  };

  const openEditModal = (ticket) => {
    setFormData({
      _id: ticket._id,
      clientName: ticket.clientName,
      clientEmail: ticket.clientEmail,
      clientNumber: ticket.clientNumber,
      description: ticket.description,
      status: ticket.status,
    });
    setShowModal(true);
    setError("");
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!formData.clientName?.trim() || !formData.clientNumber?.trim()) {
      setError("Client Name and Client Number are required");
      return;
    }

    setIsUpdating(true);
    setError("");

    const originalTickets = JSON.parse(JSON.stringify(tickets));

    const updatedTickets = tickets.map((t) =>
      t._id === formData._id ? { ...t, ...formData, updatedAt: new Date() } : t
    );
    setTickets(updatedTickets);

    try {
      const { _id, createdAt, ...updateData } = formData;
      await axios.post(`${host}/api/v1/ticket/update?id=${_id}`, updateData, {
        withCredentials: true,
      });
      setShowModal(false);
      setSuccessMessage("Ticket updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error(
        "Error updating ticket:",
        error.response?.data || error.message
      );
      setError("Failed to update ticket. Reverting changes...");
      setTickets(originalTickets);
    } finally {
      setIsUpdating(false);
    }
  };

  // Open chat modal for a ticket
  const openChatModal = (ticket) => {
    setChatTicket(ticket);
    setChatModalVisible(true);
  };

  // Callback when a new ticket is created
  const handleTicketCreated = (newTicket) => {
    setTickets([...tickets, newTicket]);
    setSuccessMessage("Ticket created successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 overflow-x-auto">
      {/* Header and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900">Ticket List</h2>

        {/* Controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          {/* Add Ticket Button */}
          <button
            onClick={() => setShowAddTicketModal(true)}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm whitespace-nowrap"
          >
            Add Ticket
          </button>

          {/* Filter Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            <label className="text-sm font-medium whitespace-nowrap">
              Filter:
            </label>
            <div className="relative w-full sm:w-48">
              <select
                className="w-full border rounded-md px-3 py-1.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      {loading ? (
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="text-center text-gray-500 p-8">
          No tickets found matching the current filter.
        </div>
      ) : (
        <table className="w-full min-w-[800px] text-left text-sm border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Client Name",
                "Email",
                "Number",
                "Description",
                "Status",
                "Created At",
                "Actions",
              ].map((header) => (
                <th key={header} className="px-4 py-3">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr
                key={ticket._id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-3">{ticket.clientName}</td>
                <td className="px-4 py-3">{ticket.clientEmail || "N/A"}</td>
                <td className="px-4 py-3">{ticket.clientNumber}</td>
                <td className="px-4 py-3">{ticket.description}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      ticket.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {new Date(ticket.createdAt).toLocaleDateString("en-IN")}
                </td>
                <td className="px-4 py-3 flex gap-2 justify-center">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => openEditModal(ticket)}
                    aria-label="Edit ticket"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(ticket._id)}
                    aria-label="Delete ticket"
                  >
                    <Trash size={18} />
                  </button>
                  <button
                    className="text-green-500 hover:text-green-700"
                    onClick={() => openChatModal(ticket)}
                    aria-label="Chat ticket"
                  >
                    <MessageSquare size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Global Modals */}
      <EditTicketModal
        showModal={showModal}
        setShowModal={setShowModal}
        formData={formData}
        handleInputChange={handleInputChange}
        handleUpdate={handleUpdate}
        error={error}
        isUpdating={isUpdating}
      />

      <ChatModal
        showModal={chatModalVisible}
        setShowModal={setChatModalVisible}
        chatTicket={chatTicket}
      />

      <AddTicketModal
        showModal={showAddTicketModal}
        setShowModal={setShowAddTicketModal}
        onTicketCreated={handleTicketCreated}
      />

      {/* Notifications */}
      <div className="fixed bottom-4 right-4 space-y-2">
        {successMessage && (
          <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg">
            {successMessage}
          </div>
        )}
        {deletedTicket && (
          <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg flex items-center gap-4">
            <span>Ticket deleted</span>
            <button
              onClick={() => {
                setTickets([...tickets, deletedTicket]);
                setDeletedTicket(null);
              }}
              className="underline hover:text-gray-300"
            >
              Undo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketTable;
