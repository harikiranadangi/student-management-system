import { useState, useEffect } from "react";
import { MessageType } from "../../types";
import { getMessageContent } from "@/lib/utils/messageUtils";

const MessageComponent = () => {
  const [studentName, setStudentName] = useState<string>("");
  const [className, setClassName] = useState<string>(""); 
  const [announcementType, setAnnouncementType] = useState<MessageType>("ABSENT");
  const [messageContent, setMessageContent] = useState<string>("");

  // Update the message content when the type or student details change
  useEffect(() => {
    const student = { name: studentName, className };
    const generatedMessage = getMessageContent(announcementType, student);
    setMessageContent(generatedMessage);
  }, [announcementType, studentName, className]); // Re-run when any of these dependencies change

  // Handle form submission for creating a message (this will be connected to your backend API)
  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageContent,
          type: announcementType,
          studentId: "someStudentId", // Adjust as per your logic
          classId: "someClassId", // Adjust as per your logic
          date: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Message successfully created!");
      } else {
        alert("Failed to create message");
      }
    } catch (error) {
      console.error("Error submitting message:", error);
      alert("Error submitting message");
    }
  };

  return (
    <div className="p-4">
      <h2>Message Generator</h2>
      
      {/* Student Details Form */}
      <div className="my-2">
        <label>Student Name: </label>
        <input
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Enter student name"
          className="border p-2"
        />
      </div>

      <div className="my-2">
        <label>Grade: </label>
        <input
          type="text"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder="Enter grade"
          className="border p-2"
        />
      </div>

      {/* Announcement Type Selection */}
      <div className="my-2">
        <label>Message Type: </label>
        <select
          value={announcementType}
          onChange={(e) => setAnnouncementType(e.target.value as MessageType)}
          className="border p-2"
        >
          <option value="ABSENT">Absent</option>
          <option value="FEE_RELATED">Fee Related</option>
          <option value="HOLIDAY_RELATED">Holiday Related</option>
          <option value="GENERAL">General</option>
        </select>
      </div>

      {/* Message Display Section */}
      <div className="my-2">
        <label>Generated Message: </label>
        <textarea
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)} // Allow users to edit the message
          placeholder="Generated message will appear here"
          className="border p-2 w-full h-32"
        />
      </div>

      <div className="my-2">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Submit Message
        </button>
      </div>

      {/* Display Generated Message */}
      {messageContent && (
        <div className="mt-4">
          <h3>Generated Message:</h3>
          <p>{messageContent}</p>
        </div>
      )}
    </div>
  );
};

export default MessageComponent;
