import React, { useState, useEffect, useContext } from 'react'
import { Col, Row, Card } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import {
    updateScreener,
    updateScreenerName,
} from '../../../features/Screener/screenerSlice'
import { getStockActionsData } from '../../../services/apis'

const StockAction = () => {
    const [currentLanguage, setCurrentLanguage] = useState()

    const [stockActionData, setStockActionData] = useState({
        upOnVolume: 0,
        downOnVolume: 0,
        breakout: 0,
        nearPivot: 0,
    })

    const { i18n, t } = useTranslation()
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchData = async () => {
            const data = await getStockActionsData()
            setStockActionData(data)
        }

        fetchData()
    }, [])

    useEffect(() => {
        setCurrentLanguage(i18n.language)
    }, [i18n.language])

    const changeScreener = (item, name) => {
        dispatch(updateScreenerName(name))
        window.open(
            `/console?action=${item}`,
            'window',
            'toolbar=no, menubar=no, resizable=yes'
        )
    }

    const faAngle = () => {
        return `fa-solid ${
            currentLanguage === 'en' ? 'fa-angle-right' : 'fa-angle-left'
        }`
    }

    return (
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
            <Card className='info-card min-h' title={`${t('Stock_Action')}`}>
                <div className='data-list'>
                    <Row gutter={8}>
                        <Col span={12}>
                            <label className='label'>{`${t('price')}:`}</label>
                        </Col>
                        <Col span={12}>
                            <span
                                className='highlight-stock'
                                onClick={() => {
                                    changeScreener('all-all', 'Price')
                                }}
                            >
                                {t('All')} {`${t('stocks')}`}{' '}
                                <i className={faAngle()}></i>
                            </span>
                        </Col>
                        <Col span={12}>
                            <label className='label'>{`${t(
                                'up_on_volume'
                            )}:`}</label>
                        </Col>
                        <Col span={12}>
                            <span
                                className='highlight-stock'
                                onClick={() => {
                                    changeScreener(
                                        'upOnVolume-all',
                                        'Up On Volume'
                                    )
                                }}
                            >
                                {stockActionData?.upOnVolume} {`${t('stocks')}`}{' '}
                                <i className={faAngle()}></i>
                            </span>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={12}>
                            <label className='label'>{`${t(
                                'down_on_volume'
                            )}:`}</label>
                        </Col>
                        <Col span={12}>
                            <span
                                className='highlight-stock'
                                onClick={() => {
                                    changeScreener(
                                        'downOnVolume-all',
                                        'Down On Volume'
                                    )
                                }}
                            >
                                {stockActionData?.downOnVolume}{' '}
                                {`${t('stocks')}`} <i className={faAngle()}></i>
                            </span>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={12}>
                            <label className='label'>{`${t(
                                'Breaking_Out_Today'
                            )}:`}</label>
                        </Col>
                        <Col span={12}>
                            <span
                                className='highlight-stock'
                                onClick={() => {
                                    changeScreener(
                                        'breakout-all',
                                        'Breaking Out Today'
                                    )
                                }}
                            >
                                {stockActionData?.breakout}&nbsp;
                                {`${t('stocks')}`} <i className={faAngle()}></i>
                            </span>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col span={12}>
                            <label className='label'>{`${t(
                                'Near_Pivot'
                            )}:`}</label>
                        </Col>
                        <Col span={12}>
                            <span
                                className='highlight-stock'
                                onClick={() => {
                                    changeScreener(
                                        'near_pivot-all',
                                        'Near Pivot'
                                    )
                                }}
                            >
                                {stockActionData?.nearPivot}&nbsp;
                                {`${t('stocks')}`} <i className={faAngle()}></i>
                            </span>
                        </Col>
                    </Row>
                </div>
            </Card>
        </Col>
    )
}

export default StockAction
