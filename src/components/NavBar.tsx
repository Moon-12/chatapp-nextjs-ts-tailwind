import { FaArrowLeft } from "react-icons/fa";
import ProfileMenu from "@/components/ProfileMenu";
import logo from "../../assets/images/chat_logo.png";
import Image from "next/image";

const Navbar = () => {
  return (
    <div className=" sticky top-0 z-10 bg-[#006241] text-white p-4 flex items-center justify-between max-w-md mx-auto">
      <button
        onClick={() => window.history.back()}
        className="text-white text-lg font-bold"
      >
        <FaArrowLeft />
      </button>
      <div className="flex items-center gap-2">
        <Image src={logo} alt="Grouply logo" width={28} height={28} />
        <h1 className="text-xl font-bold">Grouply</h1>
      </div>

      <ProfileMenu />
    </div>
  );
};

export default Navbar;
