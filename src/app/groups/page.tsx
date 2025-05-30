"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";

import isAuth from "@/components/isAuth";
import { useAppDispatch } from "@/redux/hooks";
import { joinGroup } from "@/redux/slice/joinGroup/joinGroupSlice";
import { updateGroupAccessStatus } from "@/redux/slice/chatGroup/chatGroupSlice";
import { RootState } from "@/redux/store/store";

const ChatGroupPage = () => {
  const [joiningGroupId, setJoiningGroupId] = useState<number | null>(null);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const chatGroups = useSelector(
    (state: RootState) => state.chatGroup.chatGroupData
  );
  const { loading, error } = useSelector((state: RootState) => state.joinGroup);
  const loggedInUser = useSelector(
    (state: RootState) => state.user.loggedInUser
  );

  const handleJoinGroup = async (groupId: number) => {
    if (!loggedInUser || !groupId) return;

    setJoiningGroupId(groupId);

    const result = await dispatch(joinGroup({ loggedInUser, groupId }));

    let statusMessage;
    if (joinGroup.fulfilled.match(result)) {
      statusMessage = result.payload;

      if (statusMessage === "Already a member") {
        router.push(`/groups/${groupId}`);
      } else if (statusMessage === "Request sent") {
        toast.success("Request sent");
        dispatch(updateGroupAccessStatus({ groupId, newStatus: "PENDING" }));
      }
    } else {
      toast.error(statusMessage);
    }

    setJoiningGroupId(null);
  };

  if (error) {
    throw new Error(error);
  }

  const getButtonText = (access?: string) => {
    switch (access?.toUpperCase()) {
      case "ALLOWED":
        return "Open Chat";
      case "PENDING":
        return "Request Pending...";
      default:
        return "Request to join";
    }
  };

  const isButtonDisabled = (grpId: number, access?: string) =>
    joiningGroupId === grpId || access?.toUpperCase() === "PENDING";

  return (
    <div className="p-6 max-w-md h-screen mx-auto bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Available Chat Groups
      </h2>

      <div className="space-y-4">
        {chatGroups.length > 0 ? (
          chatGroups.map((grp) => (
            <div
              key={grp.id}
              className="flex items-center justify-between bg-white shadow-sm border border-gray-200 rounded-2xl px-5 py-4 hover:shadow-md transition-transform hover:-translate-y-1"
            >
              <span className="text-lg font-medium text-gray-700">
                {grp.name}
              </span>

              <button
                disabled={isButtonDisabled(grp.id, grp.activeAccess)}
                onClick={() => handleJoinGroup(grp.id)}
                className={`${
                  isButtonDisabled(grp.id, grp.activeAccess)
                    ? "cursor-not-allowed opacity-40"
                    : ""
                } w-40 px-4 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm rounded-full font-medium hover:from-blue-600 hover:to-indigo-600 transition flex items-center justify-center gap-2`}
              >
                {joiningGroupId === grp.id && loading ? (
                  <>
                    <FaSpinner className="animate-spin h-4 w-4" />
                    <span>loading...</span>
                  </>
                ) : (
                  <span>{getButtonText(grp.activeAccess)}</span>
                )}
              </button>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No groups available
          </div>
        )}
      </div>
    </div>
  );
};

export default isAuth(ChatGroupPage);
