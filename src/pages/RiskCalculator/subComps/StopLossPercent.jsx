import React, { useState, useEffect } from 'react'
import { GoPlus } from 'react-icons/go'
import { FiMinus } from 'react-icons/fi'

const StopLossPercent = () => {
    // States for inputs
    const [entryPrice, setEntryPrice] = useState('')
    const [stopLossPercent, setStopLossPercent] = useState('')
    const [positionSizePercent, setPositionSizePercent] = useState('')
    const [portfolioSize, setPortfolioSize] = useState('')

    // States for computed results
    const [stopLossValue, setStopLossValue] = useState(null)
    const [numberOfShares2, setNumberOfShares2] = useState(null)

    // useEffect to calculate values when any input changes
    useEffect(() => {
        if (entryPrice && stopLossPercent) {
            const entryPriceValue = parseFloat(entryPrice) || 0
            const stopLossPercentValue = parseFloat(stopLossPercent) || 0

            // Calculate Stop Loss Value
            const stopLossValueCalculated =
                entryPriceValue - entryPriceValue * (stopLossPercentValue / 100)

            setStopLossValue(stopLossValueCalculated.toFixed(2))
        } else {
            setStopLossValue(null)
        }

        if (entryPrice && positionSizePercent && portfolioSize) {
            const entryPriceValue = parseFloat(entryPrice) || 0
            const positionSizePercentValue =
                parseFloat(positionSizePercent) || 0
            const portfolioSizeValue = parseFloat(portfolioSize) || 0

            // Calculate Number of Shares
            const ns = Math.floor(
                ((positionSizePercentValue / 100) * portfolioSizeValue) /
                    entryPriceValue
            )

            setNumberOfShares2(ns)
        } else {
            setNumberOfShares2(null)
        }
    }, [entryPrice, stopLossPercent, positionSizePercent, portfolioSize])

    // Handle increment and decrement of input values
    const handleIncrease = (setter, value) => {
        setter((prevValue) => (parseFloat(prevValue) + 0.1).toFixed(1))
    }

    const handleDecrease = (setter, value) => {
        setter((prevValue) => (parseFloat(prevValue) - 0.1).toFixed(1))
    }

    return (
        <>
            <div className='mb-1'>
                <p className='text-sm font-medium text-white mb-1'>
                    Entry Price
                </p>
                <div className='flex '>
                    <button
                        onClick={() =>
                            handleDecrease(setEntryPrice, entryPrice)
                        }
                        className='text-base  px-2 bg-[#171d33] text-white rounded-l-md'
                    >
                        <FiMinus />
                    </button>
                    <input
                        type='number'
                        value={entryPrice}
                        onChange={(e) => setEntryPrice(e.target.value)}
                        className='w-full py-3 px-3 pr-2 bg-[#171d33] text-white  focus:outline-none'
                    />
                    <button
                        onClick={() =>
                            handleIncrease(setEntryPrice, entryPrice)
                        }
                        className='text-base  px-2 bg-[#171d33] text-white rounded-r-md'
                    >
                        <GoPlus />
                    </button>
                </div>
            </div>

            <div className='mb-1'>
                <p className='text-sm font-medium text-white mb-1'>
                    Stop Loss Percent
                </p>
                <div className='flex '>
                    <button
                        onClick={() =>
                            handleDecrease(setStopLossPercent, stopLossPercent)
                        }
                        className='text-base  px-2 bg-[#171d33] text-white rounded-l-md'
                    >
                        <FiMinus />
                    </button>
                    <input
                        type='number'
                        value={stopLossPercent}
                        onChange={(e) => setStopLossPercent(e.target.value)}
                        className='w-full py-3 px-3 pr-2 bg-[#171d33] text-white  focus:outline-none'
                    />
                    <button
                        onClick={() =>
                            handleIncrease(setStopLossPercent, stopLossPercent)
                        }
                        className='text-base  px-2 bg-[#171d33] text-white rounded-r-md'
                    >
                        <GoPlus />
                    </button>
                </div>
            </div>

            <div className='mb-1'>
                <p className='text-sm font-medium text-white mb-1'>
                    Position Size Percent
                </p>
                <div className='flex'>
                    <button
                        onClick={() =>
                            handleDecrease(
                                setPositionSizePercent,
                                positionSizePercent
                            )
                        }
                        className='text-base  px-2 bg-[#171d33] text-white rounded-l-md'
                    >
                        <FiMinus />
                    </button>
                    <input
                        type='number'
                        value={positionSizePercent}
                        onChange={(e) => setPositionSizePercent(e.target.value)}
                        className='w-full py-3 px-3 pr-2 bg-[#171d33] text-white  focus:outline-none'
                    />
                    <button
                        onClick={() =>
                            handleIncrease(
                                setPositionSizePercent,
                                positionSizePercent
                            )
                        }
                        className='text-base  px-2 bg-[#171d33] text-white rounded-r-md'
                    >
                        <GoPlus />
                    </button>
                </div>
            </div>

            <div className='mb-1'>
                <p className='text-sm font-medium text-white mb-1'>
                    Portfolio Size
                </p>
                <div className='flex'>
                    <button
                        onClick={() =>
                            handleDecrease(setPortfolioSize, portfolioSize)
                        }
                        className='text-base  px-2 bg-[#171d33] text-white rounded-l-md'
                    >
                        <FiMinus />
                    </button>
                    <input
                        type='number'
                        value={portfolioSize}
                        onChange={(e) => setPortfolioSize(e.target.value)}
                        className='w-full py-3 px-3 pr-2 bg-[#171d33] text-white  focus:outline-none'
                    />
                    <button
                        onClick={() =>
                            handleIncrease(setPortfolioSize, portfolioSize)
                        }
                        className='text-base  px-2 bg-[#171d33] text-white rounded-r-md'
                    >
                        <GoPlus />
                    </button>
                </div>
            </div>

            {/* Results */}
            <div className='mt-4'>
                <h2 className='text-[1.2rem] font-medium text-white mb-1'>
                    Results
                </h2>
                <p className='text-sm text-white mb-1'>
                    Stop Loss Value:{' '}
                    {stopLossValue ? `$${stopLossValue}` : 'N/A'}
                </p>
                <p className='text-sm text-white mb-4'>
                    Number of Shares:{' '}
                    {numberOfShares2 !== null ? numberOfShares2 : 'N/A'}
                </p>
            </div>
        </>
    )
}

export default StopLossPercent
