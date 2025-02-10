// src/components/SideDrawer.js

import React, { useState } from "react";
import { MdNotes } from "react-icons/md";

import { LuBoxes } from "react-icons/lu";
import { BsThreeDots } from "react-icons/bs";
import LoginModal from "./LoginModal";
import { useNavigate } from "react-router-dom";
const SideDrawer = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={toggleDrawer}
        className="fixed top-4 left-4 bg-[#393939] text-white p-1  pl-2 pr-2  rounded-md"
      >
        <MdNotes className="w-4 h-4" />
      </button>

      <div
        className={`fixed z-10 top-0 left-0 w-64 h-full bg-[#393939] text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <button
          onClick={toggleDrawer}
          className="absolute top-4 right-4  text-white p-2 rounded"
        >
          <MdNotes />
        </button>
        <div className="h-full  flex flex-col justify-between">
        <div className="h-8/12">
          <div className="m-5">
            <p className="text-white">New</p>
          </div>
          <div>
            <div className="flex items-center gap-2 m-4" onClick={()=>navigate("/")} style={{"cursor":"pointer"}}>
              <div className="p-2 border border-white rounded-full ">
                <img src="/images/Bianat.png" className="w-4 h-4 " alt="" />
              </div>

              <div>
                <img src="/images/BianatName.png" alt="" />
              </div>
            </div>
            <div className="flex items-center gap-2 m-4">
              <div className="p-2 border border-white rounded-full ">
                <LuBoxes className="w-4 h-4" />
              </div>

              <div>
                <p className="text-xl text-white">Explore Bianat</p>
              </div>
            </div>
          </div>
          <div
            className="m-4 flex gap-3 flex-col h-full"
            style={{ overflowY: "scroll" }}
          >
            <div className="mb-5 text-xs text-white">
              <p>Yesterday</p>
              <div className="flex items-center gap-2">
                <p>stoke exchange tips</p>
                <BsThreeDots />
              </div>
            </div>
            <div className="mb-5 text-xs text-white">
              <p>Previous 7 days</p>
              <div className="flex items-center gap-2">
                <p>stoke exchange tips</p>
                <BsThreeDots />
              </div>
              <div className="flex items-center gap-2">
                <p>stoke exchange tips</p>
                <BsThreeDots />
              </div>
            </div>
            <div className="mb-5 text-xs text-white">
              <p>Previous 7 days</p>
              <div className="flex items-center gap-2">
                <p>stoke exchange tips</p>
                <BsThreeDots />
              </div>
              <div className="flex items-center gap-2">
                <p>stoke exchange tips</p>
                <BsThreeDots />
              </div>
            </div>
            <div className="mb-5 text-xs text-white">
              <p>Previous 7 days</p>
              <div className="flex items-center gap-2">
                <p>stoke exchange tips</p>
                <BsThreeDots />
              </div>
              <div className="flex items-center gap-2">
                <p>stoke exchange tips</p>
                <BsThreeDots />
              </div>
            </div>
            <div className="mb-5 text-xs text-white">
              <p>Previous 7 days</p>
              <div className="flex items-center gap-2">
                <p>stoke exchange tips</p>
                <BsThreeDots />
              </div>
              <div className="flex items-center gap-2">
                <p>stoke exchange tips</p>
                <BsThreeDots />
              </div>
            </div>
            <div className="mb-5 text-xs text-white">
              <p>Previous 7 days</p>
              <div className="flex items-center gap-2">
                <p>stoke exchange tips</p>
                <BsThreeDots />
              </div>
              <div className="flex items-center gap-2">
                <p>stoke exchange tips</p>
                <BsThreeDots />
              </div>
            </div>
            <div className="mb-5 text-xs text-white tracking-wide">
              <p>Previous 30 days</p>
              <div className="flex items-center gap-2">
                <p>stoke exchange tips</p>
                <BsThreeDots />
              </div>
              <div className="flex items-center gap-2">
                <p>stoke exchange tips</p>
                <BsThreeDots />
              </div>
            </div>
          </div>

          </div>
          {/* <div className="h-4/12">
            <div
              className=" pb-8 text-white bg-[#313131]"
              style={{ borderTop: "1px solid gray" }}
            >
              <div>
                <div className="flex flex-col w-fit gap-1 mx-auto mb-1 p-3">
                  <h1 className="text-base text-white">Sign up or Log in</h1>
                  <p className="text-xs">
                    Get smarter responses ,images, upload files and more
                  </p>
                </div>
                <div className="flex flex-col w-fit gap-1 mx-auto">
                  <LoginModal toggleDrawerFn={toggleDrawer} />
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-[#393939] opacity-50"
          onClick={toggleDrawer}
        ></div>
      )}
    </>
  );
};

export default SideDrawer;
