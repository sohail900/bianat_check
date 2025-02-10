import React, { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import moment from "moment-timezone";
import { KuzzleContext } from "../../../App";
import { updateIndustry,updateBianatGroupSymbol } from "../../../features/Industry/industrySlice";
import { updateRealTime } from "../../../features/RealTime/realTime";
import getCurrentLanguage from "../../../utils/CurrentLanguage";
import ResourceView from "./BianatResources/ResourceView";
import authApi from "../../../services/authApi";
import esb from "elastic-builder";

/**
 * @name BianatResources
 * @description BianatResources component for dashboard
 * @purpose To display bianat resources data
 * @param {code} code - code of the stock
 * @returns {JSX} JSX element
 */

const BianatResources = ({ code, resolution, handleIsopen }) => {
    const { kuzzleSocket: kuzzle } = useContext(KuzzleContext)

    const currentStock = useSelector((state) => state.currentStock.currentStock)
    const [currentLang, setCurrentLang] = useState(getCurrentLanguage().code)
    const [dayEndVolume, setDayEndVolume] = useState([])
    const [close, setClose] = useState(0)
    const [change, setChange] = useState(0)
    const [change_p, setChange_p] = useState(0)
    const [timeStamp, setTimeStamp] = useState(0)
    const [data, setData] = useState()
    const { t, i18n } = useTranslation()
    const dispatch = useDispatch()
    useEffect(() => {
        setCurrentLang(() => getCurrentLanguage().code)
    }, [i18n.language])

    const getDayEndVolumes = async () => {
        try {
            const response = await authApi.get(
                `/fundamentals/day-end-volume/${currentStock}`
            )

            setDayEndVolume(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    const getDataFromKuzzle = async () => {
        try {
            const result = await kuzzle.document.get(
                'bianat',
                'indicators',
                `${currentStock}`
            )

            setTimeStamp(
                moment(result?._source?.timestamp * 1000)
                    .tz('Asia/Riyadh')
                    .format('DD-MM-YYYY, hh:mm:ss')
            )
        } catch (err) {
            console.log(err)
        }
    }
    const getData = async () => {
        try {
            let id = await kuzzle.realtime.subscribe(
                'bianat',
                'indicators',
                {
                    equals: {
                        code: `${currentStock}`,
                    },
                },
                (notification) => {
                    if (notification.type !== 'document') return
                    if (notification.action !== 'update') return
                    let tempData = JSON.parse(
                        JSON.stringify(notification.result)
                    )

                    dispatch(updateRealTime(tempData))
                    setClose(tempData._source.close)
                    setChange(tempData._source.change)
                    setChange_p(tempData._source.change_p)
                    setTimeStamp(
                        moment(tempData._source.timestamp * 1000)
                            .tz('Asia/Riyadh')
                            .format('DD-MM-YYYY, HH:mm:ss')
                    )
                }
            )
        } catch (err) {
            console.log(err)
        }
    }
    const unsubscribe = async () => {
        try {
            if (kuzzle.connected) {
                await kuzzle.realtime.unsubscribe(e.roomId)
            }
        } catch (e) {
            console.log('Error in unsubscribing', e)
        }
    }

    const getStockFundamentalData = async () => {
        try {
            const fundamentalData = await authApi.get(
                `/fundamentals/dashboard/${currentLang}/${currentStock}/${resolution}`
            )
            setData(fundamentalData.data)
            setClose(fundamentalData.data.close)
            setChange(fundamentalData.data.change)
            setChange_p(fundamentalData.data.change_p)
            dispatch(updateIndustry(fundamentalData?.data?.industryEn))
            dispatch(
                updateBianatGroupSymbol(
                    fundamentalData?.data?.bianatGroupSymbol
                )
            )
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getDayEndVolumes()
    }, [currentStock])

    useEffect(() => {
        getData()
    }, [data])

    useEffect(() => {
        getStockFundamentalData()
        getDataFromKuzzle()
    }, [currentStock, resolution, currentLang])

    return (
        <div
            className={`chart-stats ${
                i18n.language === 'en' ? 'font-loader-en' : 'font-loader'
            }`}
        >
            {data && (
                <ResourceView
                    dayEndVolume={dayEndVolume}
                    data={data}
                    change={change}
                    close={close}
                    lastUpdated={timeStamp}
                    change_p={change_p}
                    handleIsopen={handleIsopen}
                />
            )}
        </div>
    )
}

export default BianatResources;
