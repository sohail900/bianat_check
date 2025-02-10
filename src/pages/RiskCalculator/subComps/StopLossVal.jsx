import React, { useState, useEffect } from 'react'
import { GoPlus } from 'react-icons/go'
import { FiMinus } from 'react-icons/fi'

const StopLossVal = () => {
    const [entryPrice, setEntryPrice] = useState('')
    const [stopPrice, setStopPrice] = useState('')
    const [riskPrice, setRiskPrice] = useState('')
    const [stopLossPercent, setStopLossPercent] = useState(null)
    const [positionSize, setPositionSize] = useState(null)
    const [numOfShares, setNumOfShares] = useState(null)

    // useEffect to calculate values when any input changes
    useEffect(() => {
        if (entryPrice && stopPrice && riskPrice) {
            const entry = parseFloat(entryPrice)
            const stop = parseFloat(stopPrice)
            const risk = parseFloat(riskPrice)

            // Calculate Stop Loss Percentage
            const stopLoss = ((stop - entry) / entry) * 100
            const stopLossPercentage = parseFloat(stopLoss.toFixed(2))

            // Calculate Position Size for Trade
            const stopLossValue = stopLossPercentage / 100
            const v = Math.abs(risk / stopLossValue)
            // 111 is a placeholder, replace it with the actual value
            const ps = v - v * 111

            // Calculate Number of Shares
            const ns = Math.abs(ps / entry)
            const numShares = Math.floor(ns)

            // Update state in one go
            setStopLossPercent(stopLossPercentage)
            setPositionSize(ps)
            setNumOfShares(numShares)
        } else {
            // Reset results when any input is empty
            setStopLossPercent(null)
            setPositionSize(null)
            setNumOfShares(null)
        }
    }, [entryPrice, stopPrice, riskPrice]) // Trigger effect when any of these values change

    // Handle increment and decrement of input values
    const handleIncrease = (setter, value) => {
        setter((prevValue) => (parseFloat(prevValue) + 0.1).toFixed(1))
    }

    const handleDecrease = (setter, value) => {
        setter((prevValue) => (parseFloat(prevValue) - 0.1).toFixed(1))
    }

    return (
        <div className=''>
            <div className='mb-1'>
                <p className='text-sm font-medium text-white mb-1'>
                    Entry Price
                </p>
                <div className='flex'>
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
                    Stop Price
                </p>
                <div className='flex'>
                    <button
                        onClick={() => handleDecrease(setStopPrice, stopPrice)}
                        className='text-base  px-2 bg-[#171d33] text-white rounded-l-md'
                    >
                        <FiMinus />
                    </button>
                    <input
                        type='number'
                        value={stopPrice}
                        onChange={(e) => setStopPrice(e.target.value)}
                        className='w-full py-3 px-3 pr-2 bg-[#171d33] text-white  focus:outline-none'
                    />
                    <button
                        onClick={() => handleIncrease(setStopPrice, stopPrice)}
                        className='text-base  px-2 bg-[#171d33] text-white rounded-r-md'
                    >
                        <GoPlus />
                    </button>
                </div>
            </div>
            <div className='mb-1'>
                <p className='text-sm font-medium text-white mb-1'>
                    Risk Price
                </p>
                <div className='flex'>
                    <button
                        onClick={() => handleDecrease(setRiskPrice, riskPrice)}
                        className='text-base  px-2 bg-[#171d33] text-white rounded-l-md'
                    >
                        <FiMinus />
                    </button>
                    <input
                        type='number'
                        value={riskPrice}
                        onChange={(e) => setRiskPrice(e.target.value)}
                        className='w-full py-3 px-3 pr-2 bg-[#171d33] text-white  focus:outline-none'
                    />
                    <button
                        onClick={() => handleIncrease(setRiskPrice, riskPrice)}
                        className='text-base  px-2 bg-[#171d33] text-white rounded-r-md'
                    >
                        <GoPlus />
                    </button>
                </div>
            </div>

            {stopLossPercent !== null && (
                <div className='mt-4'>
                    <h2 className='text-[1.2rem] font-medium text-white mb-1'>
                        Results
                    </h2>
                    <p className='mb-1 text-white'>
                        <strong>Stop Loss Percentage:</strong>{' '}
                        {stopLossPercent !== null
                            ? `${stopLossPercent}%`
                            : 'N/A'}
                    </p>
                    <p className='mb-1 text-white'>
                        <strong>Position Size:</strong>{' '}
                        {positionSize !== null
                            ? positionSize.toFixed(2)
                            : 'N/A'}
                    </p>
                    <p className='mb-2 text-white'>
                        <strong>Number of Shares:</strong>{' '}
                        {numOfShares !== null ? numOfShares : 'N/A'}
                    </p>
                </div>
            )}
        </div>
    )
}

export default StopLossVal
