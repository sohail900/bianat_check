import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Content } from 'antd/lib/layout/layout'
import BianatHeader from '../../components/BianatHeader'
import HighLights from '../home/components/Highlights'
import { useNavigate } from 'react-router-dom'
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
} from 'firebase/firestore'
import { dbChatBot } from '../../utils/firebase/config'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

const OpenPostions = () => {
    const navigate = useNavigate()
    const auth = useSelector((state) => state.auth)
    const isAdmin = auth?.user?.roles?.includes('admin')

    // Essentials
    const [isGuideOpen, setIsGuideOpen] = useState(false)
    const { t, i18n } = useTranslation()
    const currentTheme = useSelector((state) => state.currentTheme.currentTheme)
    const [tableData, setTableData] = useState(null)

    const fetchData = async () => {
        try {
            const q = query(collection(dbChatBot, 'openPositions'))
            const response = await getDocs(q)
            const data = response.docs.map((doc) => ({
                ...doc.data(),
                uid: doc.id,
            }))
            console.log(data)
            setTableData(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleDeleteDoc = async (docId) => {
        if (!docId) {
            console.error('Invalid document ID')
            return
        }

        try {
            const docRef = doc(dbChatBot, 'openPositions', docId) // Reference to the document
            await deleteDoc(docRef) // Delete the document
            console.log(`Document with ID ${docId} successfully deleted!`)
            alert('Document successfully deleted!')
            fetchData()
        } catch (error) {
            console.error('Error deleting document: ', error)
            alert('Error deleting document!')
        }
    }

    // STYLES
    const thStyles = 'border-r border-gray-600'

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
                <div className='px-8 py-8 flex flex-col gap-8'>
                    <h1 className='text-[30px]'>{t('openPosition.heading')}</h1>
                    <h1 className='text-[20px]'>
                        {t('openPosition.subheading')}
                    </h1>
                    <div className='border-1 border-white pb-20 max-md:overflow-y-scroll'>
                        <table className='min-w-full divide-y divide-gray-600 border-[1px] border-[#222]'>
                            <thead
                                className=''
                                style={{
                                    border:
                                        currentTheme === 'Dark'
                                            ? '1px solid white'
                                            : '#222',
                                }}
                            >
                                <tr
                                    style={{
                                        backgroundColor:
                                            currentTheme === 'Dark'
                                                ? '#283142'
                                                : '#f0f4fc',
                                    }}
                                >
                                    <th
                                        className={thStyles}
                                        style={{ padding: '10px' }}
                                    >
                                        {t('openPosition.name')}
                                    </th>
                                    <th
                                        className={thStyles}
                                        style={{ padding: '10px' }}
                                    >
                                        {t('openPosition.symbol')}
                                    </th>
                                    <th
                                        className={thStyles}
                                        style={{ padding: '10px' }}
                                    >
                                        {t('openPosition.date-of-penetration')}
                                    </th>
                                    <th
                                        className={thStyles}
                                        style={{ padding: '10px' }}
                                    >
                                        {t('openPosition.point-of-penetration')}
                                    </th>
                                    <th
                                        className={thStyles}
                                        style={{ padding: '10px' }}
                                    >
                                        {t('openPosition.stopLoss')}
                                    </th>
                                    <th
                                        className={thStyles}
                                        style={{ padding: '10px' }}
                                    >
                                        {t('openPosition.stopLoss')}(%)
                                    </th>

                                    <th
                                        className={thStyles}
                                        style={{ padding: '10px' }}
                                    >
                                        {t('openPosition.P&L')}(%)
                                    </th>
                                    <th
                                        className={thStyles}
                                        style={{ padding: '10px' }}
                                    >
                                        {t('openPosition.type-of-process')}
                                    </th>
                                    {/* <th
                                        className={thStyles}
                                        style={{ padding: '10px' }}
                                    >
                                        {t('openPosition.time')}
                                    </th>
                                    <th
                                        className={thStyles}
                                        style={{ padding: '10px' }}
                                    >
                                        Est. EPS Date
                                    </th>
                                    <th
                                        className={thStyles}
                                        style={{ padding: '10px' }}
                                    >
                                        Avg. Vol(k)
                                    </th>
                                    <th
                                        className={thStyles}
                                        style={{ padding: '10px' }}
                                    >
                                        {t('openPosition.BuyPrice')}
                                    </th>
                                    <th
                                        className={thStyles}
                                        style={{ padding: '10px' }}
                                    >
                                        {t('openPosition.BuyDate')}
                                    </th> */}

                                    {isAdmin && (
                                        <th
                                            className={thStyles}
                                            style={{ padding: '10px' }}
                                        >
                                            {t('openPosition.buttons')}
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className=' divide-y divide-gray-600'>
                                {tableData &&
                                    tableData.map((row, index) => (
                                        <tr
                                            key={index}
                                            style={{
                                                backgroundColor:
                                                    currentTheme === 'Dark'
                                                        ? index % 2 === 0
                                                            ? '#20242c'
                                                            : '#283142'
                                                        : '#fff',
                                            }}
                                        >
                                            <td
                                                className={thStyles}
                                                style={{ padding: '20px 10px' }}
                                            >
                                                {row.name}
                                            </td>
                                            <td
                                                className={thStyles}
                                                style={{ padding: '20px 10px' }}
                                            >
                                                {row.symbol}
                                            </td>
                                            <td
                                                className={thStyles}
                                                style={{ padding: '20px 10px' }}
                                            >
                                                {row.dateOfPenetration}
                                            </td>
                                            <td
                                                className={thStyles}
                                                style={{ padding: '20px 10px' }}
                                            >
                                                {row.pointsOfPenetration}
                                            </td>
                                            <td
                                                className={thStyles}
                                                style={{ padding: '20px 10px' }}
                                            >
                                                {row.stopLoss}
                                            </td>
                                            <td
                                                className={thStyles}
                                                style={{ padding: '20px 10px' }}
                                            >
                                                {row.stopLossPercent}
                                            </td>
                                            <td
                                                className={thStyles}
                                                style={{ padding: '20px 10px' }}
                                            >
                                                {row.profitLossPercent}
                                            </td>
                                            <td
                                                className={thStyles}
                                                style={{ padding: '20px 10px' }}
                                            >
                                                {row.typeOfProcess}
                                            </td>
                                            {/* <td
                                                className={thStyles}
                                                style={{ padding: '20px 10px' }}
                                            >
                                                {row.buyDate}
                                            </td>{' '} */}
                                            {isAdmin && (
                                                <td
                                                    className={`${thStyles} flex gap-1`}
                                                    style={{
                                                        padding: '20px 10px',
                                                    }}
                                                >
                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/update-open-position/${row.uid}`
                                                            )
                                                        }
                                                        className='px-2 bg-blue-800 cursor-pointer'
                                                    >
                                                        <EditOutlined />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteDoc(
                                                                row.uid
                                                            )
                                                        }
                                                        className='px-2 bg-red-800 cursor-pointer'
                                                    >
                                                        <DeleteOutlined />
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Content>
        </div>
    )
}

export default OpenPostions
