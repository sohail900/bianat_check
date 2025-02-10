import React, { useState } from "react";
import { Row, Col, Button, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import {
  caretComponent,
  numFormatter,
} from "../../../../utils/ReuseableFunctions";
import {  InfoCircleOutlined, InfoOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";

const calculateVolumeChange = (currentVolume, previousVolume) => {
  if (currentVolume && previousVolume) {
    const change = currentVolume - previousVolume;
    const changePercentage = (change / previousVolume) * 100;
    return changePercentage.toFixed(2);
  }
  return 0;
};

const ResourceView = ({
    data,
    change,
    change_p,
    close,
    lastUpdated,
    dayEndVolume,
    handleIsopen,
}) => {
    const { t, i18n } = useTranslation()
    const [isCollapse, setIsCollapse] = useState(false)
    const {
        name,
        webURL,
        address,
        code,
        description,
        marketCapitalization,
        sharesFloat,
        sharesOutstanding,
        dayMA50,
        weekHigh52,
        weekLow52,
        volume,
        shortName,
        sector,
        industry,
    } = data
    const calculateOff52Week = () => {
        const off52Week = ((close - weekHigh52) / weekHigh52) * 100
        return off52Week.toFixed(2)
    }

    const handleCollSpan = () => {
        setIsCollapse(!isCollapse)
    }
    const fixValue = (value) => {
        return value > 0 ? `+${value?.toFixed(2)}` : value?.toFixed(2)
    }

    return (
        <>
            <Row>
                <Col span={18} style={{ display: 'flex' }}>
                    <Button
                        size="small"
                        className="info-btn"
                        onClick={handleCollSpan}
                        icon={isCollapse ? <PlusOutlined /> : <MinusOutlined />}
                    ></Button>
                    <h2>{name}</h2>
                </Col>
                <Col span={6} className="text-end">
                    <div className="chart-trade-view">
                        <h3
                            className={`${
                                !isCollapse ? 'd-none' : 'd-block'
                            } fw-bold mb0 mt3`}
                        >
                            {close} {`${t('Sr')}`}
                        </h3>
                        <h5
                            className={`${
                                i18n.language === 'en'
                                    ? 'text-end'
                                    : 'text-start'
                            }`}
                        >
                            <a
                                className="fs-bigscreen"
                                href="https://www.tradingview.com/?utm_source=https://bianat.sa&utm_medium=library&utm_campaign=library"
                            >
                                {code} Chart by TradingView
                            </a>
                        </h5>
                        <Button onClick={()=>{handleIsopen(true)}} icon={<InfoCircleOutlined />}></Button>
                    </div>
                </Col>
                <Col
                    span={24}
                    className={` ${
                        isCollapse ? 'isHide' : 'isShow isShow-active'
                    }`}
                >
                    <div className="chart-cards">
                        <Row gutter={0} className="d-flex align-flex-end">
                            <Col span={10}>
                                <p>
                                    <i>
                                        {shortName},{sector}:{industry}
                                    </i>
                                </p>
                                <p>
                                    <i>
                                        <a
                                            href={`https://${webURL}`}
                                            target="_blank"
                                        >
                                            {webURL}
                                        </a>
                                    </i>
                                </p>
                                <p>
                                    <i>{t('Address')}:</i>
                                    <span
                                        className="cut-text"
                                        style={{ fontSize: '11px' }}
                                    >
                                        <Tooltip title={address}>
                                            {address}
                                        </Tooltip>
                                    </span>
                                </p>
                                <p>
                                    <i>{t('Details')}:</i>
                                    <span
                                        className="cut-text"
                                        style={{ fontSize: '11px' }}
                                    >
                                        <Tooltip title={description}>
                                            {description}
                                        </Tooltip>
                                    </span>
                                </p>
                            </Col>
                            <Col span={4}>
                                <p>
                                    <i>{t('dashboard.market_cap')}</i>
                                    <span>
                                        {numFormatter(
                                            sharesOutstanding * close
                                        )}
                                    </span>
                                </p>
                                <p>
                                    <i>{t('dashboard.shares_float')}</i>
                                    <span>{numFormatter(sharesFloat)}</span>
                                </p>
                                <p>
                                    <i>{t('dashboard.shares_outstanding')}</i>
                                    <span>
                                        {numFormatter(sharesOutstanding)}
                                    </span>
                                </p>
                            </Col>
                            <Col span={6}>
                                <div id="avglabel" className="avgLabels">
                                    <p>
                                        <i>{t('50-Day Avg Volume')}</i>
                                        <span className="mx-10 text-start">
                                            <strong
                                                className={`num ${
                                                    data.avgVolume50Days > 0
                                                        ? 'text-success'
                                                        : 'text-dangers'
                                                }`}
                                            >
                                                {numFormatter(
                                                    data?.avgVolume50Days
                                                )}
                                            </strong>
                                        </span>
                                    </p>
                                    <p>
                                        <i>
                                            {t('dashboard.off_52_weeks_high')}
                                        </i>
                                        <span className="mx-10 text-start ">
                                            <strong className={`text-blue`}>
                                                {calculateOff52Week()}%
                                            </strong>
                                        </span>
                                    </p>
                                    <p>
                                        <i>{t('dashboard.52_week_hi_lo')}</i>
                                        <span className="mx-10 text-start">
                                            <strong>
                                                {weekHigh52}-{weekLow52}
                                            </strong>
                                        </span>
                                    </p>
                                </div>
                            </Col>
                            <Col span={4}>
                                <div className="d-flex justify-center align-flex-end">
                                    <div className="mx-10 sr-section text-end">
                                        <h4
                                            className={`${
                                                change_p > 0
                                                    ? 'text-success'
                                                    : 'text-dangers'
                                            }`}
                                        >
                                            {close && close?.toFixed(2)}{' '}
                                            {`${t('Sr')}`}
                                        </h4>
                                        <small className="d-block">
                                            {t('Volume')}
                                            <strong>
                                                {volume &&
                                                    volume
                                                        .toString()
                                                        .replace(
                                                            /\B(?=(\d{3})+(?!\d))/g,
                                                            ','
                                                        )}
                                            </strong>
                                        </small>
                                        <small>
                                            <strong>{lastUpdated}</strong>
                                        </small>
                                    </div>
                                    <div
                                        className={`${
                                            i18n.language === 'en'
                                                ? 'text-end'
                                                : 'text-start'
                                        } last-sec`}
                                    >
                                        <span className="d-block mt-11">
                                            <strong
                                                className={`${
                                                    change > 0
                                                        ? 'text-success'
                                                        : 'text-dangers'
                                                }`}
                                            >
                                                {fixValue(change)}
                                            </strong>
                                        </span>
                                        <span className="d-block">
                                            <strong
                                                className={`${
                                                    change_p > 0
                                                        ? 'text-success'
                                                        : 'text-dangers'
                                                }`}
                                            >
                                                {fixValue(change_p)}%
                                            </strong>
                                        </span>
                                        <span className="d-block">
                                            <strong
                                                className={`${
                                                    dayEndVolume[0]?.volume >
                                                    dayEndVolume[1]?.volume
                                                        ? 'text-success'
                                                        : 'text-dangers'
                                                }`}
                                            >
                                                {dayEndVolume.length == 2
                                                    ? calculateVolumeChange(
                                                          dayEndVolume[0]
                                                              ?.volume,
                                                          dayEndVolume[1]
                                                              ?.volume
                                                      )
                                                    : 0}
                                                %
                                            </strong>
                                        </span>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default ResourceView;
