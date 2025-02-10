import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { dbChatBot } from "../../utils/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Content } from "antd/lib/layout/layout";
import BianatHeader from "../../components/BianatHeader";
import HighLights from "../home/components/Highlights";

const AddPotentialLong = () => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // DATA
  const [day, setDay] = useState("");
  const [annoVal, setAnnoVal] = useState("");
  const [annoucements, setAnnoucements] = useState([]);

  // DAYS DATA
  const days = [
    "Sunday-gNAKnJnFuT1MELOE7i2b",
    "Monday-oiiR8iuI2V0WRnebO5Iy",
    "Tuesday-gNAKnJnFuT1MELOE7i2u",
    "Wednesday-tpwzYz1XH2Y0dbChatBot1b2av8",
    "Thursday-rMC6AAlbaM7MXxnUwE8D",
    "Friday-zn0cikm6DzxLsvnWCO8d",
    "Saturday-rMC6AAlbaM7MXxnUwE8a",
  ];

  // ESSENTIALS
  const { t, i18n } = useTranslation();
  const currentTheme = useSelector((state) => state.currentTheme.currentTheme);

  // UseEffect
  useEffect(() => {
    if(day){
      fetchFollowUps(day)
    }
  }, [day]);

  // handles

  const fetchFollowUps =async(day)=>{
    try {
      const docRef = doc(dbChatBot, "potentialLongs", day);
    
    const docSnap = await getDoc(docRef);

    if(docSnap.exists()){
      const data = docSnap.data()
      setAnnoucements(data.annoucements)
    }
    } catch (error) {
      console.log(error)
    }
  }

  const handlePressSpace = (e) => {
    if (e.key === ";" && annoVal.trim() !== "") {
      e.preventDefault();
      setAnnoucements((prevArray) => [...prevArray, annoVal.trim()]);
      setAnnoVal("");
    }
  };

  const handleDeleteAnnoVal = (index) => {
    setAnnoucements((prevArray) => prevArray.filter((_, i) => i !== index));
  };

  const validate = () => {
    return annoucements.length !== 0 && day !== "";
  };

  const handleSubmit = async () => {
    if (validate()) {
      const docRef = doc(dbChatBot, "potentialLongs", day);
      try {
        await updateDoc(docRef, {
          annoucements,
        });
        alert("Data updated Successfully!");
      } catch (error) {
        console.log(error);
        alert("Error in updating Data");
      }
    } else {
      alert("Please fill all the fields");
    }
  };

  // RETURNING UI
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
        <div className="w-[80%] m-auto py-10 flex flex-col gap-8">
          <h1 className="text-[30px]">
            {t("adminUploadData.addPotentialLong")}
          </h1>
          <div className="w-[70%] flex flex-col gap-6">
            <div className="flex justify-end gap-10">
              <label>{t("adminUploadData.weekday")} </label>
              <div className="w-[80%]">
                <select
                  className="bg-slate-800 p-2 w-[200px] rounded-lg"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                >
                  <option value="" disabled>
                    Select Day
                  </option>
                  {days.map((item) => (
                    <option key={item} value={item.split("-")[1]}>
                      {t(`followup.${item.split("-")[0]}`)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-10">
              <label>{t("adminUploadData.announcements")}</label>
              <div className="bg-[#201c2c] rounded-lg p-2 w-[80%] h-[70px] flex items-start gap-2 flex-wrap">
                {annoucements.length > 0 &&
                  annoucements.map((item, index) => (
                    <div
                      key={index}
                      className="px-4 bg-slate-800 rounded-[25px] cursor-pointer"
                      onClick={() => handleDeleteAnnoVal(index)}
                    >
                      {item}
                    </div>
                  ))}
                <input
                  type="text"
                  className="bg-slate-800 rounded-[25px] px-3 w-[100px] outline-none"
                  placeholder="Add More ..."
                  value={annoVal}
                  onChange={(e) => setAnnoVal(e.target.value)}
                  onKeyDown={handlePressSpace}
                />
              </div>
            </div>
            <div className="self-end w-fit">
              <button
                className="p-2 bg-[#004f86] rounded-md"
                onClick={handleSubmit}
              >
                {t("adminUploadData.addPotentialLong")}
              </button>
            </div>
          </div>
        </div>
      </Content>
    </div>
  );
};

export default AddPotentialLong;
