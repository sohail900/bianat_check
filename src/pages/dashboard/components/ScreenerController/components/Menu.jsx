import React from 'react';
import { Menu } from 'antd';
import { useSelector } from 'react-redux';

const MenuOverLay = ({handleEdit,handleDelete}) => {
    const {currentTheme} = useSelector((state) => state.currentTheme);
    return (   <Menu
        id="screener-menu"
        className={`${currentTheme === "Dark" && "dark-skin"}`}
      >
        <Menu.Item
          key="1"
          onClick={() => {
           handleEdit();
            // showModal(true);
            // setTitle("Edit Screener");
            // setEditScreener(item);
          }}
        >
          <i className="fa-solid fa-pen-to-square"></i> Edit
        </Menu.Item>

        <Menu.Item
          key="2"
          onClick={() => handleDelete()}
          // disabled={item.username !== user.username}
        >
          <i className="fa-solid fa-trash-can"></i> Delete
        </Menu.Item>
      </Menu> );
}
 
export default MenuOverLay;