import { signOut } from "next-auth/react";
import { useRef, useState, useEffect } from "react";
import { FaEllipsisV } from "react-icons/fa";

const ProfileMenu = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !menuButtonRef.current?.contains(e.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setShowProfileMenu(false);
    await signOut({ callbackUrl: "/chat-app" });
  };

  return (
    <div className="relative ml-3">
      <button
        type="button"
        className="p-1 text-white focus:outline-none"
        aria-expanded={showProfileMenu}
        aria-haspopup="true"
        onClick={() => setShowProfileMenu(!showProfileMenu)}
        ref={menuButtonRef}
      >
        <FaEllipsisV size={18} />
      </button>

      {showProfileMenu && (
        <div
          id="user-menu"
          className="absolute right-0 z-10 rounded-md w-30 origin-top-right bg-white py-1 shadow-lg focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
          ref={menuRef}
        >
          <button
            className="block px-4 py-2 text-sm text-gray-700"
            role="menuitem"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
