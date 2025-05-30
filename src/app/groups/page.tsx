"use client";
import isAuth from "@/components/isAuth";
import { useAppDispatch } from "@/redux/hooks";
import { joinGroup } from "@/redux/slice/joinGroup/joinGroupSlice";
import { RootState } from "@/redux/store/store";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { FaSpinner } from "react-icons/fa";
import { useState } from "react";

const ChatGroupPage = () => {
  const [joiningGroupId, setJoiningGroupId] = useState<number | null>(null);
  const chatGroups = useSelector(
    (state: RootState) => state.chatGroup.chatGroupData
  );
  const { loading, error, joinGroupStatus } = useSelector(
    (state: RootState) => state.joinGroup // `chatGroup` should be `joinGroup` if that's how it's registered
  );
  const loggedInUser = useSelector(
    (state: RootState) => state.user.loggedInUser
  );
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleJoinGroup = async (grpID: number | undefined) => {
    if (grpID && loggedInUser) {
      console.log("here", grpID);
      setJoiningGroupId(grpID);
      await dispatch(joinGroup({ loggedInUser, groupId: grpID }));
      // dispatch(fetchPreviousChatsByGroupId({ groupID, loggedInUser }));
      // router.push(`/groups/${groupID}`);
      setJoiningGroupId(null);
    }
  };
  console.log(joiningGroupId);
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
                disabled={joiningGroupId === grp.id}
                onClick={() => handleJoinGroup(grp.id)}
                className="w-40 px-4 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm rounded-full font-medium hover:from-blue-600 hover:to-indigo-600 transition flex items-center justify-center gap-2 "
              >
                {joiningGroupId === grp.id && loading ? (
                  <>
                    <FaSpinner className="animate-spin h-4 w-4" />
                    <span>Requesting...</span>
                  </>
                ) : (
                  <span className="transition-opacity duration-200">
                    {grp.activeAccess ? "join" : "Request to join"}
                  </span>
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
