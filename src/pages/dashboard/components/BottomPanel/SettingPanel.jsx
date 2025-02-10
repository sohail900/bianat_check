import React, { useState } from "react";
import { Transfer, Modal, Collapse, Button, Form, Input, Alert } from "antd";
import { KuzzleContext } from "../../../../App";
import { useSelector } from "react-redux";
import transfer_setting from "../../../../assets/transfer_setting.json";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { DeleteTwoTone } from "@ant-design/icons";

import { v4 as uuidv4 } from "uuid";
import { useContext } from "react";

const { Panel } = Collapse;

const SettingPanel = ({
  isModalVisible,
  setIsModalVisible,
  setDynamicColumn,
}) => {
  const [form] = Form.useForm();
  const rawFilterData = useSelector((state) => state.filterSettings);
  const { kuzzleHttp: kuzzle } = useContext(KuzzleContext);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const items = [
    {
      content: "Code",
      dataIndex: "code",
      id: "code",
      key: "code",
      parent: "price",
      title: "Code",
      isDelete: false,
    },
    {
      content: "Close",
      dataIndex: "close",
      id: "close",
      key: "close",
      parent: "price",
      title: "Close",
      isDelete: false,
    },
    {
      content: "High",
      dataIndex: "high",
      id: "high",
      key: "high",
      parent: "price",
      title: "High",
      isDelete: false,
    },
    {
      content: "Low",
      dataIndex: "low",
      id: "low",
      key: "low",
      parent: "price",
      title: "Low",
      isDelete: false,
    },
    {
      content: "Open",
      dataIndex: "open",
      id: "open",
      key: "open",
      parent: "price",
      title: "Open",
      isDelete: false,
    },
    {
      content: "Volume",
      dataIndex: "volume",
      id: "volume",
      key: "volume",
      parent: "price",
      title: "Volume",
      isDelete: false,
    },
    {
      content: "Change",
      dataIndex: "change",
      id: "change",
      key: "change",
      parent: "price",
      title: "Change",
      isDelete: false,
    },
    {
      content: "Change Percentage",
      dataIndex: "change_p",
      id: "change_p",
      key: "change_p",
      parent: "price",
      title: "Change",
      isDelete: false,
    },
  ];

  const columnsFromBackend = Object.keys(rawFilterData).reduce((acc, key) => {
    if (key !== "all") {
      const innerData = rawFilterData[key].filters.map((item) => {
        return {
          id: item.id,
          content: item.name,
          parent: key,
          key: item.id,
          title: item.name,
          dataIndex: item.id,
        };
      });

      acc[key] = {
        name: key,
        items: innerData,
      };
    }

    return acc;
  }, {});

  columnsFromBackend.Dustbin = {
    name: "Dustbin",
    items,
  };

  const data = transfer_setting.Settings.data;
  const grid = 8;

  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    padding: grid * 2,
    margin: `0 ${grid}px 0 0`,
    height: "50px",
    background: isDragging ? "lightgreen" : "grey",
    ...draggableStyle,
  });
  const getListStyle = (isDraggingOver) => ({
    display: "flex",
    flexWrap: "wrap",
    padding: grid,
    overflow: "auto",
    width: "500px",
    height: "auto",
  });

  const mockData = [];
  for (let i = 0; i < data.length; i++) {
    mockData.push({
      key: data[i].Key,
      title: data[i].Name,
      description: "description of content",
    });
  }
  const oriTargetKeys = mockData
    .filter((item) => +item.key > 10)
    .map((item) => item.key);

  const [columns, setColumns] = useState(columnsFromBackend);
  const [targetKeys, setTargetKeys] = useState(oriTargetKeys);

  const { currentTheme } = useSelector((state) => state.currentTheme);

  const handleOk = () => {
    form.submit();

    const newData = columns.Dustbin.items.map((item) => ({
      key: item.id,
      title: item.content,
      dataIndex: item.id,
    }));

    setIsModalVisible(false);
    setDynamicColumn(newData);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const renderColumns = (sourceId, destId, sourceIndex, destIndex) => {
    const sourceColumn = columns[sourceId];
    const destColumn = columns[destId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(sourceIndex, 1);
    destItems.splice(destIndex, 0, removed);
    setColumns({
      ...columns,
      [sourceId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destId]: {
        ...destColumn,
        items: destItems,
      },
    });
  };

  const onRemoveItem = (item, index) => {
    renderColumns("Dustbin", item.parent, index, 0);
  };

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (destination.droppableId === "Dustbin") {
      if (source.droppableId !== destination.droppableId) {
        renderColumns(
          source.droppableId,
          destination.droppableId,
          source.index,
          destination.index
        );
      } else {
        const column = columns[source.droppableId];
        const copiedItems = [...column.items];
        const [removed] = copiedItems.splice(source.index, 1);
        copiedItems.splice(destination.index, 0, removed);
        setColumns({
          ...columns,
          [source.droppableId]: {
            ...column,
            items: copiedItems,
          },
        });
      }
    }
  };

  const DroppableDiv = ({ columnId, column }) => (
    <Droppable
      direction="horizontal"
      droppableId={columnId}
      key={columnId}
      isDropDisabled={columnId === "Dustbin" ? false : true}
    >
      {(provided, snapshot) => {
        return (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {column.items.map((item, index) => {
              return (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        {item.content}
                        {column.name === "Dustbin" ? (
                          <DeleteTwoTone
                            onClick={() => onRemoveItem(item, index)}
                          />
                        ) : null}
                      </div>
                    );
                  }}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        );
      }}
    </Droppable>
  );

  const onFinish = async (values) => {
    const { name } = values;
    const { items } = columns.Dustbin;
    const response = await kuzzle.document.create("bianat", "column-selector", {
      name,
      items,
    });

    if (response._id === "some-id") {
      Alert.success("Successfully created column Layout!");
    }
  };

  return (
    <Modal
      title="Screener Settings"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      className={currentTheme === "Dark" && "dark-skin"}
      width={1000}
    >
      <Form {...layout} onFinish={onFinish} form={form}>
        <Form.Item
          label="Layout Name"
          name="name"
          rules={[{ required: true, message: "Please Enter Layout Name" }]}
        >
          <Input />
        </Form.Item>

        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          <Collapse accordion className="screener-collapse">
            {Object.entries(columns).map(([columnId, column], index) => {
              return column.name !== "Dustbin" ? (
                <Panel header={column.name} key={columnId}>
                  <div className="screener-setting" key={columnId}>
                    <DroppableDiv column={column} columnId={columnId} />
                  </div>
                </Panel>
              ) : (
                <div className="screener-setting-dustbin" key={columnId}>
                  <DroppableDiv column={column} columnId={columnId} />
                </div>
              );
            })}
          </Collapse>
        </DragDropContext>
      </Form>
    </Modal>
  );
};

export default SettingPanel;
