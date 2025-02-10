import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Layout, Row, Col, Card, Button, notification, Modal } from 'antd'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import HighLights from './components/Highlights'
import ProgressBar from './components/ProgressBar'
import ChartCandle from './components/ChartCandle'
import ChartBar from './components/ChartBar'
import BianatFooter from '../../components/BianatFooter'
import BianatHeader from '../../components/BianatHeader'
import MarketSnapShot from './components/MarketSnapShot'
import StockAction from './components/StockAction'
import BianatStockList from './components/bianatStockList/bianatStockList'
import IplotTreeMap from '../../components/IplotTreeMap'
import Notification from './components/notifications/Notification'
import BianatTourGuide from '../../components/BianatTourGuide'
import { useNavigate } from 'react-router-dom'
import VideoPlay from './components/Videoplay'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { dbChatBot } from '../../utils/firebase/config'

const Home = () => {
    const { t, i18n } = useTranslation()
    const currentTheme = useSelector((state) => state.currentTheme.currentTheme)
    const auth = useSelector((state) => state.auth)
    const [isGuideOpen, setIsGuideOpen] = useState(false)
    const navigate = useNavigate()

    // Removed subscription check and notification logic

    // useLayoutEffect(() => {
    //     const storedSub = localStorage.getItem("new_sub")
    //     if(storedSub){
    //         let parsedSub = JSON.parse(storedSub)
    //         if(!parsedSub.subscribed){
    //             navigate("/settings")
    //         }
    //     }
    // }, []);
    // Function to open notification
    const openNotification = (daysDiff) => {
        const daysRemaining =
            daysDiff % 1 < 0.5 ? Math.floor(daysDiff) : Math.ceil(daysDiff)
        notification.info({
            message: 'Subscription Expiry Alert',
            description: `Your subscription will expire in ${daysRemaining} days`,
            duration: 5, // duration in seconds
            style: {
                backgroundColor: 'yellow', // Light orange background
                fontWeight: 'bold',
                textAlign: 'left',
            },
            placement: 'topLeft',
        })
    }

    useEffect(() => {
        const storedSub = localStorage.getItem('new_sub')
        const hasSeenNotification = localStorage.getItem(
            'hasSeenDashboardNotification'
        )

        if (storedSub && !hasSeenNotification) {
            let parsedSub = JSON.parse(storedSub)
            if (parsedSub.expiryDate) {
                const currentDate = new Date()
                const expiryDate = new Date(parsedSub.expiryDate)

                // Calculate the difference in milliseconds and convert it to days
                const diffInMs = expiryDate - currentDate
                const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

                if (diffInDays <= 5) {
                    openNotification(diffInDays)
                    localStorage.setItem('hasSeenDashboardNotification', 'true')
                }
            }
        }
    }, [])

    useEffect(() => {
        // Hide widget logic (if necessary)
        if (window.Tawk_API) {
            window.Tawk_API.hideWidget()
        }

        return () => {
            if (window.Tawk_API) {
                window.Tawk_API.showWidget()
            }
        }
    }, [])

    const { Content } = Layout

    return (
        <Layout style={{ height: '100vh' }}>
            <BianatHeader setIsGuideOpen={setIsGuideOpen} />
            <Content
                className={`landing-content ${
                    i18n.language === 'en' ? 'font-loader-en' : 'font-loader'
                } ${currentTheme === 'Dark' && 'dark-skin'}`}
            >
                <div className='live-update-toolbar'>
                    <HighLights />
                </div>
                <div className='main-section'>
                    <div className='padding'>
                        <Row gutter={24}>
                            <Col xs={{ span: 24 }} lg={{ span: 16 }}>
                                <Row gutter={8}>
                                    <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                                        <Card
                                            className='mini-chart-card'
                                            title={t('TASI')}
                                        >
                                            <ChartBar />
                                            <div className='mini-progress'>
                                                <Row gutter={16}>
                                                    <Col
                                                        xs={{ span: 24 }}
                                                        lg={{ span: 12 }}
                                                    >
                                                        <ProgressBar
                                                            label1='Advancing'
                                                            label2='Declining'
                                                            stockName='TASI'
                                                            specificStock='advancing-declining'
                                                            middleLabel={'same'}
                                                        />
                                                    </Col>
                                                    <Col
                                                        xs={{ span: 24 }}
                                                        lg={{ span: 12 }}
                                                    >
                                                        <ProgressBar
                                                            label1='New High'
                                                            label2='New Low'
                                                            stockName='TASI'
                                                            specificStock='new-high-low'
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row
                                                    gutter={16}
                                                    style={{ marginTop: 10 }}
                                                >
                                                    <Col span={12}>
                                                        <ProgressBar
                                                            label1='Above'
                                                            label2='Below'
                                                            middleLabel='50sma'
                                                            specificStock='above-below-sma50'
                                                            stockName='TASI'
                                                            sma='sma50'
                                                        />
                                                    </Col>
                                                    <Col span={12}>
                                                        <ProgressBar
                                                            label1='Above'
                                                            label2='Below'
                                                            middleLabel='200sma'
                                                            specificStock='above-below-sma200'
                                                            sma='sma200'
                                                            stockName='TASI'
                                                        />
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Card>
                                    </Col>
                                    <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                                        <Card
                                            className='mini-chart-card'
                                            title={t('NomuC')}
                                        >
                                            <ChartCandle />
                                            <div className='mini-progress'>
                                                <Row gutter={8}>
                                                    <Col
                                                        xs={{ span: 24 }}
                                                        lg={{ span: 12 }}
                                                    >
                                                        <ProgressBar
                                                            label1='Advancing'
                                                            label2='Declining'
                                                            stockName='NOMU'
                                                            specificStock='advancing-declining'
                                                            middleLabel={'same'}
                                                        />
                                                    </Col>
                                                    <Col
                                                        xs={{ span: 24 }}
                                                        lg={{ span: 12 }}
                                                    >
                                                        <ProgressBar
                                                            label1='New High'
                                                            label2='New Low'
                                                            stockName='NOMU'
                                                            specificStock='new-high-low'
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row
                                                    gutter={16}
                                                    style={{ marginTop: 10 }}
                                                >
                                                    <Col
                                                        xs={{ span: 24 }}
                                                        lg={{ span: 12 }}
                                                    >
                                                        <ProgressBar
                                                            label1='Above'
                                                            label2='Below'
                                                            middleLabel='50sma'
                                                            stockName='NOMU'
                                                            specificStock='above-below-sma50'
                                                            sma='sma50'
                                                        />
                                                    </Col>
                                                    <Col
                                                        xs={{ span: 24 }}
                                                        lg={{ span: 12 }}
                                                    >
                                                        <ProgressBar
                                                            label1='Above'
                                                            label2='Below'
                                                            middleLabel='200sma'
                                                            sma='sma200'
                                                            specificStock='above-below-sma200'
                                                            stockName='NOMU'
                                                        />
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row gutter={8}>
                                    <MarketSnapShot />
                                    <StockAction />
                                </Row>
                                <Row gutter={8}>
                                    <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                                        <BianatStockList />
                                    </Col>
                                    <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                                        <VideoPlay />
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={{ span: 24 }} lg={{ span: 8 }}>
                                <Notification className='announcement' />
                                <div className='treechart'>
                                    <IplotTreeMap />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
                <BianatTourGuide
                    isOpen={isGuideOpen}
                    setIsGuideOpen={setIsGuideOpen}
                    steps={[
                        {
                            selector: '.live-update-toolbar',
                            content: 'Live Stocks Update',
                        },
                        {
                            selector: '.mini-chart-card',
                            content: 'Index Chart',
                        },
                        {
                            selector: '.mini-progress',
                            content: 'Index Progress Bar',
                        },
                        {
                            selector: '.treechart',
                            content: 'Market Heat Map',
                        },
                        {
                            selector: '.announcement',
                            content: 'Announcement Section',
                        },
                    ]}
                />
            </Content>
            <BianatFooter />
        </Layout>
    )
}

export default Home
