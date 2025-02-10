import React, { useEffect, useState, useContext } from "react";
import esb from "elastic-builder";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Dropdown, Menu, Divider, Input, message } from "antd";
import ScreenerFolder from "./screenerFolder";
import { KuzzleContext } from "../../../../App";
import MenuOverLay from "./components/Menu";
import { updateScreenerName } from "../../../../features/Screener/screenerSlice";
const FolderTree = ({
  handleChartHeightOnViewScreener,
  setChecked,
  checked,
  showScreener,
  handleCurrentFilter,
  folderAdded,
  handleShowScreener,
  isScreenerAdded,
  setEditScreener,
  setTitle,
  showModal,
  setCurrentTree,
  setIsAddModalVisible,
  isAddModalVisible,
  currentTree,
  setSelectedFolder,
  selectedFolder,
  setIsEditFolder
}) => {
  const [selectedScreener, setSelectedScreener] = useState(undefined);
  const [isFolderSelected, setIsFolderSelected] = useState(false);
  const [screeners, setScreener] = useState([]);
  const [publicScreeners, setPublicScreener] = useState([]);
  const [isDataModified, setIsDataModified] = useState(false);
  const [screenerData, setScreenerData] = useState([]);
  const [screenersWholeData, setScreenersWholeData] = useState([]);
  const [publicScreenerFolder, setPublicScreenerFolder] = useState([]);
  const [publicScreenerData, setPublicScreenerData] = useState([]);
  const { kuzzleHttp: kuzzle } = useContext(KuzzleContext);
  const currentTheme = useSelector((state) => state.currentTheme.currentTheme);
  const user = useSelector((state) => state.auth.user);
  const { t } = useTranslation();
  const dispatch = useDispatch();

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
              .must([
                esb.termQuery("username", user.username),
                esb.termQuery("isPublic", false),
              ])
          ),
        { size: 1000 }
      );

      const titles = response.hits.map((item) => ({
        ...item._source,
        _id: item._id,
      }));

      setScreenersWholeData(response.hits);
      setScreener(titles);
    };

    const publicScreeners = async () => {
      const response = await kuzzle.document.search(
        "bianat",
        "screener",
        esb.requestBodySearch().query(
          esb.boolQuery().should([
            // esb.termQuery("username", user.username),
            esb.termQuery("isPublic", true),
          ])
        ),
        { size: 1000 }
      );

      const titles = response.hits.map((item) => ({
        ...item._source,
        _id: item._id,
      }));

      setPublicScreenerData(response.hits);
      setPublicScreener(titles);
    };

    Screeners();
    publicScreeners();
  }, [isDataModified, isScreenerAdded]);

  const getScreenerFolderData = async () => {
    const response = await kuzzle.document.search(
      "bianat",
      "folder-specific-screeners",
      {}
    );
    setScreenerData(response.hits);
  };

  const getPublicScreenerFolderData = async () => {
    const response = await kuzzle.document.search(
      "bianat",
      "public-screener-folder",
      {}
    );
    setPublicScreenerFolder(response.hits);
  };

  const handleEditScreener = () => {
    let currentScreener;

    screenerData[0]._source.folders.forEach((folder) => {
      folder.screeners.forEach((screener) => {
        if (screener._id === selectedScreener) {
          currentScreener = screener;
        }
      });
    });

    if (!currentScreener) {
      screenersWholeData.forEach((screener) => {
        if (screener._id === selectedScreener) {
          currentScreener = { ...screener._source, _id: screener._id };
        }
      });
    }

    setEditScreener(currentScreener);
    showModal(true);
    setTitle("Edit Screener");
    getPublicScreenerFolderData();
  };



  const viewScreener = async (id) => {
    const screen = screenerData[0]._source?.folders.find(
      (screen) => screen._id === id
    );

    if (screen) {
      handleCurrentFilter({ username: user, ...screen });
    } else {
      const response = await kuzzle.document.get("bianat", "screener", id);
      const { _source: data } = response;
      delete data._kuzzle_info;
      handleCurrentFilter({ username: user, ...data });
      dispatch(updateScreenerName(data.title))
    }

    handleShowScreener(true);
  };

  const handleDeleteScreener = async () => {
    const isInScreener = await kuzzle.document.search(
      "bianat",
      "screener",
      esb
        .requestBodySearch()
        .query(esb.boolQuery().must(esb.termQuery("_id", selectedScreener)))
        .toJSON()
    );

    if (isInScreener.hits.length > 0) {
      const response = await kuzzle.document.delete(
        "bianat",
        "screener",
        selectedScreener
      );

      if (response) {
        message.success("Screener deleted successfully");
        const response = await kuzzle.document.search(
          "bianat",
          "screener",
          esb
            .requestBodySearch()
            .query(
              esb
                .boolQuery()
                .must([
                  esb.termQuery("username", user.username),
                  esb.termQuery("isPublic", false),
                ])
            ),
          { size: 1000 }
        );

        setIsDataModified(true);
      }
    }

    if (currentTree && currentTree === "folder-specific-screeners") {
      let folders = screenerData[0]._source.folders;
      folders.map((folder) => {
        let screeners = folder.screeners;
        folder.screeners.map((screen, index) => {
          if (screen._id === selectedScreener) {
            screeners.splice(index, 1);
          }
        });

        folder.screeners = screeners;
      });

      try {
        const response = await kuzzle.document.update(
          "bianat",
          "folder-specific-screeners",
          `${user.username}`,
          {
            folders: folders,
          }
        );
        setIsDataModified(true);
      } catch (error) {
        console.log(error);
      }

      getScreenerFolderData();
    } else {
      let folders = publicScreenerFolder[0]._source.folders;
      folders.map((folder) => {
        let screeners = folder.screeners;
        folder.screeners.map((screen, index) => {
          if (screen._id === selectedScreener) {
            screeners.splice(index, 1);
          }
        });

        folder.screeners = screeners;
      });

      try {
        const response = await kuzzle.document.update(
          "bianat",
          "public-screener-folder",
          `${user.username}`,
          {
            folders: folders,
          }
        );
        setIsDataModified(true);
      } catch (error) {
        console.log(error);
      }

      getPublicScreenerFolderData();
    }
  };

  const handleDeleteFolder = async () => {


    if (currentTree && currentTree === "folder-specific-screeners") {
      let folders = screenerData[0]._source.folders;
      folders.map((folder,index) => {
        if(folder.folderName === selectedFolder){

          folders.splice(index,1);
        }
      });


      try {
        const response = await kuzzle.document.update(
          "bianat",
          "folder-specific-screeners",
          `${user.username}`,
          {
            folders: folders,
          }
        );
        setIsDataModified(true);
      } catch (error) {
        console.log(error);
      }

      getScreenerFolderData();
    } else {
      let folders = publicScreenerFolder[0]._source.folders;
      folders.map((folder,index) => {
        if(folder.folderName === selectedFolder){
          folders.splice(index,1);
        }

      });

      try {
        const response = await kuzzle.document.update(
          "bianat",
          "public-screener-folder",
          `${user.username}`,
          {
            folders: folders,
          }
        );
        setIsDataModified(true);
      } catch (error) {
        console.log(error);
      }
      getPublicScreenerFolderData();
    }

  };


  const handleEditFolder = async () => {
    setIsEditFolder(true);
    setIsAddModalVisible(!isAddModalVisible)
  };

  const handleSingleClick = (id) => {

    handleChartHeightOnViewScreener(true);
    setChecked(true);
    viewScreener(id);
  };

  return (
    <div className={`screener-drag-drop`}>
      <div className="d-flex screener-section">
        {selectedScreener && (
          <ul className={`menu-list ${currentTheme === "Dark" && "dark-skin"}`}>
            <li>
              <i
                onClick={() => {
                  handleChartHeightOnViewScreener(!checked);
                  setChecked(!checked);
                  handleShowScreener(!showScreener);
                  // dispatch(updateRankIndustryStock(""));
                }}
                className={`fa-solid fa-eye 
                ${selectedScreener && showScreener && "screenActive"}
              //
              `}
              ></i>
            </li>
            <li>
              <Dropdown placement="bottomRight" overlay={<MenuOverLay handleEdit={handleEditScreener} handleDelete={handleDeleteScreener} />}>
                <a
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                >
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </a>
              </Dropdown>
            </li>
          </ul>
        )}

      </div>
      <div className="d-flex screener-section">
        {isFolderSelected && (
          <ul className={`menu-list ${currentTheme === "Dark" && "dark-skin"}`}>
            <li>
              <Dropdown placement="bottomRight" overlay={<MenuOverLay handleEdit={handleEditFolder} handleDelete={handleDeleteFolder} />}>
                <a
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                >
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </a>
              </Dropdown>
            </li>
          </ul>
        )}
        
      </div>
      <div className="folder-tree">
        <Divider orientation="left" plain>
          {t("MyScreeners")}
        </Divider>
        <ScreenerFolder
          handleChartHeightOnViewScreener={handleChartHeightOnViewScreener}
          handleCurrentFilter={handleCurrentFilter}
          setIsFolderSelected={setIsFolderSelected}
          handleShowScreener={handleShowScreener}
          setSelectedScreener={setSelectedScreener}
          setSelectedFolder={setSelectedFolder}
          selectedScreener={selectedScreener}
          screeners={screeners}
          screenersWholeData={screenersWholeData}
          getFolderData={getScreenerFolderData}
          screenerData={screenerData}
          endPointName="folder-specific-screeners"
          setCurrentTree={setCurrentTree}
          folderAdded={folderAdded}
          handleSingleClick={handleSingleClick}
          isDataModified={isDataModified}
        />
        <Divider orientation="left" plain>
          {t("Bianat Screener")}
        </Divider>
        <ScreenerFolder
          handleChartHeightOnViewScreener={handleChartHeightOnViewScreener}
          handleCurrentFilter={handleCurrentFilter}
          setIsFolderSelected={setIsFolderSelected}
          setSelectedFolder={setSelectedFolder}
          handleShowScreener={handleShowScreener}
          setSelectedScreener={setSelectedScreener}
          selectedScreener={selectedScreener}
          screeners={publicScreeners}
          screenersWholeData={publicScreenerData}
          getFolderData={getPublicScreenerFolderData}
          screenerData={publicScreenerFolder}
          endPointName="public-screener-folder"
          setCurrentTree={setCurrentTree}
          folderAdded={folderAdded}
          handleSingleClick={handleSingleClick}
          isDataModified={isDataModified}
        />
      </div>
    </div>
  );
};

export default FolderTree;
