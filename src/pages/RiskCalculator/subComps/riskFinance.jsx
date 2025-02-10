import React, { useState, useEffect } from 'react'
import { GoPlus } from 'react-icons/go'
import { FiMinus } from 'react-icons/fi'
import { IoReload } from 'react-icons/io5'

const RiskFinance = () => {
    const [calculationMode, setCalculationMode] = useState('Value') // "Value" or "Percentage"
    const [buyPrice, setBuyPrice] = useState('')
    const [numberOfShares, setNumberOfShares] = useState('')
    const [stopPriceCtrl, setStopPriceCtrl] = useState('')
    const [percentageInput, setPercentageInput] = useState('')
    const [currentPriceCtrl, setCurrentPriceCtrl] = useState('')
    const [results, setResults] = useState([])
    const [riskPercent, setRiskPercent] = useState(0)
    const [risk, setRisk] = useState(0)

    useEffect(() => {
        generateResults(
            buyPrice,
            numberOfShares,
            stopPriceCtrl,
            currentPriceCtrl,
            calculationMode,
            percentageInput
        )
    }, [
        buyPrice,
        numberOfShares,
        stopPriceCtrl,
        percentageInput,
        currentPriceCtrl,
        calculationMode,
    ])

    const generateResults = (
        buyPrice,
        shares,
        stopPrice,
        currentPrice,
        mode,
        percentage
    ) => {
        const parsedBuyPrice = parseFloat(buyPrice) || 0
        const parsedShares = parseInt(shares) || 0
        const parsedCurrentPrice = parseFloat(currentPrice) || 0

        let parsedStopPrice = parseFloat(stopPrice) || 0

        // If mode is Percentage, calculate stop price from the percentage input
        if (mode === 'Percentage') {
            const parsedPercentage = parseFloat(percentage) || 0
            parsedStopPrice =
                parsedBuyPrice - (parsedBuyPrice * parsedPercentage) / 100
        }

        const riskPercentage =
            ((parsedStopPrice - parsedBuyPrice) / parsedBuyPrice) * 100
        const riskPrice = parsedBuyPrice * parsedShares * (riskPercentage / 100)

        setRiskPercent(parseFloat(riskPercentage.toFixed(2)) || 0)
        setRisk(parseFloat(riskPrice.toFixed(2)) || 0)

        const percentages = [100, 75, 50, 25]
        const calculatedResults = []

        for (let i = 0; i < percentages.length; i++) {
            const newShares = Math.floor(
                (((riskPercentage / 100) * (parsedBuyPrice * parsedShares)) /
                    (parsedCurrentPrice - parsedStopPrice)) *
                    -1 *
                    (percentages[i] / 100)
            )

            const gain = Math.ceil(
                newShares * parsedCurrentPrice - newShares * parsedBuyPrice
            )
            const loss = Math.ceil(
                (parsedShares - newShares) * parsedStopPrice -
                    (parsedShares - newShares) * parsedBuyPrice
            )
            const net = gain + loss
            const netPercent = (net / (parsedBuyPrice * parsedShares)) * 100

            calculatedResults.push({
                onPercentRisk: percentages[i],
                newShares,
                gain: parseFloat(gain.toFixed(2)) || 0,
                loss: parseFloat(loss.toFixed(2)) || 0,
                net: parseFloat(net.toFixed(2)) || 0,
                netPercent: parseFloat(netPercent.toFixed(2)) || 0,
            })
        }

        setResults(calculatedResults)
    }

    // Handle increment and decrement of input values
    const handleIncrease = (setter, value) => {
        setter((prevValue) => (parseFloat(prevValue) + 0.1).toFixed(1))
    }

    const handleDecrease = (setter, value) => {
        setter((prevValue) => (parseFloat(prevValue) - 0.1).toFixed(1))
    }
    //
    const resetAllInput = () => {
        setBuyPrice('')
        setNumberOfShares('')
        setStopPriceCtrl('')
        setPercentageInput('')
        setCurrentPriceCtrl('')
        setRiskPercent(0)
        setRisk(0)
        setResults([])
    }
    return (
        <>
            <div className='mb-1'>
                <select
                    value={calculationMode}
                    onChange={(e) => setCalculationMode(e.target.value)}
                    className='w-full py-3 px-2 bg-[#171d33] text-white rounded-md focus:ring focus:ring-[#004f86] focus:outline-none'
                >
                    <option value='Value'>Value</option>
                    <option value='Percentage'>Percentage</option>
                </select>
            </div>

            <div className='mb-1'>
                <p className='text-sm font-medium text-white mb-1'>Buy Price</p>
                <div className='flex'>
                    <button
                        onClick={() => handleDecrease(setBuyPrice, buyPrice)}
                        className='text-base  px-2 bg-[#171d33] text-white rounded-l-md'
                    >
                        <FiMinus />
                    </button>
                    <input
                        type='number'
                        value={buyPrice}
                        onChange={(e) => setBuyPrice(e.target.value)}
                        className='w-full py-3 px-3 pr-2 bg-[#171d33] text-white  focus:outline-none'
                    />
                    <button
                        onClick={() => handleIncrease(setBuyPrice, buyPrice)}
                        className='text-base  px-2 bg-[#171d33] text-white rounded-r-md'
                    >
                        <GoPlus />
                    </button>
                </div>
            </div>

            <div className='mb-1'>
                <p className='text-sm font-medium text-white mb-1'>
                    Number of Shares
                </p>
                <div className='flex'>
                    <button
                        onClick={() =>
                            handleDecrease(setNumberOfShares, numberOfShares)
                        }
                        className='text-base  px-2 bg-[#171d33] text-white rounded-l-md'
                    >
                        <FiMinus />
                    </button>
                    <input
                        type='number'
                        value={numberOfShares}
                        onChange={(e) => setNumberOfShares(e.target.value)}
                        className='w-full py-3 px-3 pr-2 bg-[#171d33] text-white  focus:outline-none'
                    />
                    <button
                        onClick={() =>
                            handleIncrease(setNumberOfShares, numberOfShares)
                        }
                        className='text-base  px-2 bg-[#171d33] text-white rounded-r-md'
                    >
                        <GoPlus />
                    </button>
                </div>
            </div>

            {calculationMode === 'Value' ? (
                <div className='mb-1'>
                    <p className='text-sm font-medium text-white mb-1'>
                        Stop Price
                    </p>
                    <div className='flex'>
                        <button
                            onClick={() =>
                                handleDecrease(setStopPriceCtrl, stopPriceCtrl)
                            }
                            className='text-base  px-2 bg-[#171d33] text-white rounded-l-md'
                        >
                            <FiMinus />
                        </button>
                        <input
                            type='number'
                            value={stopPriceCtrl}
                            onChange={(e) => setStopPriceCtrl(e.target.value)}
                            className='w-full py-3 px-3 pr-2 bg-[#171d33] text-white  focus:outline-none'
                        />
                        <button
                            onClick={() =>
                                handleIncrease(setStopPriceCtrl, stopPriceCtrl)
                            }
                            className='text-base  px-2 bg-[#171d33] text-white rounded-r-md'
                        >
                            <GoPlus />
                        </button>
                    </div>
                </div>
            ) : (
                <div className='mb-1'>
                    <p className='text-sm font-medium text-white mb-1'>
                        Percentage
                    </p>
                    <div className='flex'>
                        <button
                            onClick={() =>
                                handleDecrease(
                                    setPercentageInput,
                                    percentageInput
                                )
                            }
                            className='text-base  px-2 bg-[#171d33] text-white rounded-l-md'
                        >
                            <FiMinus />
                        </button>
                        <input
                            type='number'
                            value={percentageInput}
                            onChange={(e) => setPercentageInput(e.target.value)}
                            className='w-full py-3 px-3 pr-2 bg-[#171d33] text-white  focus:outline-none'
                        />
                        <button
                            onClick={() =>
                                handleIncrease(
                                    setPercentageInput,
                                    percentageInput
                                )
                            }
                            className='text-base  px-2 bg-[#171d33] text-white rounded-r-md'
                        >
                            <GoPlus />
                        </button>
                    </div>
                </div>
            )}

            <div>
                <p className='text-sm font-medium text-white mb-1'>
                    Current Price
                </p>
                <div className='flex'>
                    <button
                        onClick={() =>
                            handleDecrease(
                                setCurrentPriceCtrl,
                                currentPriceCtrl
                            )
                        }
                        className='text-base  px-2 bg-[#171d33] text-white rounded-l-md'
                    >
                        <FiMinus />
                    </button>
                    <input
                        type='number'
                        value={currentPriceCtrl}
                        onChange={(e) => setCurrentPriceCtrl(e.target.value)}
                        className='w-full py-3 px-3 pr-2 bg-[#171d33] text-white  focus:outline-none'
                    />
                    <button
                        onClick={() =>
                            handleIncrease(
                                setCurrentPriceCtrl,
                                currentPriceCtrl
                            )
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
                {calculationMode === 'Value' && (
                    <p className='text-sm text-white mb-2'>
                        Risk Percentage: {riskPercent}%
                    </p>
                )}
                {calculationMode === 'Percentage' && (
                    <p className='text-sm text-white mb-2'>
                        Risk Price: {risk}
                    </p>
                )}
                {results.length > 0 && (
                    <table className='w-full border-collapse'>
                        <thead className='text-sm text-white font-medium'>
                            <tr>
                                <th className='p-2 text-left bg-[#004f86] rounded-tl-md'>
                                    Percent Risk
                                </th>
                                <th className='bg-[#004f86] p-2 text-left'>
                                    New Shares
                                </th>
                                <th className='bg-[#004f86] p-2 text-left'>
                                    Gain
                                </th>
                                <th className='bg-[#004f86] p-2 text-left'>
                                    Loss
                                </th>
                                <th className='bg-[#004f86] p-2 text-left'>
                                    Net
                                </th>
                                <th className='bg-[#004f86] p-2 text-left rounded-tr-md'>
                                    Net Percent
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((result, index) => (
                                <tr
                                    key={index}
                                    className='odd:bg-[#171d33] text-white text-center'
                                >
                                    <td className='px-2 py-1'>
                                        {result.onPercentRisk}%
                                    </td>
                                    <td className='px-2 py-1'>
                                        {result.newShares}
                                    </td>
                                    <td className='px-2 py-1'>{result.gain}</td>
                                    <td className='px-2 py-1'>{result.loss}</td>
                                    <td className='px-2 py-1'>{result.net}</td>
                                    <td className='px-2 py-1'>
                                        {result.netPercent}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <button
                className='w-full mt-2 bg-[#004f86] text-white py-2 mb-1 rounded-full flex items-center justify-center gap-2 transition-opacity ease-linear hover:opacity-75 text-base font-medium'
                onClick={resetAllInput}
            >
                Start over <IoReload />
            </button>
        </>
    )
}

export default RiskFinance
