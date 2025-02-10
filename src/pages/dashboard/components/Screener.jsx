import React, { useState, useEffect, useContext, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Excel } from 'antd-table-saveas-excel'
import { CSVLink } from 'react-csv'
import { useTranslation } from 'react-i18next'
import esb from 'elastic-builder'
import { KuzzleContext } from '../../../App'
import { numFormatter } from '../../../utils/ReuseableFunctions'
import { updateStock } from '../../../features/Stock/stockSlice'
import BottomPanelTable from '../../../components/BottomPanelTable'
import { createQuery } from '../../../utils/createQuery'
import StockRankInIndustry from './IndustryAndSector/StockRankInIndustry'
import { updateRankIndustryStock } from '../../../features/RankIndustryStock/rankIndustryStockSlice'

/**
 * @name Screener
 * @description Screener page
 * @purpose To display the Screener page
 * @param {state} play
 * @param {state} duration
 * @param {object} selectedFilter
 * @param {object} dynamicColumn
 * @param {function} setStocksInScreen
 * @returns {JSX} JSX element containing the Screener page
 */

const Screener = ({
    setChoice,
    play,
    duration,
    selectedFilter,
    dynamicColumn,
    setStocksInScreen,
    exportData,
    setDynamicColumn,
    setKuzzleData,
    kuzzleData,
    currentAction,
}) => {
    const { kuzzleHttp: kuzzle } = useContext(KuzzleContext)
    const [currentStock, setCurrentStock] = useState()
    const [currentSelectedIndex, setCurrentSelectedIndex] = useState(0)
    const [currentIndex, setCurrentIndex] = useState(-1)
    const [currentInterval, setCurrentInterval] = useState(null)
    const [columnSelector, setColumnSelector] = useState(null)
    const rankIndustryStock = useSelector(
        (state) => state.rankIndustryStock.RankIndustryStock
    )
    const ind = useSelector((state) => state.rankIndustryStock)

    const { currentIndustry, bianatGroupSymbol } = useSelector(
        (state) => state.currentIndustry
    )

    const dispatch = useDispatch()
    const { t, i18n } = useTranslation()
    const ref = useRef()
    const csvLink = useRef()
    const getData = async (filterArray) => {
        try {
            const filter = { ...filterArray }
            if (filter.key) {
                delete filter.key
            }
            const query = createQuery(filter)
            const data = await kuzzle.document.search(
                'bianat',
                'indicators',
                query,
                {
                    size: 1000,
                }
            )
            let dataArray = data.hits.map((item) => item._source)
            dataArray = dataArray.filter((item) => item?.code !== undefined)
            if (rankIndustryStock) {
                setStocksInScreen(
                    dataArray.filter(
                        (item) => item?.bianatGroupSymbol === bianatGroupSymbol
                    )
                )
                setKuzzleData(
                    dataArray.filter(
                        (item) => item?.bianatGroupSymbol === bianatGroupSymbol
                    )
                )
            } else if (Object.keys(filterArray).length > 0) {
                setStocksInScreen(dataArray)
                setKuzzleData(dataArray)
            }
        } catch (err) {
            console.log('err', err)
        }
    }
    useEffect(() => {
        // const abortController = new AbortController();

        if (!selectedFilter.hasOwnProperty('folderName')) {
            getData(selectedFilter)
        }

        // return () => {
        //   abortController.abort();
        // };
    }, [selectedFilter, currentAction])

    useEffect(() => {
        if (rankIndustryStock) {
            getData({})
            dispatch(updateRankIndustryStock(false))
        }
    }, [rankIndustryStock])

    const findSelectedIndex = () => {
        kuzzleData.forEach((item, index) => {
            if (item.code === currentStock) {
                setCurrentSelectedIndex(index)
            }
        })
    }

    useEffect(() => {
        const timer = async () => {
            return setTimeout(() => {
                if (
                    currentIndex < kuzzleData.length - 1 &&
                    kuzzleData.length > 0
                ) {
                    setCurrentIndex((state) => state + 1)
                } else {
                    setCurrentIndex(0)
                }
            }, duration)
        }

        if (play && kuzzleData) {
            timer().then((interval) => {
                setCurrentInterval(interval)
            })
        }
    }, [play, currentIndex, kuzzleData, duration])

    useEffect(() => {
        if (kuzzleData.length > 0 && currentIndex >= 0) {
            setCurrentStock(kuzzleData[currentIndex]?.code)
            dispatch(updateStock(kuzzleData[currentIndex]?.code))
        }
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'auto', block: 'start' })
        }
    }, [currentIndex])

    useEffect(() => {
        if (!play && currentInterval) {
            clearTimeout(currentInterval)
            setCurrentInterval(null)
        }

        return () => {
            if (currentInterval) {
                clearTimeout(currentInterval)
            }
        }
    }, [currentInterval, play])

    window.onkeydown = (e) => {
        if (e.keyCode === 32) {
            e.preventDefault()
        }
    }

    window.onkeyup = (e) => {
        if (e.keyCode === 32) {
            e.preventDefault()
            if (!play) {
                setCurrentSelectedIndex(() => currentSelectedIndex + 1)
                setCurrentStock(kuzzleData[currentSelectedIndex].code)
                dispatch(updateStock(kuzzleData[currentSelectedIndex].code))
            }
        }
    }

    if (dynamicColumn != undefined && dynamicColumn.length > 0) {
        dynamicColumn.forEach((item) => {
            if (item.key === 'code') {
                item.render = (text) => (
                    <strong ref={currentStock === text ? ref : null}>
                        <a
                            onClick={() => {
                                dispatch(updateStock(text))
                                setCurrentStock(text)
                                findSelectedIndex()
                            }}
                        >
                            {text}
                        </a>
                    </strong>
                )
            } else {
                item.render = (text) => <strong>{text}</strong>
            }
        }, [])
    }
    useEffect(() => {
        const getColumnSelection = async () => {
            try {
                const response = await kuzzle.document.search(
                    'bianat',
                    'column-selector',
                    esb
                        .requestBodySearch()
                        .query(
                            esb
                                .boolQuery()
                                .should([esb.termQuery('name', columnSelector)])
                        )
                )

                setDynamicColumn(response?.hits[0]?._source.items)
            } catch (error) {
                console.log(error)
            }
        }
        if (columnSelector !== null) {
            getColumnSelection()
        }
    }, [columnSelector])

    const columns = [
        {
            title: t('screener.Symbol'),
            dataIndex: 'code',
            label: 'code',
            key: 'code',
            sorter: (a, b) => a.code.localeCompare(b.code),
            render: (text) => (
                <strong ref={currentStock === text ? ref : null}>
                    <a
                        onClick={() => {
                            dispatch(updateStock(text))
                            setCurrentStock(text)
                            findSelectedIndex()
                        }}
                    >
                        {text}
                    </a>
                </strong>
            ),
        },
        {
            title: t('screener.Name'),
            label: t('screener.Name'),
            dataIndex: `shortName${i18n.language === 'en' ? 'En' : 'Ar'}`,
            sorter: (a, b) => a.name.localeCompare(b.name),
            key: `shortName${i18n.language === 'en' ? 'En' : 'Ar'}`,
            render: (text) => <strong>{t(text)}</strong>,
        },
        {
            title: t('screener.Current'),
            lable: t('screener.Current'),
            dataIndex: 'close',
            key: 'close',
            sorter: (a, b) => a.close - b.close,
            render: (text) => <strong>{numFormatter(parseFloat(text))}</strong>,
        },
        {
            title: t('screener.change'),
            label: t('screener.change'),
            dataIndex: 'change',
            key: 'change',
            sorter: (a, b) => a.change - b.change,
            render: (text) => <strong>{numFormatter(parseFloat(text))}</strong>,
        },
        {
            title: t('screener.Price_%_chg'),
            label: t('screener.Price_%_chg'),
            dataIndex: 'change_p',
            key: 'change_p',
            sorter: (a, b) => a.change_p - b.change_p,
            render: (text) => (
                <strong
                    className={`${
                        parseFloat(text) > 0 ? 'text-success' : 'text-dangers '
                    }`}
                >
                    {numFormatter(parseFloat(text))}
                </strong>
            ),
        },
        {
            title: t('screener.Vol_%_Chg_vs_50-Day'),
            label: t('screener.Vol_%_Chg_vs_50-Day'),
            dataIndex: 'volume_minus_per_change_vs_50_day_average',
            key: 'volume_minus_per_change_vs_50_day_average',
            sorter: (a, b) =>
                a.volume_minus_per_change_vs_50_day_average -
                b.volume_minus_per_change_vs_50_day_average,
            render: (text) => (
                <strong
                    className={`${
                        parseFloat(text) > 0 ? 'text-success' : 'text-dangers'
                    }`}
                >
                    {numFormatter(parseFloat(text))}
                </strong>
            ),
        },
        {
            title: t('screener.EPS_Rating'),
            label: t('screener.EPS_Rating'),
            dataIndex: 'epsRating',
            key: 'epsRating',
            sorter: (a, b) => a.epsRating - b.epsRating,
            render: (text) => <strong>{Math.ceil(text)}</strong>,
        },
        {
            title: t('screener.RS_Rating'),
            label: t('screener.RS_Rating'),
            key: 'rsRating',
            sorter: (a, b) =>
                a.relativeStrength?.current - b.relativeStrength?.current,
            render: (text) => (
                <strong>{parseInt(text?.relativeStrength?.current)}</strong>
            ),
        },
        {
            title: t('screener.Sales_Rank'),
            label: t('screener.Sales_Rank'),
            dataIndex: 'salesRating',
            key: 'salesRating',
            sorter: (a, b) => a.salesRating - b.salesRating,
            render: (text) => <strong>{Math.ceil(text)}</strong>,
        },
        {
            title: t('screener.Composite_Rating'),
            label: t('screener.Composite_Rating'),
            dataIndex: 'compRating',
            sorter: (a, b) => a.compRating - b.compRating,
            key: 'compRating',
            render: (text) => <strong>{parseInt(text)}</strong>,
        },
    ]

    let screenerColumn =
        dynamicColumn != undefined && dynamicColumn.length > 0
            ? dynamicColumn
            : columns

    useEffect(() => {
        if (exportData && exportData === 'CSV') {
            if (csvLink && csvLink.current) {
                csvLink.current.link.click()
                setChoice(null)
            }
        } else {
            setColumnSelector(exportData)
            // setChoice(null);
        }
    }, [exportData])

    return (
        <div className='panel-bottom-tbl-height'>
            <CSVLink
                data={kuzzleData}
                headers={columns}
                filename='stocks.csv'
                ref={csvLink}
            />

            <BottomPanelTable
                currentIndex={currentIndex}
                data={kuzzleData}
                columns={screenerColumn}
                code={currentStock}
            />
        </div>
    )
}

export default Screener
