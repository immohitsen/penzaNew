import React, { useState } from "react";

const initialCustomers = [
  { id: "#790841", name: "Carson Darrin", location: "Hong Kong, China", orders: 30, spent: "$300", status: "Complete" },
  { id: "#790842", name: "Ashy Handgun", location: "Ohio, USA", orders: 10, spent: "$230", status: "Pending" },
  { id: "#798699", name: "Adeline Ballard", location: "Madrid, Spain", orders: 50, spent: "$500", status: "Cancelled" },
];

const CustomerTable = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    id: "",
    name: "",
    location: "",
    orders: "",
    spent: "",
    status: "Complete", // Default status
  });

  // Handle editing a customer
  const handleEdit = (customerId) => {
    alert(`Editing customer with ID: ${customerId}`);
    // You would typically show a modal or redirect to an edit page
  };

  // Handle deleting a customer
  const handleDelete = (customerId) => {
    const updatedCustomers = customers.filter(customer => customer.id !== customerId);
    setCustomers(updatedCustomers);
    alert(`Customer with ID: ${customerId} deleted`);
  };

  // Handle adding a new customer
  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.location || !newCustomer.orders || !newCustomer.spent) {
      alert("Please fill in all fields.");
      return;
    }
    const newCustomerWithId = { ...newCustomer, id: `#${Math.floor(Math.random() * 1000000)}` };
    setCustomers([...customers, newCustomerWithId]);
    setNewCustomer({ id: "", name: "", location: "", orders: "", spent: "", status: "Complete" });
    setShowAddCustomerModal(false);
    alert("New customer added!");
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-800">Customer List</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={() => setShowAddCustomerModal(true)}
        >
          + Add Customer
        </button>
      </div>

      {/* Customer Table */}
      <table className="w-full text-left text-sm border border-gray-200 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Id</th>
            <th className="px-4 py-2">Customer Name</th>
            <th className="px-4 py-2">Location</th>
            <th className="px-4 py-2">Orders</th>
            <th className="px-4 py-2">Spent</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-2">{customer.id}</td>
              <td className="px-4 py-2">{customer.name}</td>
              <td className="px-4 py-2">{customer.location}</td>
              <td className="px-4 py-2">{customer.orders}</td>
              <td className="px-4 py-2">{customer.spent}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    customer.status === "Complete"
                      ? "bg-green-100 text-green-800"
                      : customer.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {customer.status}
                </span>
              </td>
              <td className="px-4 py-2">
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => handleEdit(customer.id)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500 ml-2 hover:underline"
                  onClick={() => handleDelete(customer.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Adding Customer */}
      {showAddCustomerModal && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setShowAddCustomerModal(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium text-gray-800 mb-2">Add New Customer</h3>
            <form>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  placeholder="Enter customer name"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newCustomer.location}
                  onChange={(e) => setNewCustomer({ ...newCustomer, location: e.target.value })}
                  placeholder="Enter customer location"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Orders</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newCustomer.orders}
                  onChange={(e) => setNewCustomer({ ...newCustomer, orders: e.target.value })}
                  placeholder="Enter number of orders"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Spent</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newCustomer.spent}
                  onChange={(e) => setNewCustomer({ ...newCustomer, spent: e.target.value })}
                  placeholder="Enter total spent"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newCustomer.status}
                  onChange={(e) => setNewCustomer({ ...newCustomer, status: e.target.value })}
                >
                  <option value="Complete">Complete</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  onClick={handleAddCustomer}
                >
                  Add Customer
                </button>
                <button
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  onClick={() => setShowAddCustomerModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerTable;
