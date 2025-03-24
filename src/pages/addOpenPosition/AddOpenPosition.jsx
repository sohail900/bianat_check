import { Content } from 'antd/lib/layout/layout'
import BianatHeader from '../../components/BianatHeader'
import HighLights from '../home/components/Highlights'

function calculateProfitLoss({ entryPrice, latestPrice }) {
    return (((latestPrice - entryPrice) / entryPrice) * 100).toFixed(2)
}
function calculateStopLoss({ entryPrice, lowestPrice }) {
    return (((entryPrice - lowestPrice) / entryPrice) * 100).toFixed(2)

}
//////////////////////

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { addDoc, collection } from 'firebase/firestore'
import { dbChatBot } from '../../utils/firebase/config'
import { Button, message } from 'antd'
const AddOpenPosition = () => {
    const [isGuideOpen, setIsGuideOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [latestPrice, setLatestPrice] = useState(0)
    const [lowestPrice, setLowestPrice] = useState(0)
    // DATA
    const [formData, setFormData] = useState({
        symbol: "",
        name: '',
        dateOfPenetration: '',
        pointsOfPenetration: '',
        stopLoss: '',
        stopLossPercent: '',
        profitLossPercent: '',
        typeOfProcess: '',
    })

    // ESSENTIALS
    const { t, i18n } = useTranslation()
    const currentTheme = useSelector((state) => state.currentTheme.currentTheme)

    // VALIDATION

    const validate = () => {
        return Object.values(formData).every(value => typeof value === "string" && value.trim() !== "");
    };

    // HANDLES
    const handleSubmit = async () => {
        if (validate() || latestPrice || lowestPrice) {
            try {
                setIsLoading(true)
                const docRef = collection(dbChatBot, 'openPositions')
                await addDoc(docRef, { ...formData, lastPrice: latestPrice, lowestPrice })
                message.success(t("success_position"))
                navigate('/openPostions')
            } catch (error) {
                console.log(error)
                message.error(t("error_position"))
            } finally {
                setIsLoading(false)
            }
        } else {
            message.error(t("fill_error"))
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }
    const onBlurSymbol = async () => {
        try {
            setLoading(true)
            const now = Math.floor(Date.now() / 1000);
            const from = now - (7 * 86400);
            const response = await fetch(`https://bianat.sa//api/chart/en/history?symbol=${formData.symbol}&resolution=1D&from=${from}&to=${now}&countback=2&currencyCode=SAR`)
            const { c, l } = await response.json()
            if (c.length === 0) {
                return message.error(t("invalid_symbol"))
            }
            setLowestPrice(Math.min(...l))
            setLatestPrice(c[c.length - 1])
<<<<<<< HEAD
=======

        } catch (error) {
            console.log(error)
            message.error(t("enter_symbol_error"))
        } finally {
            setLoading(false)
        }
    }


    const onChangeStopLoss = (e) => {
        // calculate profit stop loss %..
        const profitLossPercent = calculateProfitLoss({ entryPrice: Number(e.target.value), latestPrice })
        const stopLossPercent = calculateStopLoss({ entryPrice: Number(e.target.value), lowestPrice })
        setFormData((pre) => ({ ...pre, stopLoss: e.target.value, stopLossPercent, profitLossPercent }))
    }
>>>>>>> 57dda087e00c7cc19029127c14f4bd19ce04a245

        } catch (error) {
            console.log(error)
            message.error(t("enter_symbol_error"))
        } finally {
            setLoading(false)
        }
    }


    const onChangeStopLoss = (e) => {
        // calculate profit stop loss %..
        const profitLossPercent = calculateProfitLoss({ entryPrice: Number(e.target.value), latestPrice })
        const stopLossPercent = calculateStopLoss({ entryPrice: Number(e.target.value), lowestPrice })
        setFormData((pre) => ({ ...pre, stopLoss: e.target.value, stopLossPercent, profitLossPercent }))
    }

    const typeProcessOnChange = (e) => {
        let { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    };
    // RETURNING UI
    return (
        <div className='h-full'>
            <BianatHeader
                setIsGuideOpen={setIsGuideOpen}
                followUpPage={'true'}
            />
            <Content
                className={`landing-content min-h-[100vh] ${i18n.language === 'en' ? 'font-loader-en' : 'font-loader'
                    } ${currentTheme === 'Dark' && 'dark-skin'}`}
            >
                <div className='live-update-toolbar'>
                    <HighLights />
                </div>
                <div className='w-[80%] m-auto py-10 flex flex-col gap-8 '>
                    <h1 className='text-[30px]'>
                        {t('adminUploadData.addOpenPosition')}
                    </h1>
                    <div className='flex flex-col gap-10'>
                        <div className='flex gap-10 items-center '>
                            <div className='flex gap-10 items-center '>
                                <label className='w-[150px] font-bold'>
                                    {t('openPosition.symbol')} :{' '}
                                </label>
                                <input
                                    type='text'
                                    name='symbol'
                                    value={formData.symbol}
                                    onBlur={onBlurSymbol}
                                    onChange={handleChange}
                                    placeholder='Enter Symbol'
                                    className='bg-slate-800 rounded-lg p-3 outline-none w-[250px] border border-transparent focus:border-[#004F86]'
                                />
                            </div>
                            <input
                                type='text'
                                name='name'
                                value={formData.name}
                                onChange={handleChange}
                                placeholder='Enter Name'
                                className='bg-slate-800 rounded-lg p-3 outline-none w-[250px] border border-transparent focus:border-[#004F86]'
                            />
                        </div>
                        <div className='flex gap-10 items-center'>
                            <label className='w-[150px] font-bold'>
                                {t('last_price')}
                            </label>
                            <input
                                type='text'
                                name='last_price'
                                readOnly
                                value={latestPrice}
                                placeholder='Last Price'
                                className='bg-slate-800 rounded-lg p-3 outline-none w-[250px] border border-transparent focus:border-[#004F86]'
                            />
                        </div>
                        <div className='flex gap-10 items-center'>
                            <label className='w-[150px] font-bold'>
                                {t('openPosition.date-of-penetration')} :{' '}
                            </label>
                            <input
                                type='date'
                                name='dateOfPenetration'
                                placeholder='Date of penetration'
                                value={formData.dateOfPenetration}
                                onChange={handleChange}
                                className='bg-slate-800 rounded-lg p-3 outline-none w-[250px] border border-transparent focus:border-[#004F86]'
                            />
                            <input
                                type='text'
                                name='pointsOfPenetration'
                                value={formData.pointsOfPenetration}
                                onChange={handleChange}
                                placeholder='Point of penetration'
                                className='bg-slate-800 rounded-lg p-3 outline-none w-[250px] border border-transparent focus:border-[#004F86]'
                            />
                        </div>
                        {/* <div className='flex gap-10 items-center'>
                            <label className='w-[150px] font-bold'>
                                {t('openPosition.BuyPrice')} :{' '}
                            </label>
                            <input
                                type='date'
                                name='buyDate'
                                value={formData.buyDate}
                                onChange={handleChange}
                                className='bg-slate-800 rounded-lg p-2 outline-none w-[250px]'
                            />
                            <input
                                type='text'
                                name='buyPrice'
                                value={formData.buyPrice}
                                onChange={handleChange}
                                placeholder='Enter Price'
                                className='bg-slate-800 rounded-lg p-2 outline-none w-[250px]'
                            />
                        </div> */}
                        <div className='flex gap-10 items-center'>
                            <label className='w-[150px] font-bold'>
                                {t('openPosition.stopLoss')} :{' '}
                            </label>
                            <input
                                type='text'
                                name='stopLoss'
                                value={formData.stopLoss}
                                onChange={onChangeStopLoss}
                                disabled={!latestPrice || !lowestPrice}
                                placeholder='Price'
                                className='bg-slate-800 rounded-lg p-3 outline-none w-[250px] border border-transparent focus:border-[#004F86]'
                            />
                            <input
                                type='text'
                                name='stopLossPercent'
                                readonly
                                value={formData.stopLossPercent}
                                placeholder='Percentage (%)'
                                className='bg-slate-800 rounded-lg p-3 outline-none w-[250px] border border-transparent focus:border-[#004F86]'
                            />
                        </div>

                        {/* <div className='flex gap-10 items-center'>
                            <label className='w-[150px] font-bold'>
                                Avg Vol (K) :{' '}
                            </label>
                            <input
                                type='text'
                                name='avgVol'
                                value={formData.avgVol}
                                onChange={handleChange}
                                placeholder='Enter Average Volume'
                                className='bg-slate-800 rounded-lg p-2 outline-none w-[250px]'
                            />
                        </div>
                        <div className='flex gap-10 items-center'>
                            <label className='w-[150px] font-bold'>
                                Est. ESP Date :{' '}
                            </label>
                            <input
                                type='date'
                                name='ESPDate'
                                value={formData.ESPDate}
                                onChange={handleChange}
                                className='bg-slate-800 rounded-lg p-2 outline-none w-[250px]'
                            />
                        </div>
                        <div className='flex gap-10 items-center'>
                            <label className='w-[150px] font-bold'>
                                {t('openPosition.time')} :{' '}
                            </label>
                            <input
                                type='text'
                                name='time'
                                value={formData.time}
                                onChange={handleChange}
                                placeholder='Enter Time'
                                className='bg-slate-800 rounded-lg p-3 outline-none w-[250px]'
                            />
                        </div> */}
                        <div className='flex gap-10 items-center'>
                            <label className='w-[150px] font-bold'>
                                {t('openPosition.P&L')} (%) :{' '}
                            </label>
                            <input
                                type='text'
                                name='profitLossPercent'
                                readOnly
                                value={formData.profitLossPercent}
                                placeholder='Enter Profit Loss %'
                                className='bg-slate-800 rounded-lg p-3 outline-none w-[250px] border border-transparent focus:border-[#004F86]'
                            />
                        </div>
                        <div className='flex gap-10 '>
                            <label className='w-[150px] font-bold'>
                                {t('openPosition.type-of-process')} :{' '}
                            </label>
                            <textarea
                                rows={4}
                                name='typeOfProcess'
                                value={formData.typeOfProcess}
                                onChange={typeProcessOnChange}
                                placeholder='Type of Process'
                                className='bg-slate-800 rounded-lg p-3 outline-none w-[250px] border border-transparent focus:border-[#004F86]'
<<<<<<< HEAD
                            ></textarea>
=======
                            />
>>>>>>> 57dda087e00c7cc19029127c14f4bd19ce04a245
                        </div>
                        {/* <div className="flex gap-10 items-center">
              <label className="w-[150px] font-bold">
                {t("openPosition.action")} :{" "}
              </label>
              <input
                type="text"
                name="actions"
                value={formData.actions}
                onChange={handleChange}
                placeholder="Enter Action"
                className="bg-slate-800 rounded-lg p-3 outline-none w-[250px]"
              />
            </div> */}
                        <div className='self-end w-fit'>
                            <Button
                                loading={isLoading}
                                disabled={isLoading}
                                className='h-10 bg-[#004f86] rounded-md'
                                onClick={handleSubmit}
                            >
                                {t('adminUploadData.addOpenPosition')}
                            </Button>
                        </div>
                    </div>
                </div>
            </Content>
        </div>
    )
}

export default AddOpenPosition
