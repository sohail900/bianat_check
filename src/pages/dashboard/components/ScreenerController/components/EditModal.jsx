import React, { useState, useContext, useEffect } from "react";
import {
  Modal,
  Row,
  Form,
  Input,
  Col,
  message,
  Tabs,
  Button,
  Space,
  Table,
  Checkbox,
  Collapse,
} from "antd";
import { useSelector } from "react-redux";
import { DeleteOutlined } from "@ant-design/icons";
import esb from "elastic-builder";
import { useTranslation } from "react-i18next";
import FilterForm from "../../../../../components/FilterForm";
import { KuzzleContext } from "../../../../../App";
import { createQuery } from "../../../../../utils/createQuery";
import SubscriptionGaurd from "../../../../../hoc/SubscriptionGaurd";

/**
 * @name EditModal
 * @description EditModal component
 * @param {boolean} visible  visible
 * @param {function} setVisible  set visible
 * @param {string} title  title
 * @param {function} setScreeners  set screeners
 * @param {function} editScreener  edit screener
 * @param {function} handleCurrentFilter  handle current filter
 * @param {function} handleShowScreener  handle show screener
 * @param {function} setEditScreener  set edit screener
 * @returns {JSX} JSX element
 */

const { TabPane } = Tabs;

const EditModal = ({
  visible,
  setVisible,
  title,
  setScreeners,
  editScreener,
  handleCurrentFilter,
  handleShowScreener,
  setIsScreenerAdded,
  IsScreenerAdded,
  setEditScreener,
  currentTree,
}) => {
  const { user } = useSelector((state) => state.auth);
  const { kuzzleHttp: kuzzle } = useContext(KuzzleContext);
  const [form] = Form.useForm();
  const { t, i18n } = useTranslation();

  const filterSettings = useSelector((state) => state.filterSettings);
  const { currentTheme } = useSelector((state) => state.currentTheme);
  const [isPublicChecked, setIsPublicChecked] = useState(false);
  const [filter, setFilter] = useState({});
  const [summary, setSummary] = useState({});
  const [deletedKey, setDeletedKey] = useState(null);
  const [total, setTotal] = useState(0);
  const [activeTab, setActiveTab] = useState("BianatSelectRating");
  const isAdmin = user.roles.includes("admin");

  const fetchSummaryCount = async (filters) => {
    const query = createQuery(filters);
    const count = await kuzzle.document.count("bianat", "indicators", query);
    return count;
  };

  useEffect(() => {
    const fetchDocumentCount = async () => {
      const count = await fetchSummaryCount({});
      setTotal(count);
    };

    fetchDocumentCount();
  }, []);

  useEffect(() => {
    const fetchSummary = async () => {
      const tempSummary = { ...filter };

      delete tempSummary.title;
      delete tempSummary.isPublic;
      delete tempSummary._kuzzle_info;
      delete tempSummary.username;
      delete tempSummary._id;
      delete tempSummary.key;

      if (Object.keys(tempSummary).length > 0) {
        const filterValues = Object.entries(tempSummary);

        const tempResult = await (async () => {
          let temp = filterValues.filter(item=>{
            if (
              (item[1]?.min === null || item[1]?.min === undefined) &&
              (item[1]?.max === null || item[1]?.max === undefined)
            ) {
              return false;
            }
            return true;
          })
          const previous = {};
          for await (const current of temp) {
            const [key, value] = current;

            previous.filters = {
              ...previous.filters,
              [key]: value,
            };

            const count = await fetchSummaryCount(previous.filters);

            const key_translation = filterSettings[activeTab].filters.find(
              (item) => item.id === key
            );

            previous[key] = {
              key: key_translation
                ? i18n.language === "ar"
                  ? key_translation?.nameAr
                  : key_translation?.name
                : key,
              condition:
                typeof value === "object"
                  ? `${value?.min ? value?.min : ""} <= ${
                      value?.max ? value?.max : ""
                    }`
                  : value,
              count,
            };
          }
          return previous;
        })();

        delete tempResult.filters;

        const newState = Object.keys(tempResult).reduce((acc, key) => {
          if (!key.includes(deletedKey)) {
            acc[key] = tempResult[key];
          }
          return acc;
        }, {});

        setSummary(newState);
        setDeletedKey(null);
      } else {
        setSummary({});
      }
    };

    if (filter) {
      fetchSummary();
    }
  }, [filter]);

  useEffect(() => {
    if (editScreener) {
      setFilter(() => editScreener);
      form.setFieldsValue(editScreener);
    } else {
      setFilter({});
    }
  }, [editScreener]);

  const handleFieldsChange = (changedFields) => {
    if (changedFields[0].name !== "title") {
      const change = changedFields.reduce((acc, curr) => {
        if (curr.value === "custom") {
          setIsCustom({
            isVisible: true,
            title: curr.name,
          });
        } else if (curr.value) {
          acc[curr.name] = curr.value;
        }
        return acc;
      }, {});
      
      if (Object.keys(change).length > 0) {
        setFilter((state) => ({ ...state, ...change }));
      } else {
        setFilter((state) => {
          const filter = { ...state };
          delete filter[changedFields[0].name];
          setDeletedKey(changedFields[0].name);
          return filter;
        });
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      const data = JSON.parse(JSON.stringify(values));
      let screenerData;
      if (editScreener) {
        const isInScreener = await kuzzle.document.search(
          "bianat",
          "screener",
          esb
            .requestBodySearch()
            .query(esb.boolQuery().must(esb.termQuery("_id", editScreener._id)))
            .toJSON()
        );

        if (isInScreener.hits.length > 0) {
          const response = await kuzzle.document.createOrReplace(
            "bianat",
            "screener",
            editScreener._id,
            data
          );

          setScreeners((state) =>
            state.map((screener) =>
              screener._id === response._id
                ? { ...screener, ...response._source }
                : screener
            )
          );

          screenerData = { ...response._source, _id: response._id };
        } else {
          const folderSpecificScreeners = await kuzzle.document.search(
            "bianat",
            `${currentTree}`,
            esb
              .requestBodySearch()
              .query(
                esb.boolQuery().must([esb.termQuery("username", user.username)])
              )
          );

          let folderData = [];
          folderSpecificScreeners.hits[0]._source.folders.forEach((folder) => {
            let screeners = [];
            folder.screeners.forEach((screener) => {
              if (screener._id === editScreener._id) {
                screener = data;
              }
              screeners.push(screener);
            });

            folderData.push({
              ...folder,
              screeners,
            });
          });

          const response = await kuzzle.document.update(
            "bianat",
            `${currentTree}`,
            `${user.username}`,
            {
              username: user.username,
              folders: [...folderData],
              // screeners: [...selectedScreeners],
            }
          );
        }
      } else {
        const response = await kuzzle.document.create("bianat", "screener", {
          ...data,
          username: user.username,
          isPublic: isAdmin ? isPublicChecked : false,
        });

        setScreeners((state) => [
          ...state,
          { ...response._source, _id: response._id },
        ]);

        screenerData = { ...response._source, _id: response._id };
      }

      handleCurrentFilter(screenerData);
      handleShowScreener(true);
      setVisible(false);
      form.resetFields();
    } catch (err) {
      message.error(err.message);
    }

    setIsScreenerAdded(!IsScreenerAdded);
  };

  const handleViewAndSave = async () => {
    form.submit();
  };

  const handleCancel = () => {
    setFilter(() => ({}));
    setEditScreener(undefined);
    setVisible(false);
    form.setFieldsValue(
      Object.keys(filter).reduce((acc, curr) => {
        acc[curr] = undefined;
        return acc;
      }, {})
    );
  };

  const onReset = () => {
    setFilter(() => ({}));
    setEditScreener(undefined);
    form.setFieldsValue(
      Object.keys(filter).reduce((acc, curr) => {
        acc[curr] = undefined;
        return acc;
      }, {})
    );
  };

  const handleDeleteFilter = (key, record) => {
    let filterKey;

    const newSummary = Object.keys(summary).reduce((acc, curr) => {
      if (summary[curr].key !== key.key) {
        acc[curr] = summary[curr];
      } else {
        filterKey = curr;
      }
      return acc;
    }, {});

    setFilter((state) => {
      const filter = { ...state };
      delete filter[filterKey];
      return filter;
    });

    form.setFieldsValue({
      [filterKey]: undefined,
    });

    setSummary(() => newSummary);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <Modal
      className={`${currentTheme === "Dark" && "dark-skin"} filter-modal
       ${i18n.language === "en" ? "font-loader-en" : "font-loader"}`} //copy
      width={"80%"}
      footer={[
        <Button type="primary" onClick={handleViewAndSave}>
          {t("Save & View")}
        </Button>,
        <Button onClick={onReset}>{t("Reset")}</Button>,
        <Button onClick={handleCancel}>{t("Cancel")}</Button>,
      ]}
      title={t(title)}
      visible={visible}
      onCancel={handleCancel}
    >
      <Form
        id="screener-form"
        form={form}
        name={"all"}
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 12 }}
        autoComplete="false"
        initialValues={filter}
        onFieldsChange={handleFieldsChange}
        onFinish={handleSubmit}
      >
        <Row gutter={[8, 0]}>
          <Col span={16}>
            <Row gutter={[12, 0]} className="mb-10">
              <Col className="gutter-row" span={12}>
                <Form.Item
                  label={t("Title")}
                  name="title"
                  className="max-w-300"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Title of Screener!!",
                    },
                  ]}
                >
                  <Input size="small" placeholder={t("Title")} />
                </Form.Item>
              </Col>

              {isAdmin && (
                <Col className="gutter-row" span={12}>
                  <Form.Item
                    label={t("Public")}
                    name="isPublic"
                    className="max-w-300"
                  >
                    <Checkbox
                      checked={isPublicChecked}
                      onChange={(e) => setIsPublicChecked(e.target.checked)}
                    />
                  </Form.Item>
                </Col>
              )}
            </Row>
            <Tabs
              type="card"
              className="xtab modal-tabs"
              tabPosition="left"
              size="large"
              tabBarStyle={{ width: 180 }}
              onChange={handleTabChange}
              centered
            >
              {filterSettings &&
                Object.keys(filterSettings).map((key, index) => (
                  <TabPane
                    tab={t(filterSettings[key].name)}
                    key={key}
                    className="modal-tabs-inside"
                  >
                    {/* <SubscriptionGaurd
                      id={filterSettings[key].id}
                      page="screener"
                    > */}
                      <Row gutter={[8, 0]}>
                        <FilterForm settings={filterSettings[key].filters} />
                      </Row>
                    {/* </SubscriptionGaurd> */}
                  </TabPane>
                ))}
            </Tabs>
          </Col>
          <Col span={8}>
            <div className="selected-box">
              <Table
                pagination={false}
                columns={[
                  {
                    title: t("CRITERIA"),
                    dataIndex: "key",
                  },
                  {
                    title: t("VALUES"),
                    dataIndex: "condition",
                  },
                  {
                    title: t("REMAINING"),
                    dataIndex: "count",
                  },
                  {
                    title: t("ACTION"),
                    key: "action",
                    render: (text, record) => (
                      <Space size="middle">
                        <Button
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeleteFilter(text, record)}
                        />
                      </Space>
                    ),
                  },
                ]}
                dataSource={[
                  {
                    key: t("Stocks in Database"),
                    count: total,
                  },
                  ...Object.values(summary),
                ]}
                size="small"
              />
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EditModal;
