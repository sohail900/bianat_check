import React, { useEffect, useState } from 'react'
import { Button, Divider, Layout, List, Col, Row } from 'antd'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Footer from '../landing/Components/Footer'
import { MinusOutlined } from '@ant-design/icons'
import Navbar from '../../components/HeaderOutside'
import { useNavigate } from 'react-router-dom'
import Video from './components/Video'

const SaudiFundingDayYear = () => {
    const { Content } = Layout
    const { t, i18n } = useTranslation()
    const { currentTheme } = useSelector((state) => state.currentTheme)
    const navigate = useNavigate()

    useEffect(() => {}, [])
    const data = [
        {
            title: t('dashboard_title'),
            description: t('Dashboard-description'),
        },
        {
            title: t('Market_Pulse'),
            description: t('Market_Pulse_description'),
        },
        {
            title: t('Financial_and_technical_analysis'),
            description: t('Financial_and_technical_analysis_description'),
        },
        {
            title: t('Weekly_Videos'),
            description: t(
                'Weekly_Videos_description'
            ),
        },
    ]

    
    return (
        <Layout>
            <Row>
                <Col span={24}>
                    <div className="mx-auto px-5 md:px-10">
                        <Navbar />

                        <Content className={`pb-6 font-lodaer-en-cairo mt-0`}>
                            <div className="banner-about-us">
                                <h1 className="text-center">
                                    {t('Bianat Platform')}
                                </h1>
                                <p className="banner-text fs-16">
                                    {t('annual_package')}
                                </p>
                            </div>

                            <div className="section-content">
                                <h2 className="mb-1 fs-24">
                                    {t('package_offer_title')}
                                </h2>
                                <p className="fs-16">
                                    {t('package_offer_description')}
                                </p>
                                <h3>
                                    {t(
                                        'The package includes access to the following:'
                                    )}
                                </h3>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={data}
                                    renderItem={(item, index) => (
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={
                                                    <MinusOutlined className="icon-text-color" />
                                                }
                                                title={
                                                    <span className="font-semibold">
                                                        {item.title}
                                                    </span>
                                                }
                                                description={item.description}
                                            />
                                        </List.Item>
                                    )}
                                />
                                <h3>{t('Bianat Offer')}</h3>
                                <div className="flex flex-col">
                                    <div>
                                        <p className="fs-16">
                                            {t('bianat_offer_description')}
                                        </p>
                                        <p className="green-color fs-24 my-2">
                                            {t('SR 999 per year')}
                                        </p>

                                        <div className="flex items-center flex-row justify-center">
                                            <Button
                                                type="primary"
                                                className="my-3"
                                                onClick={() =>
                                                    navigate(
                                                        `/sign-up?planId=${999}`,{
                                                            state:{
                                                                from:'freeUser'
                                                            }
                                                        }
                                                    )
                                                }
                                            >
                                                {t('Subscribe Now')}
                                            </Button>
                                            <div className="ms-4">
                                                <p>
                                                    {t(
                                                        'The offer is valid for a limited time.'
                                                    )}
                                                </p>
                                                <p>
                                                    {t(
                                                        'Get full access to the features, tools, and data that the platform provides.'
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <Video />
                                    </div>
                                </div>
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

export default SaudiFundingDayYear
