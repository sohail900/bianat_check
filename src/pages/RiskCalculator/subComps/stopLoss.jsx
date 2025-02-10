import React, { useState } from 'react'
import StopLossPercent from './StopLossPercent'
import StopLossVal from './StopLossVal'
const StopLoss = () => {
    const [calcMode, setCalcMode] = useState('Percentage')

    return (
        <>
            <div className='mb-1'>
                <select
                    value={calcMode}
                    onChange={(e) => setCalcMode(e.target.value)}
                    className='w-full py-3 px-2 bg-[#171d33] text-white rounded-md focus:ring focus:ring-[#004f86] focus:outline-none'
                >
                    <option value='Value'>Value</option>
                    <option value='Percentage'>Percentage</option>
                </select>
            </div>

            {calcMode === 'Percentage' && <StopLossPercent />}
            {calcMode === 'Value' && <StopLossVal />}
        </>
    )
}

export default StopLoss
