"use client";
import { RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";

const ChatGroupPage = () => {
  const chatGroups = useSelector(
    (state: RootState) => state.chatGroup.chatGroupData
  );

  return (
    <div className="p-6 max-w-md h-screen mx-auto bg-gray-50">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Available Chat Groups
      </h2>
      <div className="space-y-4">
        {chatGroups.map((grp) => (
          <div
            key={grp.id}
            className="flex items-center justify-between bg-white shadow-sm border border-gray-200 rounded-2xl px-5 py-4 hover:shadow-md transition-transform hover:-translate-y-1"
          >
            <span className="text-lg font-medium text-gray-700">
              {grp.name}
            </span>
            <button className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm rounded-full font-medium hover:from-blue-600 hover:to-indigo-600 transition">
              Join
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatGroupPage;
