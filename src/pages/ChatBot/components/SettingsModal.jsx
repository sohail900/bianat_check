import {
  Button,
  Dialog,
  DialogPanel,
  DialogTitle,
  Switch,
} from "@headlessui/react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useState } from "react";
import { RiVoiceprintLine } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { LuDatabase } from "react-icons/lu";
import { GrShieldSecurity } from "react-icons/gr";
import { RiProfileLine } from "react-icons/ri";
import { IoIosArrowDown } from "react-icons/io";
import SwitchButton from "./SwitchButton";

const data = [
  { icon: <IoSettingsOutline />, title: "Settings" },
  // { icon: <RiVoiceprintLine />, title: "Speech" },
  // { icon: <LuDatabase />, title: "Data Controls" },
  // { icon: <RiProfileLine />, title: "Builder Profile" },
  // { icon: <GrShieldSecurity />, title: "Security" },
];

export default function SettingsModal({isOpen , setIsOpen}) {
  // let [isOpen, setIsOpen] = useState(false);
  // function open() {
  //   setIsOpen(true);
  // }

  function close() {
    setIsOpen(false);
  }

  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none text-white"
        onClose={close}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-[#343434] p-3 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <div className="">
                <h1 className="text-white ml-2 mb-2">Settings</h1>
                <hr className="mb-3" />
                <div className="flex ">
                  {/* <div className=" w-4/12">
                    {data.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center mb-3 text-white gap-2 text-sm"
                      >
                        {item.icon}
                        <h2 className="text-white">{item.title}</h2>
                      </div>
                    ))}
                  </div> */}
                  <div className="w-11/12 text-white m-auto">
                    <div className="flex justify-between items-center text-xs pb-3 border-b border-[#393939] mb-3">
                      <h1 className="text-white">Theme</h1>
                      <div className="flex items-center gap-1">
                        <h1 className="text-white">System</h1>
                        <IoIosArrowDown />
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs pb-3 border-b border-[#393939] mb-3">
                      <h1 className="text-white">Always show code when using data analyts</h1>
                      <SwitchButton />
                    </div>
                    <div className="flex justify-between items-center text-xs pb-3 border-b border-[#393939] mb-3">
                      <h1 className="text-white">Language</h1>
                      <div className="flex items-center gap-1">
                        <h1 className="text-white">Auto - detect</h1>
                        <IoIosArrowDown />
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs mb-6">
                      <h1 className="text-white">Archived chats</h1>
                      <button className="rounded-full text-center   border border-[#393939] w-[70px] h-[35px]">
                        Cancel
                      </button>
                    </div>
                    <div className="flex justify-between items-center text-xs pb-3 border-b border-[#393939] mb-3">
                      <h1 className="text-white">Archive all chats</h1>
                      <button className="rounded-full text-center   border border-[#393939] w-[70px] h-[35px]">
                        Cancel
                      </button>
                    </div>
                    <div className="flex justify-between items-center text-xs pb-3 border-b border-[#393939] mb-3">
                      <h1 className="text-white">Archive all</h1>
                      <button className="rounded-full text-center text-white bg-[#DA101C]  w-[70px] h-[35px]">
                        Delete all
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
