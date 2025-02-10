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
const UpdateOpenPosition = () => {
    const params = useParams()
    const [isGuideOpen, setIsGuideOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
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
                    console.log('Document data:', data)
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
        for (const key in formData) {
            if (formData[key].trim() === '') {
                return false
            }
        }
        return true
    }

    const handleSubmit = async () => {
        const id = params?.id
        if (!id) {
            alert('Invalid ID!')
            return
        }

        if (!validate()) {
            return
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
            })
            message.success('Document successfully updated!')
            navigate('/openPostions')
        } catch (error) {
            console.error('Error updating document: ', error)
            message.error('Error updating document!')
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    // RETURNING UI
    return (
        <div className='h-full'>
            <BianatHeader
                setIsGuideOpen={setIsGuideOpen}
                followUpPage={'true'}
            />
            <Content
                className={`landing-content min-h-[100vh] ${
                    i18n.language === 'en' ? 'font-loader-en' : 'font-loader'
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
                                onChange={handleChange}
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
                            <input
                                type='text'
                                name='typeOfProcess'
                                value={formData.typeOfProcess}
                                onChange={handleChange}
                                placeholder='Type of Process'
                                className='bg-slate-800 rounded-lg p-3 outline-none w-[250px]'
                            />
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
