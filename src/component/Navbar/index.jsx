import React from "react";
import { VscAccount } from "react-icons/vsc";

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-[#0070CD] ">
      <nav className="bg-trasparent border-gray-200 backdrop-filter backdrop-blur-md   ">
        <div className="flex flex-wrap justify-between items-center mx-auto p-3">
          <a href="https://flowbite.com" className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className=" bg-opacity-50 rounded-full p-1">
              <img src="images/innova logo.png" className="h-8" alt="Flowbite Logo" />
            </div>
          </a>
          <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white text-white ">
            Talent Analytics Dashboard
          </span>
          <div className="text-white text-2xl">
            <i className="text-2xl">
              {" "}
              <VscAccount />
            </i>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
