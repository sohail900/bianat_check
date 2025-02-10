import React, { useState, useEffect, useContext } from "react";
import { Tree } from "antd";
import { FolderOutlined, FolderOpenOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { KuzzleContext } from "../../../../App";

const ScreenerFolder = ({
  screenersWholeData,
  setSelectedFolder,
  folderAdded,
  getFolderData,
  screenerData,
  screeners,
  setSelectedScreener,
  endPointName,
  setCurrentTree,
  handleSingleClick,
  isDataModified,
  setIsFolderSelected
}) => {
  const [gData, setGData] = useState([]);
  const { kuzzleHttp: kuzzle } = useContext(KuzzleContext);
  const user = useSelector((state) => state.auth.user);
  const currentTheme = useSelector((state) => state.currentTheme.currentTheme);

  const StructuringTreeData = (data) => {
    let treeData = [];
    data[0]._source.folders?.forEach((screener) => {
      let screenerInfo = screener.screeners;
      let tree = {
        title: screener.folderName,
        folderName: screener.folderName,

        key: screener.key,
        icon: ({ selected }) =>
          selected ? <FolderOpenOutlined /> : <FolderOutlined />,
        children: [],
      };

      screenerInfo?.forEach((screen) => {
        tree.children.push({
          title: screen.title,
          key: screen._id,
        });
      });

      treeData.push(tree);
    });
    screeners.forEach((screener) => {
      let tree = {
        title: screener.title,
        key: screener._id,
      };
      treeData.push(tree);
    });

    setGData(treeData);
  };

  useEffect(() => {
    if (screenerData.length > 0) {
      StructuringTreeData(screenerData);
    }
  }, [screenerData,isDataModified]);

  const deleteScreenerFromKuzzle = async (dragObj) => {
    let obj = screenersWholeData.find((item) => item._id === dragObj.key);

    try {
      const response = await kuzzle.document.delete(
        "bianat",
        "screener",
        dragObj.key
      );
    } catch (error) {
      console.log(error);
    }
  };

  const saveDataInKuzzle = async (data) => {
    let folderData = [];
    let folderChildrens = [];
    data.length > 0 &&
      data.forEach((folder) => {
        if (folder.folderName) {
          folder.children.forEach((screen) => {
            screenersWholeData.forEach((item) => {
              if (item._id === screen.key) {
                folderChildrens.push({
                  ...item._source,
                  key: item._id,
                  title: item._source.title,
                  _id: item._id,
                });
              }
            });
          });
          let data = {
            folderName: folder.folderName,
            key: folder.key,
            screeners: [...folderChildrens],
          };

          folderData.push(data);
        }
      });
    let newData = [];
    screenerData.length > 0 &&
      screenerData[0]._source.folders.forEach((folder) => {
        folderData.forEach((item) => {
          if (item.key === folder.key) {
            newData.push({
              ...item,
              folderName: item.folderName,
              key: item.key,
              screeners: [...folder.screeners, ...item.screeners],
            });
          }
        });
      });

    try {
      const response = await kuzzle.document.update(
        "bianat",
        `${endPointName}`,
        `${user.username}`,
        {
          folders: newData,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFolderData();
  }, [screeners, isDataModified, folderAdded]);

  const handleIsScreenerPublic = (item) => {
    let isPublic;
    screenersWholeData.forEach((screener) => {
      if (screener._id === item.key) {
        isPublic = screener._source.isPublic;
      }
    });

    return isPublic === undefined || !isPublic ? false : true;
  };

  const onDrop = (info) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split("-");
    // let isPublic = handleIsScreenerPublic(info.dragNode);
    // if (isPublic) return;

    if (info.dragNode.hasOwnProperty("folderName")) return;

    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);
    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };

    const data = [...gData]; // Find dragObject

    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {   
      loop(data, dropKey, (item) => {
        item.children = item.children || []; 
        item.children.unshift(dragObj);
      });
    } else if (info.dropToGap && info.node.children.length === 0) {
      loop(data, dropKey, (item) => {
        item.children.push(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && 
      info.node.props.expanded && 
      dropPosition === 1 
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || []; 

        item.children.unshift(dragObj);
      });
    } else {
      let ar = [];
      let i;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });

      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    saveDataInKuzzle(data);
    deleteScreenerFromKuzzle(dragObj);
    setGData(data);
  };

  const handleFolderClick=(info,endPointName)=>{
    setIsFolderSelected(true);
    setCurrentTree(endPointName)
    setSelectedFolder(info.node.folderName)
  }


  const onSelectNode = (selectedKeys, info) => {
    
    if (info.node.hasOwnProperty("folderName")) 
    {
      handleFolderClick(info,endPointName);
    }else{
     setIsFolderSelected(false);
    setCurrentTree(endPointName);
    setSelectedScreener(selectedKeys[0]);
    handleSingleClick(selectedKeys[0]);
    }
  };

  let isDraggable =
    endPointName === "public-screener-folder"
      ? user.username === "admin"
        ? true
        : false
      : true;

  return (
    <div className={`screener-drag-drop `}>
      <Tree
        className={`draggable-tree  ${currentTheme === "Dark" && "dark-skin"}`}
        showIcon={true}
        draggable={isDraggable}
        onSelect={onSelectNode}
        blockNode
        onDrop={onDrop}
        treeData={gData}
      />
    </div>
  );
};

export default ScreenerFolder;
