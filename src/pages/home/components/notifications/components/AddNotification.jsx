import React, { useState, useContext, useEffect } from "react";
import {
  Modal,
  Row,
  Col,
  Input,
  Form,
  Button,
  message,
  DatePicker,
  Divider,
  Select,
} from "antd";
import { useSelector } from "react-redux";

import moment from "moment";

import { KuzzleContext } from "../../../../../App";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { dbChatBot } from "../../../../../utils/firebase/config";

const AddNotification = ({
  showNotificationModal,
  setShowNotificationModal,
  currentAnnouncement,
  type,
}) => {
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [announcementEn, setAnnouncementEn] = useState("");
  const [announcementAr, setAnnouncementAr] = useState("");
  const [announcementDate, setAnnouncementDate] = useState();
  const { kuzzleHttp: kuzzle } = useContext(KuzzleContext);
  const { currentTheme } = useSelector((state) => state.currentTheme);
  const { TextArea } = Input;
  const [form] = Form.useForm();

  //
  const [notificationType, setNotificationType] = useState("announcements");

  const saveData = async (values) => {
    console.log(values);
    try {
      const response = await kuzzle.document.create("bianat", "announcements", {
        titleen: values.titleEn,
        titlear: values.titleAr,
        announcementen: values.announcementEn,
        announcementar: values.announcementAr,
        link: values.link,
        date: values.date ? values.date : announcementDate,
      });
      if (response) {
        message.success("Notification added successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const editData = async (values) => {
    try {
      const response = await kuzzle.document.update(
        "bianat",
        "announcements",
        currentAnnouncement._id,
        {
          titleen: values.titleEn,
          titlear: values.titleAr,
          announcementen: values.announcementEn,
          announcementar: values.announcementAr,
          date: moment(values.date).format("dd, MMM DD, YYYY, hh:mm A"),
          link: values.link,
        }
      );
      if (response) {
        message.success("Notification edited successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function saveNewsToFirebase(values) {
    try {
      const { date, ...newValues } = values;
      newValues.date = date.toDate();
      const collectionRef = collection(dbChatBot, "news");

      // Adding the document to the collection
      const docSnapshot = await addDoc(collectionRef, newValues);
      if (docSnapshot) {
        alert("News Added!");
      }
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }

  const handleFormSubmit = async (values) => {
    if (!notificationType) {
      alert("Please select a type.");
      return;
    }
    if (notificationType === "announcements") {
      if (type && type === "Edit") {
        editData(values);
      } else {
        saveData(values);
      }
    } else {
      await saveNewsToFirebase(values);
    }
    // form.resetFields();
    // setShowNotificationModal(false);
  };

  const handleFormCancel = () => {
    form.resetFields();
    setShowNotificationModal(false);
  };

  useEffect(() => {
    if (type && type === "Edit") {
      const { announcementen, announcementar, titleen, titlear, date, link } =
        currentAnnouncement._source;
      setAnnouncementDate(date);
      form.setFieldsValue({
        announcementEn: announcementen,
        announcementAr: announcementar,
        titleEn: titleen,
        titleAr: titlear,
        link: link,
        date: moment(date),
      });
    }
  }, [type]);

  return (
    <Modal
      title={`${type} Announcement`}
      open={showNotificationModal}
      onCancel={handleFormCancel}
      width={1000}
      footer={null}
      className={` ${currentTheme === "Dark" && "dark-skin"}`}
    >
      <Form
        name="basic"
        form={form}
        initialValues={{
          remember: true,
          currentAnnouncement,
        }}
        onFinish={handleFormSubmit}
      >
        <Row>
          <Col xs={{ span: 24 }} lg={{ span: 7 }}>
            <label>Type:</label>
          </Col>
          <Col>
            <Form.Item
              name="typeOfNotification"
              
            >
              <div className="flex gap-6">
                <div>
                  <label htmlFor="announcements" className="px-2">Announcements</label>
                  <input
                    type="radio"
                    value="announcements"
                    id="announcements"
                    name="type"
                    checked={notificationType === "announcements"}
                    onChange={(e) => setNotificationType(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="news" className="px-2">News</label>
                  <input
                    type="radio"
                    value="news"
                    id="news"
                    name="type"
                    checked={notificationType === "news"}
                    onChange={(e) => setNotificationType(e.target.value)}
                  />
                </div>
              </div>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col xs={{ span: 24 }} lg={{ span: 7 }}>
            <label>Title :</label>
          </Col>
          <Col xs={{ span: 24 }} lg={{ span: 14 }}>
            <div className="flex flex-row mb-5">
              <Form.Item
                name="titleEn"
                rules={[
                  {
                    required: true,
                    message: "Please input your title!",
                  },
                ]}
              >
                <Input
                  placeholder="English"
                  value={titleEn}
                  onChange={(e) => {
                    setTitleEn(e.target.value);
                  }}
                />
              </Form.Item>
              <Form.Item
                className="ms-4"
                name="titleAr"
                rules={[
                  {
                    required: true,
                    message: "Please input your title!",
                  },
                ]}
              >
                <Input
                  placeholder="Arabic"
                  value={titleAr}
                  onChange={(e) => {
                    setTitleAr(e.target.value);
                  }}
                />
              </Form.Item>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={{ span: 24 }} lg={{ span: 7 }}>
            <label>Announcement :</label>
          </Col>

          <Col xs={{ span: 24 }} lg={{ span: 14 }}>
            <Form.Item
              name="announcementEn"
              rules={[
                {
                  required: true,
                  message: "Please input your announcement! in English",
                },
              ]}
            >
              <TextArea
                className="mb-5"
                placeholder="English"
                value={announcementEn}
                rows={2}
                onChange={(e) => {
                  setAnnouncementEn(e.target.value);
                }}
              />
            </Form.Item>
            <Form.Item
              name="announcementAr"
              rules={[
                {
                  required: true,
                  message: "Please input your announcement! in Arabic",
                },
              ]}
            >
              <TextArea
                placeholder="Arabic"
                value={announcementAr}
                rows={2}
                onChange={(e) => {
                  setAnnouncementAr(e.target.value);
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col xs={{ span: 24 }} lg={{ span: 7 }}>
            <label>Link :</label>
          </Col>
          <Col xs={{ span: 24 }} lg={{ span: 14 }}>
            <Form.Item name="link">
              <Input placeholder="Link" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col xs={{ span: 24 }} lg={{ span: 7 }}>
            <label>Date :</label>
          </Col>
          <Col xs={{ span: 24 }} lg={{ span: 14 }}>
            <Form.Item
              name="date"
              valuePropName={"date"}
              rules={[
                {
                  required: true,
                  message: "Please input your date!",
                  validator: (_, value) => {
                    if (announcementDate && announcementDate !== null) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject("Please input your date!");
                    }
                  },
                },
              ]}
            >
              <DatePicker
                onChange={(date) => {
                  setAnnouncementDate(date);
                }}
                format="DD-MM-yyyy"
                // defaultValue={}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider
          style={{
            borderTop: "1px solid rgba(191, 191, 191, 0.19)",
          }}
        />
        <Row>
          <Col xs={{ span: 24 }} lg={{ span: 24 }} className="text-end">
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                {type && type === "Edit" ? "Edit" : "Add"} Announcement
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddNotification;
