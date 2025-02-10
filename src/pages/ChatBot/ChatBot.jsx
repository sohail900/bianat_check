import React, { useState } from "react";
import SideDrawer from "./components/SideDrawer";
import Modal from "./components/Modal";
import Search from "./components/Search";
import QueryResponse from "./components/QueryResponse";
import Hero from "./components/Hero";
import Dropdown from "./components/Dropdown";
import { RiArrowDropDownLine } from "react-icons/ri";
import UserProfile from "./components/UserProfile";

const ChatBot = () => {
  const [message, setMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };
  return (
    <div className=" h-screen bg-[#222222]">
      <SideDrawer />
      <Dropdown />

      {/* <div className="App">
        <header className="App-header">
          <Dropdown />
        </header>
      </div> */}

      {/* <div className="App">
        <header className="App-header">
          <button
            onClick={openModal}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Open Modal
          </button>
        </header>
        <Modal isVisible={isModalVisible} onClose={closeModal} />
      </div> */}

      {/* <DropDown /> */}
      <UserProfile/>

      {/* Hero */}
      <Hero message={message} />
      {/* Message printed */}
      <QueryResponse message={message} />
      {/* search button */}
      <Search setMessage={setMessage} />
    </div>
  );
};

export default ChatBot;
