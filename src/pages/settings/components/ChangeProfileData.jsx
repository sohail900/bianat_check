import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, Typography, message } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import authApi from "../../../services/authApi";
import { authChatBot, dbChatBot } from "../../../utils/firebase/config";
import { doc, setDoc } from "firebase/firestore";
const { Option } = Select;

const ChangeProfileData = ({ user }) => {
  const currentTheme = useSelector((state) => state.currentTheme.currentTheme);
  const { auth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { Title } = Typography;

  const [editPhone, setEditPhone] = useState(false);

  const onSubmit = async (values) => {
    
    if(!values.phone && !values.email && !values.name){
      alert("To edit profile atleast one of the details is required.")
      return;
    }
    
    const data = {
      email: values.email??user.email,
      name: values.name??user.name,
      phone:{
        dialCode:"+966",
        number:values.phone.slice(4,)??user.phone.number
      },
    };


    const userId = authChatBot?.currentUser?.uid;

    if (!userId) {
      console.error("User is not authenticated.");
      alert("Error Updating Profile. Error: User-x")
      return;
    }

    try {
      // Reference to the user's document in the 'users' collection
      const userDocRef = doc(dbChatBot, "users", userId);

      // Set the document data in Firestore, merging with any existing data
      await setDoc(userDocRef, data, { merge: true });

      console.log("User data updated successfully");
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };
  const { t, i18n } = useTranslation();
  return (
    <div className="setting-sec">
      <Title level={3}>{t("Edit Profile")}</Title>
      <Form
        name="basic"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 12 }}
        onFinish={onSubmit}
        initialValues={{ prefix: "+96" }}
        autoComplete="off"
      >
        <Form.Item
          label={t("Name")}
          name="name"
          rules={[{ message: "Please input your Full Name!" }]}
        >
          <Input placeholder={user.name} />
        </Form.Item>

        <Form.Item label={t("Username")} name="username">
          <Input disabled placeholder={user.username} />
        </Form.Item>
        <Form.Item
          label={t("Email address")}
          name="email"
          rules={[{ required: false, message: "Please input your Email!" }]}
        >
          <Input placeholder={user.email} disabled/>
        </Form.Item>
        <Form.Item
          name="phone"
          label={t("Phone Number")}
          rules={[
            {
              required: editPhone,
              message: "Please input your phone number!",
            },
          ]}
        >
          <div className="flex gap-2">
            {editPhone && <PhoneInput country={"sa"} />}
            {!editPhone && (
              <Input
                placeholder={`${user?.phone?.dialCode} ${user?.phone?.number}`}
                disabled={true}
                dir="ltr"
              />
            )}
            <Button onClick={() => setEditPhone(!editPhone)}>
              {editPhone ? "Cancel" : "Edit"}
            </Button>
          </div>

          {/* <Input
            addonBefore={prefixSelector}
            style={{ width: "100%" }}
            type="number"
          /> */}
        </Form.Item>
        {/* <Form.Item name="bio" label={t("Bio")}>
          <Input.TextArea />
        </Form.Item> */}

        <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
          <Button type="primary" htmlType="submit">
            {t("Update")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangeProfileData;
