import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  useReducer,
  useCallback,
} from "react";
import {
  Layout,
  Tabs,
  Modal,
  Input,
  message,
  Checkbox,
  Form,
  InputNumber,
} from "antd";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import BianatHeader from "../../components/BianatHeader";
import PerformerTable from "./components/PerformerTable";
import TechnicalTable from "./components/TechnicalTable";
import FinancialTable from "./components/FinancialTable";
import ValuationTable from "./components/ValuationTable";
import { KuzzleContext } from "../../App";
import { createQuery } from "../../utils/createQuery";
import { useQuery } from "../../hooks/useQuery";
import FilterTabs from "./components/FilterTabs";
import SubscriptionGaurd from "../../hoc/SubscriptionGaurd";
import BianatFooter from "../../components/BianatFooter";

/**
 * @name ScreenerContext
 * @description Context for Screener
 * @param {Object} props - The props passed to the component.
 * @returns {JSX.Element} - The component.
 */

const { Content } = Layout;
const { TabPane } = Tabs;

const filters = (state, action) => {
  switch (action.type) {
    case "updateFilterData":
      return { ...state, data: action.payload };
    case "updateFilter":
      return { ...state, filter: action.payload };
    case "updateFiltersOptions": {
      return { ...state, filtersOptions: action.payload };
    }
  }
};

export const ScreenerContext = createContext();

