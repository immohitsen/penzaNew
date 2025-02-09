import React, { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import userAvatar from "../assets/user.png"; // Adjust the path as needed


const host = process.env.REACT_APP_host;

const ChatModal = ({ showModal, setShowModal, chatTicket }) => {
  const [localChatMessages, setLocalChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [errorSending, setErrorSending] = useState("");

  // When chatTicket changes, update our local chat messages
  useEffect(() => {
    if (chatTicket) {
      setLocalChatMessages(chatTicket.chat || []);
    }
  }, [chatTicket]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setSending(true);
    setErrorSending("");
    try {
      // Prepare the payload using "message" as expected by your API
      const payload = {
        ticketId: chatTicket._id,
        message: newMessage.trim(),
      };

      // Send the new message to your API endpoint
      const response = await axios.post(
        `${host}/api/v1/ticket/chat?id=${chatTicket._id}`,
        payload,
        { withCredentials: true }
      );

      // If the API returns the whole ticket object,
      // extract only the newly added chat message from its chat array.
      const ticketData = response.data.data;
      const sentMessage = ticketData.chat[ticketData.chat.length - 1];

      // Append the new message to the list of messages
      setLocalChatMessages([...localChatMessages, sentMessage]);
      // Clear the input field
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      setErrorSending("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  if (!showModal) return null;

  // Group messages by date. If a message is an object with a createdAt property, use that;
  // otherwise, group it under "Today"
  const groupedMessages = localChatMessages.reduce((groups, message) => {
    let dateKey;
    if (typeof message === "object" && message.createdAt) {
      dateKey = new Date(message.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } else {
      dateKey = "Today";
    }
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
    return groups;
  }, {});

  // Sort the date keys in ascending order
  const sortedDates = Object.keys(groupedMessages).sort((a, b) => {
    if (a === "Today") return -1;
    if (b === "Today") return 1;
    return new Date(a) - new Date(b);
  });

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-40 bg-black/50 backdrop-blur-sm bg-opacity-50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white w-full max-w-2xl h-[500px] rounded-lg shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-lg font-semibold">Ticket Chat</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close chat"
          >
            <X size={24} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto">
          {localChatMessages.length === 0 ? (
            <p className="text-center text-gray-500 text-sm">
              No chat available for this ticket.
            </p>
          ) : (
            sortedDates.map((dateKey) => (
              <div key={dateKey}>
                {/* Date Divider */}
                <div className="flex justify-center my-4">
                  <div className="px-3 py-1 bg-gray-200 rounded-full text-xs text-gray-600">
                    {dateKey}
                  </div>
                </div>
                {groupedMessages[dateKey].map((message, index) => {
                  // Determine message text and time string
                  const messageText =
                    typeof message === "object" && message.text
                      ? message.text
                      : message;
                  const timeString =
                    typeof message === "object" && message.createdAt
                      ? new Date(message.createdAt).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })
                      : "";
                  return (
                    <div key={index} className="flex items-start gap-4 mb-4">
                      <img
                        className="w-8 h-8 rounded-full"
                        src={userAvatar}
                        alt="User Profile"
                      />
                      <div className="flex flex-col w-full max-w-[320px] p-3 border border-gray-200 bg-gray-50 rounded-lg shadow-sm relative">
                        <p className="text-sm text-gray-800">{messageText}</p>
                        {timeString && (
                          <div className="absolute bottom-1 right-1 text-xs text-gray-500">
                            {timeString}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="border-t p-3">
          {errorSending && (
            <p className="text-red-500 text-xs mb-2">{errorSending}</p>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
            <button
              onClick={handleSendMessage}
              disabled={sending}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
