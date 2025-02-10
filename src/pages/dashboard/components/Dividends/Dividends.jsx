import React, { useEffect, useState } from 'react'
import { Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { numFormatter } from '../../../../utils/ReuseableFunctions'
import { getDividends } from '../../../../services/apis'
import moment from 'moment'

const Dividends = () => {
    const [stockDividends, setStockDividends] = useState(null)
    const { currentStock } = useSelector((state) => state.currentStock)
    const { currentIndustry } = useSelector((state) => state.currentIndustry)
    const { t, i18n } = useTranslation()

    function groupDataByYear(dataArray) {
        const groupedData = {}
        dataArray.forEach((data) => {
            const year = new Date(data['Announcement Date']).getFullYear()
            if (!groupedData[year]) {
                groupedData[year] = []
            }
            groupedData[year].push(data)
        })
           
        return groupedData

        //get keys and sort them


    }

    useEffect(() => {
        const getDividendsData = async () => {
            try {
                setStockDividends(null)
                const data = await getDividends(currentStock)
                const groupData = groupDataByYear(
                    JSON.parse(data[0]?.dividend_data)
                )
                setStockDividends(groupData)
            } catch (err) {
                console.log(err)
            }
        }
        getDividendsData()
    }, [currentStock])

    return (
        <table className="table chart-table mb-1">
            {stockDividends ? (
                <>
                    <thead>
                        <tr className=" font-bold">
                            <th>{t("Dividends")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            <tr className=" font-bold">
                                <td>{t('Eligibility')}</td>
                                {/* <td>{t('Distribution')}</td> */}
                                <td>{t('Amount')}</td>
                            </tr>
                        }
                        {Object.keys(stockDividends)
                            .sort((a, b) => b - a)
                            .map((year, index) => (
                                <>
                                    <tr className=" font-bold">
                                        <td colSpan="3">{year}</td>
                                    </tr>
                                    {stockDividends[year].map(
                                        (dividend, index) => (
                                            <tr>
                                                <td>
                                                    {moment(
                                                        dividend[
                                                            'Eligibility Date'
                                                        ]
                                                    ).format('MMM D')}
                                                </td>
                                                {/* <td
                                                    style={{ fontSize: '10px' }}
                                                >
                                                    {
                                                        dividend[
                                                            'Distribution Method'
                                                        ]
                                                    }
                                                </td> */}
                                                <td>
                                                    {
                                                        dividend[
                                                            'Dividend Amount'
                                                        ]
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </>
                            ))}
                    </tbody>
                </>
            ) : (
                <Spin />
            )}
        </table>
    )
}

export default Dividends
