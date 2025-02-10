// src/components/Dropdown.js

import React, { useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { SiCodemagic } from "react-icons/si";
import { BsStars } from "react-icons/bs";
import SwitchButton from "./SwitchButton";
const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed left-16 top-4 inline-block ">
      <div>
        <button
          onClick={toggleDropdown}
          className="flex w-full rounded-md   p-1  pl-2 pr-2 text-white bg-[#393939]  "
        >
          <img src="/images/Bianat.png" alt="dropdown" className="w-4 h-4" />
          <RiArrowDropDownLine className="w-4 h-4" />
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right p-4 absolute left-0 mt-2 w-72 bg-[#393939] rounded-md shadow-lg  ring-1 ring-black ring-opacity-5">
          <div>
            <div className="flex justify-between items-center w-full gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 shadow-md rounded-full">
                  <BsStars color="white" />
                </div>

                <div>
                  <p className="text-white">Bianat Plus</p>
                  <p className="text-[#C0C0C0] text-xs">
                    Our smartest model & more
                  </p>
                </div>
              </div>
              <button className="pl-2 pr-2 border text-white rounded-full">
                Upgrade
              </button>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center w-full gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 shadow-md rounded-full">
                  <SiCodemagic color="white" />
                </div>

                <div>
                  <p className="text-white">Bianat</p>
                  <p className="text-[#C0C0C0] text-xs">
                    Great for everyday tasks
                  </p>
                </div>
              </div>

              <div className="bg-[#004F84] grid place-items-center p-1 rounded-full">
                <FaCheck className="text-white" />
              </div>
            </div>
          </div>

          <div className="my-1 h-px bg-white mb-2" />
          <div>
            <div className="flex justify-between items-center w-full gap-2 mb-2 mt-4">
              <div className="flex items-center gap-2">
                <div className="p-2 ">
                  <IoChatboxEllipsesOutline color="white" />
                </div>

                <div>
                  <p className="text-white">Temporary chat</p>
                </div>
              </div>

              <SwitchButton />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
