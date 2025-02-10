import { Content } from "antd/lib/layout/layout";
import BianatHeader from "../../components/BianatHeader";
import HighLights from "../home/components/Highlights";
import { dbChatBot } from "../../utils/firebase/config";

//////////////////////

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { collection, getDocs } from "firebase/firestore";

const FollowUp = () => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [dataJson , setDataJson] = useState([])
  const dayOrder = ["Sunday" ,"Monday", "Tuesday", "Wednesday", "Thursday", "Friday" , "Saturday"];
  const fetchData = async ()=>{
    try {
      const response =await getDocs(collection(dbChatBot, "potentialLongs"))
      const data = response.docs.map((doc) => doc.data());
      // console.log(data)
      const sortedData = data.sort((a, b) => {
        return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
      });
      setDataJson(sortedData)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, []);




  // ESSENTIALS
  const { t, i18n } = useTranslation();
  const currentTheme = useSelector((state) => state.currentTheme.currentTheme);

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
        <div className="px-8 py-8 flex flex-col gap-8">
          <h1 className="text-[30px]">{t("followup.potentialLongs")}</h1>
          <div className="border-1 border-white pb-20">
            <div
              className={`flex flex-col gap-4 ${
                currentTheme === "Dark" ? "bg-[#283142]" : "bg-[#f0f4fc]"
              } px-8 py-8`}
            >
              {dataJson && dataJson.map((item , index) => (
                <div className="flex justify-stretch align-middle" key={index}>
                  <div className={`py-4 w-[200px] text-center ${
                          currentTheme === "Dark"
                            ? "bg-blue-800"
                            : "bg-[#fff] border-r-2 border-[#f0f4fc]"
                        } `}>
                    {t(`followup.${item.day}`)}
                    {/* hello */}
                  </div>
                  <div
                    className={`py-4 px-10 flex gap-3 ${
                      currentTheme === "Dark" ? "bg-[#2a3346]" : "bg-[#ffffff]"
                    } w-full`}
                  >
                    {item.annoucements.map((item) => (
                      <div
                        className={` ${
                          currentTheme === "Dark"
                            ? "bg-[#38435e]"
                            : "bg-[#f0f4fc]"
                        }  px-2 rounded-lg`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Content>
    </div>
  );
};

export default FollowUp;
