import React, { useEffect, useState, useContext } from "react";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import EditModal from "./components/EditModal";
import { KuzzleContext } from "../../../../App";
import esb from "elastic-builder";
import { useSelector } from "react-redux";
import { FolderAddOutlined } from "@ant-design/icons";
import AddFolderModal from "./components/AddFolderModal";
import FolderTree from "./FolderTree";

/**
 * @name StockControls
 * @description StockControls component
 * @param {function} handleCurrentFilter  function to handle current filter
 * @param {function} handleShowScreener  function to handle show screener
 * @param {string} selectedFilter  selected filter
 * @param {boolean} showScreener  show screener
 * @returns {JSX} JSX element
 */

const StockControls = ({
  handleCurrentFilter,
  handleShowScreener,
  selectedFilter,
  showScreener,
  handleChartHeightOnViewScreener,
  handleCurrentAction,
  handleKuzzleData,
  handleCurrentTrader
}) => {
  const user = useSelector((state) => state.auth.user);
  const [screeners, setScreeners] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isEditFolder, setIsEditFolder] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isScreenerAdded, setIsScreenerAdded] = useState(false);
  const [checked, setChecked] = useState(false);
  const [editScreener, setEditScreener] = useState(undefined);
  const [folderAdded, setFolderAdded] = useState(false);
  const [title, setTitle] = useState("Add Screener Beta");
  const { kuzzleHttp: kuzzle } = useContext(KuzzleContext);
  const [currentTree, setCurrentTree] = useState(undefined);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    const Screeners = async () => {
      const response = await kuzzle.document.search(
        "bianat",
        "screener",
        esb
          .requestBodySearch()
          .query(
            esb
              .boolQuery()
              .should([
                esb.termQuery("username", user.username),
                esb.termQuery("isPublic", true),
              ])
          ),
        { size: 1000 }
      );

      const titles = response.hits.map((item) => ({
        ...item._source,
        _id: item._id,
      }));
      setScreeners(titles);
    };

    Screeners();
  }, [selectedFilter]);



  const showModal = () => {
    setVisible(true);
  };

  return (
    <div
      className={`screener-controller ${
        i18n.language === "en" ? "font-loader-en" : "font-loader"
      }`}
    >
      {/* {user.roles.includes("admin") && ( */}
      <div className="list-view">
        <div className="list-header">
      
          <h3>{t("Screener")}</h3>

          <Button
            size="small"
            className="add-btn"
            type="primary"
            onClick={() => {
              setIsAddModalVisible(!isAddModalVisible);
            }}
          >
            <FolderAddOutlined />
          </Button>

          <Button
            size="small"
            className="add-btn"
            onClick={() => {
              showModal(true);
              setTitle("Add Screener Beta");
            }}
          >
            <i className="fas fa-plus"></i>
          </Button>
        </div>
        <FolderTree
          handleChartHeightOnViewScreener={handleChartHeightOnViewScreener}
          setChecked={setChecked}
          checked={checked}
          setSelectedFolder={setSelectedFolder}
          selectedFolder={selectedFolder}
          showScreener={showScreener}
          handleCurrentFilter={handleCurrentFilter}
          selectedFilter={selectedFilter}
          handleShowScreener={handleShowScreener}
          isScreenerAdded={isScreenerAdded}
          folderAdded={folderAdded}
          setEditScreener={setEditScreener}
          showModal={showModal}
          setTitle={setTitle}
          setCurrentTree={setCurrentTree}
          currentTree={currentTree}
          isAddModalVisible={isAddModalVisible}
          setIsAddModalVisible={setIsAddModalVisible}
          setIsEditFolder={setIsEditFolder}
        />
      
        
      </div>
      {/* )} */}

      <EditModal
        visible={visible}
        setVisible={setVisible}
        setIsScreenerAdded={setIsScreenerAdded}
        IsScreenerAdded={isScreenerAdded}
        setScreeners={setScreeners}
        title={title}
        setEditScreener={setEditScreener}
        editScreener={editScreener}
        handleCurrentFilter={handleCurrentFilter}
        handleShowScreener={handleShowScreener}
        currentTree={currentTree}
      />
      <AddFolderModal
        isAddModalVisible={isAddModalVisible}
        setIsAddModalVisible={setIsAddModalVisible}
        setFolderAdded={setFolderAdded}
        selectedFolder={selectedFolder}
        folderTree={currentTree}
        setIsEditFolder={setIsEditFolder}
        isEditFolder={isEditFolder}
        setIsScreenerAdded={setIsScreenerAdded}
      />
    </div>
  );
};

export default StockControls;
