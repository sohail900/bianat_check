import React, { useEffect, useState } from 'react'
import { Divider, Layout, List, Col, Row } from 'antd'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import BianatHeader from '../../components/BianatHeader'
import Footer from '../landing/Components/Footer'
import { MinusOutlined } from '@ant-design/icons'
import Navbar from '../../components/HeaderOutside'
const AboutUs = () => {
    const { Content } = Layout
    const { t, i18n } = useTranslation()
    const { currentTheme } = useSelector((state) => state.currentTheme)

    const data = [
        {
            title: t('bianat_services_1'),
        },
        {
            title: t('bianat_services_2'),
        },
        {
            title: t('bianat_services_3'),
        },
    ]
    return (
        <Layout>
            <Row>
                <Col span={24}>
                    <div className=" mx-auto px-5 md:px-10">
                        <Navbar />
                        <Content
                            className={`pb-6 font-lodaer-en-cairo mt-0`}
                        >
                            <div className="banner-about-us">
                                <h1 className="text-center">{t('About Us')}</h1>
                                <p className="banner-text fs-16">
                                    {t(
                                        'Bianat platform founded in 2022, licensed by Tadawul.'
                                    )}
                                </p>
                            </div>

                            <div className="section-content">
                                <p>{t('bianat_regestration_details')}</p>
                                <h3>{t('Our services')}</h3>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={data}
                                    renderItem={(item, index) => (
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={
                                                    <MinusOutlined
                                                        className={`icon-text-color ${
                                                            i18n?.language ===
                                                                'ar' && 'ml-2'
                                                        }`}
                                                    />
                                                }
                                                title={
                                                    <span>{item.title}</span>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                                <h3>{t('Our Goal')}</h3>
                                <span>{t('our_goal_detail')}</span>
                                <h3>{t('Our Vision')}</h3>
                                <span>{t('our_vision_detail')}</span>
                            </div>
                            <Divider />
                            <Footer />
                        </Content>
                    </div>
                </Col>
            </Row>
        </Layout>
    )
}

export default AboutUs
