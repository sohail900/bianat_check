import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FaRegUser } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { BiCustomize } from "react-icons/bi";

// import CustomizeModal from "./CustomizeModal";
import SettingsModal from "./SettingsModal";
import { useState } from "react";
import CustomizeModal from "./CustomizeModal";

// const data = [
//   { icon: <FaRegUser />, title: "My Bianat", model: <CustomizeModal /> },
//   {
//     icon: <BiCustomize />,
//     title: "Customize Bianat",
//     model: <CustomizeModal />,
//   },
//   { icon: <IoSettingsOutline />, title: "Settings", model: <CustomizeModal /> },
// ];

export default function UserProfile() {
  const [isOpenSettingModal, setIsOpenSettingModal] = useState(false);
  const [isOpenCustomiseModal , setIsOpenCustomiseModal] = useState(false)

  const toggleSettingModal = ()=>{
    setIsOpenSettingModal(!isOpenSettingModal)
  }

  const toggleCustomiseModal = ()=>{
    setIsOpenCustomiseModal(!isOpenCustomiseModal)
  }

  return (
    <div className="fixed top-24 w-52 text-right ">
      <Menu>
        <MenuButton className="fixed top-4 right-4 bg-[#3939] text-white p-3  rounded-full flex items-center">
          <FaRegUser />
        </MenuButton>

        <MenuItems
          transition
          anchor="bottom end"
          className="w-52 origin-top-right rounded-xl border mt-2 border-white/5 bg-[#393939] p-3 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <MenuItem>
            <div className="flex items-center gap-2 mb-1">
              <FaRegUser />
              <h1 className="text-white">My Bianat</h1>
            </div>
          </MenuItem>
          <MenuItem>
            <button className="flex items-center gap-2 mb-1" onClick={()=>toggleCustomiseModal()}>
              <BiCustomize />
              <h1 className="text-white">Customise</h1>
            </button>
          </MenuItem>
          <MenuItem>
            <button className="flex items-center gap-2 mb-1" onClick={()=>toggleSettingModal()}>
              <IoSettingsOutline />
              <h1 className="text-white">Settings</h1>
            </button>
          </MenuItem>

          <div className="my-1 h-px bg-white mb-2" />
          <MenuItem>
            <button className="flex items-center gap-2 mb-2">
              <IoIosLogOut />
              <h1 className="text-white">Log Out</h1>
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
      
      <SettingsModal isOpen={isOpenSettingModal} setIsOpen={setIsOpenSettingModal} />
      <CustomizeModal isOpen={isOpenCustomiseModal} setIsOpen={setIsOpenCustomiseModal} />
    </div>
  );
}
