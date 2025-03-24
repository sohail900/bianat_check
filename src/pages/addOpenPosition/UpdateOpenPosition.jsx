import { Content } from 'antd/lib/layout/layout'
import BianatHeader from '../../components/BianatHeader'
import HighLights from '../home/components/Highlights'

//////////////////////

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore'
import { dbChatBot } from '../../utils/firebase/config'
import { useNavigate, useParams } from 'react-router-dom'
import { message, Button } from 'antd'
import { late } from 'zod'


function calculateProfitLoss({ entryPrice, latestPrice }) {
    return (((latestPrice - entryPrice) / entryPrice) * 100).toFixed(2)
}
function calculateStopLoss({ entryPrice, lowestPrice }) {
    return (((entryPrice - lowestPrice) / entryPrice) * 100).toFixed(2)

}

const UpdateOpenPosition = () => {
    const params = useParams()
    const [isGuideOpen, setIsGuideOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [latestPrice, setLatestPrice] = useState(0)
    const [lowestPrice, setLowestPrice] = useState(0)
    const navigate = useNavigate()
    // DATA
    const [formData, setFormData] = useState({
        name: '',
        symbol: '',
        dateOfPenetration: '',
        pointsOfPenetration: '',
        stopLoss: '',
        stopLossPercent: '',
        profitLossPercent: '',
        typeOfProcess: '',
    })

    useEffect(() => {
        async function fetchCurrentData() {
            const id = params?.id
            if (!id) return

            const docRef = doc(collection(dbChatBot, 'openPositions'), id)
            try {
                const docSnap = await getDoc(docRef) // Awaiting the promise
                if (docSnap.exists()) {
                    const data = docSnap.data()
                    // Set the form data with the fetched data
                    setFormData({
                        name: data.name || '',
                        symbol: data.symbol || '',
                        dateOfPenetration: data.dateOfPenetration || '',
                        pointsOfPenetration: data.pointsOfPenetration || '',
                        stopLoss: data.stopLoss || '',
                        stopLossPercent: data.stopLossPercent || '',
                        profitLossPercent: data.profitLossPercent || '',
                        typeOfProcess: data.typeOfProcess || '',
                    })
                    setLowestPrice(data.lowestPrice)
                    setLatestPrice(data.lastPrice)
                } else {
                    alert('Error finding data!')
                }
            } catch (error) {
                console.log('Error fetching document:', error)
                alert('Error finding data!')
            }
        }

        fetchCurrentData()
    }, [params?.id])

    // ESSENTIALS
    const { t, i18n } = useTranslation()
    const currentTheme = useSelector((state) => state.currentTheme.currentTheme)

    // VALIDATION

    const validate = () => {
        return Object.values(formData).every(value => typeof value === "string" && value.trim() !== "");
    };


    const handleSubmit = async () => {
        const id = params?.id
        if (!id) {
            alert('Invalid ID!')
            return
        }

        if (!validate() || !lowestPrice || !latestPrice) {
            return message.error(t("fill_error"))
        }

        setIsLoading(true)
        try {
            const docRef = doc(collection(dbChatBot, 'openPositions'), id)
            // Update the document in Firestore with the formData
            await updateDoc(docRef, {
                name: formData.name,
                symbol: formData.symbol,
                dateOfPenetration: formData.dateOfPenetration,
                pointsOfPenetration: formData.pointsOfPenetration,
                stopLoss: formData.stopLoss,
                stopLossPercent: formData.stopLossPercent,
                profitLossPercent: formData.profitLossPercent,
                typeOfProcess: formData.typeOfProcess,
                lastPrice: latestPrice,
                lowestPrice
            })
            message.success(t("update_position"))
            navigate('/openPostions')
        } catch (error) {
            console.error('Error updating document: ', error)
            message.error(t("error_update_position"))
        } finally {
            setIsLoading(false)
        }
    }

    const onBlurSymbol = async () => {
        try {

            const now = Math.floor(Date.now() / 1000);
            const from = now - (7 * 86400);
            const response = await fetch(`https://bianat.sa//api/chart/en/history?symbol=${formData.symbol}&resolution=1D&from=${from}&to=${now}&countback=2&currencyCode=SAR`)
            const { c, l } = await response.json()
            if (c.length === 0) {
                return message.error(t("invalid_symbol"))
            }
            setLowestPrice(Math.min(...l))
            setLatestPrice(c[c.length - 1])

        } catch (error) {
            console.log(error)
            message.error(t("enter_symbol_error"))
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }
    const onChangeStopLoss = (e) => {
        const profitLossPercent = calculateProfitLoss({ entryPrice: Number(e.target.value), latestPrice })
        const stopLossPercent = calculateStopLoss({ entryPrice: Number(e.target.value), lowestPrice })
        setFormData((pre) => ({ ...pre, stopLoss: e.target.value, stopLossPercent, profitLossPercent }))
    }
<<<<<<< HEAD
    const typeProcessOnChange = (e) => {
        let { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    };
=======
>>>>>>> 57dda087e00c7cc19029127c14f4bd19ce04a245
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
                        {t('adminUploadData.updateOpenPosition')}
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
                                    className='bg-slate-800 rounded-lg p-3 outline-none w-[250px]'
                                />
                            </div>
                            <input
                                type='text'
                                name='name'
                                value={formData.name}
                                onChange={handleChange}
                                placeholder='Enter Name'
                                className='bg-slate-800 rounded-lg p-3 outline-none w-[250px]'
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
                                className='bg-slate-800 rounded-lg p-2 outline-none w-[250px]'
                            />
                            <input
                                type='text'
                                name='pointsOfPenetration'
                                value={formData.pointsOfPenetration}
                                onChange={handleChange}
                                placeholder='Point of penetration'
                                className='bg-slate-800 rounded-lg p-2 outline-none w-[250px]'
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
                                placeholder='Price'
                                className='bg-slate-800 rounded-lg p-2 outline-none w-[250px]'
                            />
                            <input
                                type='text'
                                name='stopLossPercent'
                                value={formData.stopLossPercent}
                                onChange={handleChange}
                                placeholder='Percentage (%)'
                                className='bg-slate-800 rounded-lg p-2 outline-none w-[250px]'
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
                                value={formData.profitLossPercent}
                                onChange={handleChange}
                                placeholder='Enter Profit Loss %'
                                className='bg-slate-800 rounded-lg p-2 outline-none w-[250px]'
                            />
                        </div>
                        <div className='flex gap-10 items-center'>
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
                            ></textarea>
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
                                {t('adminUploadData.updateOpenPosition')}
                            </Button>
                        </div>
                    </div>
                </div>
            </Content>
        </div>
    )
}

export default UpdateOpenPosition
