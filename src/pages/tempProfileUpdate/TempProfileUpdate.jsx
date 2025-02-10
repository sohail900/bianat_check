import { Content } from "antd/lib/layout/layout";
import BianatHeader from "../../components/BianatHeader";
import HighLights from "../../pages/home/components/Highlights";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import BianatFooter from "../../components/BianatFooter";
import { Card, Button, Modal } from "antd";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { authChatBot, dbChatBot } from "../../utils/firebase/config";
import { addDoc, collection, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const TempProfileUpdate = () => {
  const navigate = useNavigate();
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const currentTheme = useSelector((state) => state.currentTheme.currentTheme);

  // variables
  const [userData , setUserData] = useState(null)
  const [showTempModal, setShowTempModal] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    console.log("HERE MATE");
    let userData = localStorage.getItem("temp_data");
    if (userData) {
      const userDataParsed = JSON.parse(userData);
      setUserData(userDataParsed.content)
    }else{
      navigate('/')
    }
  }, []);

  useEffect(() => {
    if(userData){
      setName(userData.name)
      setEmail(userData.email)
    }
  }, [userData]);


  const validate = () => {
    // Regex patterns
    const phoneRegex = /^\+966\d{9}$/; // Matches +966 followed by 9 digits
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation

    // Check if phone number is valid
    if (!phoneRegex.test(phone)) {
      alert("Phone number must be in +966 format with 9 digits.");
      return false;
    }

    // Check if email is valid
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return false;
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return false;
    }

    // Check if password meets requirements
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum 8 characters, at least one letter and one number
    if (!passwordRegex.test(password)) {
      alert(
        "Password must be at least 8 characters long and include both letters and numbers."
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (validate()) {
      // Prepare data to save
      const dataToSave = {
        name,
        phone: {
          dialCode: "+966",
          number: phone.slice(4), // Extract only the phone number (excluding country code)
        },
        email,
        password,
        roles: ["user"],
        username: email.split("@")[0],
      };
  
      try {
        // Sign up the user with email and password
        const userCredential = await createUserWithEmailAndPassword(
          authChatBot,
          email,
          password
        );
        const user = userCredential.user;
  
        let paymentDocumentId = null;
  
        // Check the "payments" collection for an existing document
        const paymentsQuery = query(
          collection(dbChatBot, "payments"),
          where("userId", "==", dataToSave.username.toLocaleLowerCase())
        );
  
        const paymentSnapshot = await getDocs(paymentsQuery);
  
        if (!paymentSnapshot.empty) {
          // If a matching payment document exists, update the userId with user.uid
          for (const doc of paymentSnapshot.docs) {
            const paymentDocRef = doc.ref;
            await updateDoc(paymentDocRef, {
              userId: user.uid,
            });
            paymentDocumentId = doc.id; // Save the payment document ID
          }
          console.log("Payment document updated successfully.");
        } else {
          console.log("No matching payment document found. Skipping update.");
        }
  
        // Save user data in the "users" collection with uid as document ID
        const usersRef = doc(dbChatBot, "users", user.uid);
        await setDoc(usersRef, {
          ...dataToSave,
          id: user.uid,
          subscription:paymentDocumentId?"paid":"free",
          paymentId:paymentDocumentId, // Save the payment document ID (null if no matching document)
        });
  
        alert("Profile Updated Successfully!");
        navigate("/dashboard");
      } catch (error) {
        console.error("Error during signup or saving data:", error);
        alert("An error occurred: " + error.message);
      }
    }
  };
  return (
    <div className="h-full">
      <BianatHeader setIsGuideOpen={setIsGuideOpen} followUpPage={"true"} />
      <Content
        className={`landing-content min-h-[100vh] ${
          i18n.language === "en" ? "font-loader-en" : "font-loader"
        } ${currentTheme === "Dark" && "dark-skin"}`}
      >
        <div className="live-update-toolbar">
          <HighLights />
        </div>
        <div>
          <Card className="content-card w-fit m-auto mt-5 py-4 px-12">
            <h1 className="text-2xl font-bold text-center">Update Profile</h1>
            <div className="flex flex-col gap-2 mt-14">
              <div className="flex justify-between items-center gap-4">
                <label className="mr-4"> Name: </label>
                <input
                  type="text"
                  className="p-2 text-gray-700 outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex justify-between items-center gap-4">
                <label className="mr-4"> Email: </label>
                <input
                  readOnly
                  type="text"
                  className="p-2 text-gray-700 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex justify-between items-center gap-4">
                <label className="mr-4"> Phone: </label>
                <input
                  type="text"
                  className="p-2 text-gray-700 outline-none"
                  value={phone}
                  placeholder="e.g. +966123456789"
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <hr className="mt-3" />

              <div className="flex justify-between items-center gap-4">
                <label className="mr-4">Current Password: </label>
                <input
                  type="password"
                  className="p-2 text-gray-700 outline-none"
                  value={"123123123"}
                />
              </div>
              <div className="flex justify-between items-center gap-4">
                <label className="mr-4"> Password: </label>
                <input
                  type="password"
                  className="p-2 text-gray-700 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-between items-center gap-4">
                <label className="mr-4"> Confirm Password: </label>
                <input
                  type="password"
                  className="p-2 text-gray-700 outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-center mt-3">
                <Button onClick={handleSubmit}>Update</Button>
              </div>
            </div>
          </Card>
        </div>
        <Modal
          className={`sub-modal ${currentTheme === "Dark" && "dark-skin"}`}
          visible={showTempModal}
          footer={null}
          closable={false}
        >
          <div className="p-10">
            <div>
              <img
                src="/assets/pUpdateImg.png"
                alt=""
                className="w-1/2 m-auto"
              />
            </div>
            <p className="mt-2 text-lg">
              {i18n.language === "en"
                ? "To continue accessing your account, please update your password. This is required as we have migrated to a new database system."
                : "للاستمرار في الوصول إلى حسابك، يرجى تحديث كلمة المرور الخاصة بك. هذا الإجراء مطلوب لأننا قمنا بالانتقال إلى نظام قاعدة بيانات جديد"}
            </p>
            <div className="flex justify-end items-center">
              <Button
                onClick={() => setShowTempModal(false)}
                className="my-3"
              >
                {i18n.language === "en" ? "Continue" : "استمر"}
              </Button>
            </div>
          </div>
        </Modal>
        <BianatFooter />
      </Content>
    </div>
  );
};

export default TempProfileUpdate;