const Stocks = () => {
  const [form] = Form.useForm();
  const [customForm] = Form.useForm();
  const { filterSettings, auth } = useSelector((state) => state);
  console.log('setting',filterSettings)
  const { i18n } = useTranslation();
  const query = useQuery();
  const currentTheme = useSelector((state) => state.currentTheme.currentTheme);
  const action = query.get("action");
  const selectedScreener = query.get("screener");

  const { kuzzleHttp: kuzzle } = useContext(KuzzleContext);
  const [loading, isLoading] = useState(selectedScreener ? true : false);
  const [isCustom, setIsCustom] = useState({
    isVisible: false,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFilterTab, setSelectedFilterTab] = useState("all");

  const isAdmin = auth.user.roles.includes("admin");

  const [state, dispatch] = useReducer(filters, {
    data: [],
    filter: {},
  });

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleSaveForm = async (values) => {
    const { name, isPublic } = values;
    try {
      await kuzzle.document.create("bianat", "screener", {
        ...state.filter,
        title: name,
        username: auth?.user?.username,
        isPublic: isAdmin ? isPublic : false,
      });
      message.success("Filter saved successfully", 10);
      setIsModalVisible(false);
    } catch (err) {
      message.error("Error: Saving Filter", 10);
    }
  };

  const handleCustomFormSubmit = (values) => {
    const { max, min } = values;
    updateFilters({
      ...state.filter,
      [isCustom.title]: `> ${min} & <= ${max}`,
    });
  };

  const handleCustomModal = () => {
    customForm.submit();
    handleCancelCustom();
  };

  const handleOk = async () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleFieldsChange = (changedFields) => {
    console.log(changedFields);
    const change = changedFields.reduce((acc, curr) => {
      if (curr?.value === "custom") {
        setIsCustom({
          isVisible: true,
          title: curr.name,
        });
      } else if (curr?.value) {
        acc[curr.name] = curr.value;
      }
      return acc;
    }, {});

    if (Object.keys(change).length > 0) {
      updateFilters({ ...state.filter, ...change });
    } else {
      deleteFilterKey(changedFields[0].name);
    }
  };

  const applyFilters = useCallback(async () => {
    const query = createQuery(state.filter, action);

    const data = await kuzzle.document.search("bianat", "indicators", query, {
      size: 1000,
    });

    return data.hits.map((item) => item._source);
  }, [state.filter]);

  const updateFiltersData = (data) => {
    dispatch({ type: "updateFilterData", payload: data });
  };

  const updateFilters = (filter) => {
    dispatch({ type: "updateFilter", payload: filter });
  };

  const deleteFilterKey = (key) => {
    const obj = { ...state.filter };
    delete obj[key];
    dispatch({ type: "updateFilter", payload: obj });
  };

  useEffect(() => {
    const fetchSelectedFilter = async () => {
      if (selectedScreener) {
        const data = await kuzzle.document.get(
          "bianat",
          "screener",
          selectedScreener
        );

        const filter = { ...data._source };

        updateFilters(filter);
        isLoading(false);
      }
    };

    fetchSelectedFilter();
  }, [selectedScreener]);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await applyFilters(query);
        updateFiltersData(data);
      } catch (err) {
        console.log(err);
      }
    };

    if (!loading) {
      getData();
    }
  }, [state.filter, loading]);

  const handleCancelCustom = () => {
    setIsCustom({
      isVisible: false,
    });
  };

  useEffect(() => {
    if (window.Tawk_API) {
      window.Tawk_API.hideWidget();
    }
    return () => {
      if (window.Tawk_API) {
        window.Tawk_API.showWidget();
      }
    };
  }, []);

  return (
    <Layout style={{ height: "100vh" }}>
      <BianatHeader />
      <Content
        className={`screening-content ${
          i18n.language === "en" ? "font-loader-en" : "font-loader"
        } ${currentTheme === "Dark" && "dark-skin"}`}
      >
        <ScreenerContext.Provider
          value={{ ...state, showModal, updateFilters }}
        >
          {!loading && (
            <div className="detail-table">
              <Tabs
                tabPosition="left"
                type="card"
                className="xtab"
                size="large"
                centered
                style={!action ? {} : { display: "none" }}
                defaultActiveKey={selectedFilterTab}
                onChange={(key) => setSelectedFilterTab(key)}
              >
                {Object.keys(filterSettings).map((key, index) => (
                  <TabPane
                    style={{ maxHeight: "200px", overflow: "auto" }}
                    tab={filterSettings[key].name}
                    key={key}
                  >
                    <div style={{ marginTop: "20px" }}>
                      <SubscriptionGaurd
                        id={filterSettings[key].id}
                        page="screener"
                      >
                        <FilterTabs
                          key={index}
                          filterId={key}
                          handleFieldsChange={handleFieldsChange}
                          settings={filterSettings}
                        />
                      </SubscriptionGaurd>
                    </div>
                  </TabPane>
                ))}
              </Tabs>

              <Tabs defaultActiveKey="1" className="xtab-fill">
                <TabPane tab="Overview" key="1">
                  <PerformerTable />
                </TabPane>
                <TabPane tab="Valuation" key="2">
                  <ValuationTable />
                </TabPane>
                <TabPane tab="Financial" key="3">
                  <FinancialTable />
                </TabPane>
                <TabPane tab="Technical" key="4">
                  <TechnicalTable />
                </TabPane>
                <TabPane tab="Ownership" key="5">
                  Content of Tab Pane 4
                </TabPane>
                <TabPane tab="Performance" key="6">
                  Content of Tab Pane 5
                </TabPane>

                <TabPane tab="Custom" key="7">
                  Content of Tab Pane 4
                </TabPane>
                <TabPane tab="Charts" key="8">
                  Content of Tab Pane 5
                </TabPane>
              </Tabs>
            </div>
          )}
          <Modal
            onCancel={handleCancelCustom}
            title={isCustom.title || "Custom"}
            visible={isCustom.isVisible}
            onOk={handleCustomModal}
            className={`${currentTheme === "Dark" && "dark-skin"}`}
          >
            <Form
              form={customForm}
              onFinish={handleCustomFormSubmit}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 24 }}
            >
              <Form.Item
                name="min"
                label="min"
                hasFeedback={true}
                rules={[
                  {
                    required: true,
                    message: "Please input min value!",
                  },
                ]}
              >
                <InputNumber min={0} max={99} defaultValue={10} />
              </Form.Item>
              <Form.Item
                name="max"
                label="max"
                hasFeedback={true}
                dependencies={["min"]}
                rules={[
                  {
                    required: true,
                    message: "Please Enter Max Value!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("min") <= value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("MIN value should be less than MAX value!")
                      );
                    },
                  }),
                ]}
              >
                <InputNumber min={0} max={99} defaultValue={90} />
              </Form.Item>
            </Form>
          </Modal>
        </ScreenerContext.Provider>

        <Modal
          title="Filter"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form form={form} onFinish={handleSaveForm}>
            <Form.Item
              label="Filter Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input the filter name!",
                },
              ]}
            >
              <Input placeholder="Enter Filter Name" />
            </Form.Item>
            {isAdmin && (
              <Form.Item label="Public" name="isPublic" valuePropName="checked">
                <Checkbox />
              </Form.Item>
            )}
          </Form>
        </Modal>
      </Content>
      <BianatFooter />
    </Layout>
  );
};

export default Stocks;
