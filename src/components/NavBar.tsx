import { FaArrowLeft } from "react-icons/fa";
import ProfileMenu from "@/components/ProfileMenu";

const Navbar = () => {
  return (
    
      <div className=" sticky top-0 z-10 bg-[#006241] text-white p-4 flex items-center justify-between max-w-md mx-auto">
        <button
          onClick={() => window.history.back()}
          className="text-white text-lg font-bold"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-xl font-bold sticky">Grouply</h1>

         <ProfileMenu />  
      </div>
  );
};

export default Navbar;