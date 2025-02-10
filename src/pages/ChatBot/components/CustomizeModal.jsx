import {
  Button,
  Dialog,
  DialogPanel,
  DialogTitle,
  Switch,
} from "@headlessui/react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useState } from "react";
import { BiCustomize } from "react-icons/bi";
import { FaApple, FaRegEyeSlash } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import ShowTipsModal from "./ShowTipsModal";
import SwitchButton from "./SwitchButton";

export default function CustomizeModal({isOpen , setIsOpen}) {
  // let [isOpen, setIsOpen] = useState(false);
  const [showtip, setShowtip] = useState(false);

  // function open() {
  //   setIsOpen(true);
  // }

  function close() {
    setIsOpen(false);
  }

  return (
    <>
      {/* <div
        className="flex items-center gap-2 mb-2 cursor-pointer"
        onClick={open}
      >
        <BiCustomize />
        <h1>Customize Bianat</h1>
      </div> */}

      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={close}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-[#393939] p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <div className="">
                <h1 className="text-white ml-2 mb-2">Bianat Customize</h1>
                <hr />
                <p className="text-xs text-white ml-2 mt-2 mb-2">
                  Customize Instructions
                </p>
                <div className="text-xs text-white ml-2 mb-2">
                  Question Here
                </div>
                <input
                  className="w-full h-28 bg-[#393939] rounded-md p-2  shadow-sm border"
                  type="email"
                  name="q1"
                />
                <div className="flex justify-between items-center mb-2 text-[#C0C0C0]">
                  <h1 className="text-white">0/1500</h1>
                  {showtip && (
                    <button
                      className="flex items-center gap-2"
                      onClick={() => setShowtip(false)}
                    >
                      Hide Tips <FaRegEyeSlash />
                    </button>
                  )}
                  {!showtip && (
                    <button
                      className="flex items-center gap-2"
                      onClick={() => setShowtip(true)}
                    >
                      Show Tips <FaRegEyeSlash />
                    </button>
                  )}
                  {showtip && <ShowTipsModal />}
                </div>

                <div className="text-xs text-white ml-2 mb-2 mt-3">
                  Question Here
                </div>
                <input
                  className="w-full h-28 bg-[#393939] rounded-md p-2  shadow-sm border"
                  type="email"
                  name="q2"
                />
                <div className="flex justify-between items-center mb-2 text-[#C0C0C0]">
                  <h1 className="text-white">0/1500</h1>
                </div>

                <div className="flex justify-between mt-6 gap-2">
                  <div className="flex justify-between items-center gap-2">
                    <h1 className="text-xs text-white">Enable for new chats</h1>
                    <SwitchButton />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={close}
                      className="rounded-full text-center text-[#c0c0c0]  border border-[#c0c0c0] w-[70px] h-[35px]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={close}
                      className="rounded-full text-center bg-[#C0C0C0]  w-[70px] h-[35px]"
                    >
                      Save
                    </button>
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
