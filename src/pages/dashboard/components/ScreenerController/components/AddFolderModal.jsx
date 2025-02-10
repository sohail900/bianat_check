import React, { useState, useEffect, useContext } from "react";
import esb from "elastic-builder";
import { Button, Form, Modal, Select,Checkbox } from "antd";
import { KuzzleContext } from "../../../../../App";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";



const AddFolderModal = ({ isAddModalVisible, setIsAddModalVisible,setFolderAdded,selectedFolder,folderTree
  ,setIsEditFolder,isEditFolder,setIsScreenerAdded}) => {
  const [screeners, setScreeners] = useState([]);
  const { kuzzleHttp: kuzzle } = useContext(KuzzleContext);
  const user = useSelector((state) => state.auth.user);
  const currentTheme = useSelector((state) => state.currentTheme.currentTheme);
  const [form] = Form.useForm();
  const handleOk = () => {
    form.submit();
    setIsAddModalVisible(false);
  };
  const saveFolder = async (values) => {
    let selectedScreeners = [];
    values.screener?.map((screener) => {
      screeners.forEach((item) => {
        if (item._id === screener) {
          selectedScreeners.push(item);
          return item;
        }
      });
    });

    const searchResponse = await kuzzle.document.search(
      "bianat",
      "folder-specific-screeners",
      esb
        .requestBodySearch()
        .query(
          esb.boolQuery().should([esb.termQuery("username", user.username)])
        )
    );
    let folderData =
      searchResponse.hits.length > 0
        ? searchResponse.hits[0]._source.folders
        : [];
    if (searchResponse.hits.length === 0) {
      const response = await kuzzle.document.create(
        "bianat",
        "folder-specific-screeners",
        {
          username: user.username,
          folders: [
            {
              folderName: values.folderName,
              key: uuidv4(),
              screeners: [],
            },
          ],

          // screeners: [...selectedScreeners],
        },
        `${user.username}`
      );
    } else {
      const response = await kuzzle.document.update(
        "bianat",
        "folder-specific-screeners",
        `${user.username}`,
        {
          username: user.username,
          folders: [
            ...folderData,
            {
              folderName: values.folderName,
              key: uuidv4(),
              screeners: [],
            },
          ],
          // screeners: [...selectedScreeners],
        }
      );
    }
  };


  const saveFolderInPublic = async (values) => {
    let selectedScreeners = [];
    values.screeners?.map((screener) => {
      screeners.forEach((item) => {
        if (item._id === screener) {
          selectedScreeners.push(item);
          return item;
        }
      });
    });

    const searchResponse = await kuzzle.document.search(
      "bianat",
      "public-screener-folder",
      // esb
      //   .requestBodySearch()
      //   .query(
      //     esb.boolQuery().should([esb.termQuery("username", user.username)])
      //   )
    );
    let folderData =
      searchResponse.hits.length > 0
        ? searchResponse.hits[0]._source.folders
        : [];
    if (searchResponse.hits.length === 0) {
      const response = await kuzzle.document.create(
        "bianat",
        "public-screener-folder",
        {
          username: user.username,
          folders: [
            {
              folderName: values.folderName,
              key: uuidv4(),
              screeners: [],
            },
          ],

          // screeners: [...selectedScreeners],
        },
        `${user.username}`
      );
    } else {
      const response = await kuzzle.document.update(
        "bianat",
        "public-screener-folder",
        `${user.username}`,
        {
          username: user.username,
          folders: [
            ...folderData,
            {
              folderName: values.folderName,
              key: uuidv4(),
              screeners: [],
            },
          ],
          // screeners: [...selectedScreeners],
        }
      );
    }
  };






  const editFolder = async (values) => {

   
      const response = await kuzzle.document.search(
        "bianat",
         `${folderTree}`,
        {}
      );

      let folderData = response.hits[0]._source.folders;


      folderData.forEach((item) => {
        if(item.folderName === selectedFolder){
          item.folderName = values.folderName;   
        }
      });
      
  

      const response1 = await kuzzle.document.update(
        "bianat",
        `${folderTree}`,
        `${user.username}`,
        {
          username: user.username,
          folders: [
            ...folderData,
          ],

        }
      );
      setIsEditFolder(false);
      setFolderAdded(true);
      setIsScreenerAdded(true);
      form.setFieldsValue({
        folderName: undefined,
      })
 
  }


  const onFinish = (values) => {


    if(isEditFolder && values){
      editFolder(values)

    }else{

   if(values.isPublic){
    saveFolderInPublic(values);
   }else{
    saveFolder(values);

   }
  }
   setFolderAdded(true);
    form.resetFields();
  };
  const handleCancel = () => {
    form.resetFields();
    setIsAddModalVisible(false);
  
  };



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
  }, []);

  return (
    <Modal
      title="Create Folder"
      visible={isAddModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      className={`${currentTheme === "Dark" && "dark-skin"}`}
    >
      <Form onFinish={onFinish} form={form}>
        <Form.Item name="folderName" label="Folder Name">
          <input  defaultValue={selectedFolder}/>
        </Form.Item>
        <Form.Item
        name="isPublic"
        label="Is Public"
        valuePropName="checked"
      >
        <Checkbox/>
      </Form.Item>
        {/* <Form.Item name="screeners" label="Screeners">
          <Select
            mode="tags"
            style={{
              width: "100%",
            }}
            placeholder="Tags Mode"
            onChange={handleChange}
          >
            {screeners.map((item) => (
              <Option key={item._id}>{item.title}</Option>
            ))}
          </Select>
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default AddFolderModal;
