import React, { useEffect, useState } from 'react'
import { createChart, CrosshairMode, PriceScaleMode } from 'lightweight-charts'
import { getCandelStickData } from '../../../services/apis'
import { Dropdown, Button, Menu } from 'antd'
import { LineChartOutlined } from '@ant-design/icons'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from '../../../components/ErrorBoundary'

import { useSelector } from 'react-redux'
const ChartCandle = () => {
    let series
    let volumeSeries
    let data = []
    let volumeData = []
    const [candelStickData, setCandelStickData] = useState([])
    const [chartType, setChartType] = useState('bar')
    const { currentTheme } = useSelector((state) => state.currentTheme)

    const layout = {
        layout: {
            backgroundColor: currentTheme === 'Dark' ? '#000000' : '#ffffff',
            textColor: currentTheme === 'Dark' ? '#ffffff' : '#000000',
        },
    }

    const lineChartConfig = {
        height: 260,
        ...layout,
        rightPriceScale: {
            mode: PriceScaleMode.Logarithmic,
            borderVisible: false,
            scaleMargins: {
                top: 0.1,
                bottom: 0.1,
            },
        },
        grid: {
            horzLines: {
                visible: false,
            },
            vertLines: {
                visible: false,
            },
        },
        priceScale: {
            borderVisible: false,
            autoScale: true,
            scaleMargins: {
                top: 0.1,
                bottom: 0.1,
            },
        },
        timeScale: {
            borderVisible: false,
            visible: true,
            timeVisible: true,
            fixLeftEdge: true,
            lockScale: false,
            minBarSpacing: 8,
            rightOffset: 8,
        },
    }

    const candleChartConfig = {
        height: 260,
        ...layout,
        grid: {
            horzLines: {
                visible: false,
            },
            vertLines: {
                visible: false,
            },
        },
        priceScale: {
            borderVisible: false,
        },
        timeScale: {
            borderVisible: false,
            visible: true,
            timeVisible: true,
            fixLeftEdge: true,
            lockScale: false,
            minBarSpacing: 8,
            rightOffset: 8,
        },
    }

    useEffect(() => {
        const candleData = async () => {
            try {
                const result = await getCandelStickData('NOMU')
                setCandelStickData(result)
            } catch (err) {
                console.log(err)
            }
        }
        candleData()
    }, [])

    const changeDataFormat = () => {
        candelStickData.forEach((item) => {
            data.push({ time: item.time, value: item.close })
        })
    }

    if (candelStickData.length > 0) {
        document.getElementById('tv_chart_1').innerHTML = ''
        const chart = createChart(
            document.getElementById('tv_chart_1'),
            chartType === 'bar' ? candleChartConfig : lineChartConfig
        )
        chart.timeScale().fitContent()
        if (chartType === 'candle') {
            series = chart.addCandlestickSeries({
                wickVisible: true,
            })
        } else if (chartType === 'line') {
            changeDataFormat()
            series = chart.addLineSeries({
                color: '#26de81',
                lineWidth: 3,
            })
        } else if (chartType === 'bar') {
            series = chart.addBarSeries({
                thinBars: false,
            })
        } else if (chartType === 'volume') {
            changeDataFormat()
            candelStickData.forEach((item) => {
                volumeData.push({
                    time: item.time,
                    value: item.close,
                    color: 'rgba(38, 222, 129, 0.50)',
                })
            })
            series = chart.addAreaSeries({
                topColor: 'rgba(38,222,129, 0.56)',
                bottomColor: 'rgba(38,222,129, 0.04)',
                lineColor: 'rgba(38,222,129, 1)',
                lineWidth: 2,
            })
            volumeSeries = chart.addHistogramSeries({
                color: '#26a69a',
                priceFormat: {
                    type: 'volume',
                },
                priceScaleId: '',
                scaleMargins: {
                    top: 0.8,
                    bottom: 0,
                },
            })
            volumeSeries.setData(volumeData)
        }

        series.setData(data.length > 0 ? data : candelStickData)
    }
    const menu = (
        <Menu
            onClick={(e) => {
                setChartType(e.key)
            }}
        >
            <Menu.Item key='candle'>
                <span>Candle Stick</span>
            </Menu.Item>
            <Menu.Item key='line'>
                <span>Line Chart</span>
            </Menu.Item>
            <Menu.Item key='bar'>
                <span>Bar Chart</span>
            </Menu.Item>
            <Menu.Item key='volume'>
                <span>Volume Chart</span>
            </Menu.Item>
        </Menu>
    )

    return (
        <>
            <Dropdown overlay={menu}>
                <Button
                    className='position-change'
                    icon={<LineChartOutlined />}
                ></Button>
            </Dropdown>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <div id='tv_chart_1' className='charts chart-min'></div>
            </ErrorBoundary>
        </>
    )
}

export default ChartCandle
