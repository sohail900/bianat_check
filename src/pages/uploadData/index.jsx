import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import { Layout, Button, message, Upload, Row, Col, Table } from "antd";
import { uploadFinancialData } from "../../services/apis";
import BianatHeader from "../../components/BianatHeader";
import BianatFooter from "../../components/BianatFooter";
import TickerUpdation from "./TickerUpdation";
import { useTranslation } from "react-i18next";
import { collection, getDocs, updateDoc } from "firebase/firestore";
import { dbChatBot } from "../../utils/firebase/config";

const UploadData = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const { currentTheme } = useSelector((state) => state.currentTheme);
  const { Content } = Layout;

  const uploadFile = (info, dataType) => {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }

    if (info.file.status === "done") {
      // Handle file upload using Axios
      const formData = new FormData();
      formData.append("file", info.file.originFileObj);
      uploadFinancialData(formData, dataType)
        .then((res) => {
          console.log(res);
          message.success("File uploaded successfully");
        })
        .catch((err) => {
          console.log(err);
          message.error("File upload failed");
        });
    }
  };

  const columns = [
    {
      title: "Upload New Data",
      dataIndex: "newdata",
      key: "newdata",
    },
    {
      title: "File Types",
      dataIndex: "fileTypes",
      key: "fileTypes",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
  ];
  const data = [
    {
      key: "1",
      newdata: "Financial Data",
      fileTypes: "Json Only",
      action: (
        <Upload
          accept=".json"
          onChange={(info) => {
            uploadFile(info, "financial");
          }}
        >
          <Button
            type="primary"
            className="flex items-center rounded"
            icon={<UploadOutlined />}
          >
            Upload
          </Button>
        </Upload>
      ),
    },
    ,
    //   {
    //       key: '2',
    //       newdata: 'EPS Annual',
    //       fileTypes: 'xlsx Only',
    //       action: (
    //           <Upload
    //               accept=".xlsx,.xls"
    //               onChange={(info) => {
    //                   uploadFile(info, 'EPSAnnual')
    //               }}
    //           >
    //               <Button
    //                   type="primary"
    //                   className="flex items-center rounded"
    //                   icon={<UploadOutlined />}
    //               >
    //                   Upload
    //               </Button>
    //           </Upload>
    //       ),
    //   },
    {
      key: "3",
      newdata: "IPO Data",
      fileTypes: "Json Only",
      action: (
        <Upload
          accept=".json"
          onChange={(info) => {
            uploadFile(info, "IPO");
          }}
        >
          <Button
            type="primary"
            className="flex items-center rounded"
            icon={<UploadOutlined />}
          >
            Upload
          </Button>
        </Upload>
      ),
    },
    {
      key: "4",
      newdata: "Ticker Data",
      fileTypes: "Json Only",
      action: (
        <Upload
          accept=".json"
          onChange={(info) => {
            uploadFile(info, "ticker");
          }}
        >
          <Button
            type="primary"
            className="flex items-center rounded"
            icon={<UploadOutlined />}
          >
            Upload
          </Button>
        </Upload>
      ),
    },
    {
      key: "5",
      newdata: "Database ticker info update",
      fileTypes: "xlsx Only",
      action: (
        <Upload
          accept=".xlsx,.xls"
          onChange={(info) => {
            uploadFile(info, "ETF");
          }}
        >
          <Button
            type="primary"
            className="flex items-center rounded"
            icon={<UploadOutlined />}
          >
            Upload
          </Button>
        </Upload>
      ),
    },
  ];

  const handleDeleteWeeklyRecord = async () => {
    // confirm
    const confirmation = confirm("Are you sure to delete weekly record?");
    if (!confirmation) {
        return;
    }
    
    const docRef = collection(dbChatBot, "potentialLongs");
    try {
        // Fetch all documents in the collection
        const docSnap = await getDocs(docRef);

        // Iterate through each document to clear the 'announcements' array and update the doc
        const updatePromises = docSnap.docs.map((doc) => {
            const data = doc.data();
            data.annoucements = []; // Clear the announcements array

            // Update the document in Firestore with the modified data
            return updateDoc(doc.ref, { annoucements: [] });
        });

        // Wait for all update operations to complete
        await Promise.all(updatePromises);

        alert("Weekly Record Deleted")

    } catch (error) {
        console.log("Error updating documents: ", error);
    }
};


  return (
    <Layout className={`${currentTheme === "Dark" && "dark-skin"} h-screen`}>
      <BianatHeader />
      <Content
        className={`content font-loader ${
          currentTheme === "Dark" && "dark-skin"
        }`}
        style={{ minHeight: "150vh" }}
      >
        <Row>
          <Col span={24}>
            <Table
              className="max-w-6xl mx-auto block upload-tbl"
              columns={columns}
              dataSource={data}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <TickerUpdation />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div className="px-24">
              <h1>{t("adminUploadData.addPotentialLong")}</h1>
              <button
                className="p-2 bg-[#004f86] rounded-md"
                onClick={() => navigate("/add-potential-long")}
              >
                {t("adminUploadData.addPotentialLong")}
              </button>
              <button
                className="p-2 bg-[#004f86] rounded-md mx-2"
                onClick={handleDeleteWeeklyRecord}
              >
                {t("adminUploadData.deleteWeeklyRecord")}
              </button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div className="px-24">
              <h1>{t("adminUploadData.addOpenPosition")}</h1>
              <button
                className="p-2 bg-[#004f86] rounded-md"
                onClick={() => navigate("/add-open-positions")}
              >
                {t("adminUploadData.addOpenPosition")}
              </button>
            </div>
          </Col>
        </Row>
      </Content>
      <BianatFooter />
    </Layout>
  );
};

export default UploadData;
