import React, {useState} from 'react'
import { Card, Tabs, Row, Col } from 'antd'
import { useTranslation } from 'react-i18next'
import MarketSmithStock from './components/MarketsmithStock'


const BianatStockList = () => {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState('1')

    return (
        <Card
            className="info-card "
            // title={t('High Relative Strength Stock List')}
        >
            <div className="info-tabs">
                <Row className='items-center'>
                    <Col span={12}>
                        <h3 className='heading'>
                            High Relative Strength Stock List
                        </h3>
                    </Col>
                    <Col span={12}>
                        <Tabs
                            defaultActiveKey="1"
                            tabBarGutter={30}
                            tabPosition="top"
                            className="info-card__tabs"
                            onChange={(e) => {
                                setActiveTab(e)
                            }}
                            items={[
                                {
                                    label: t('Stocks'),
                                    key: '1',
                                    // children: <MarketSmithStock index="TASI" />,
                                },
                                {
                                    label: t('Mutual Fund'),
                                    key: '2',
                                    // children: <MarketSmithStock index="Mutual Fund" />,
                                },
                            ]}
                        />
                    </Col>
                </Row>
            </div>

            <Row>
                <Col span={24}>
                    {activeTab === '1' && <MarketSmithStock index="TASI" />}
                    {activeTab === '2' && (
                        <MarketSmithStock index="Mutual Fund" />
                    )}
                </Col>
            </Row>
        </Card>
    )
}
 
export default BianatStockList;