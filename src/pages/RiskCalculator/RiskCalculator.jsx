import React, { useState, useRef, useEffect } from 'react'
import { CgClose } from 'react-icons/cg'
import RiskFinance from './subComps/riskFinance'

import StopLoss from './subComps/stopLoss'

const RiskCalculator = ({ toggleCalculator, setToggleCalculator }) => {
    const [calculationType, setCalculationType] = useState('riskFinance')
    const calRef = useRef(null)
    const handleClick = (e) => {
        if (calRef.current && !calRef.current.contains(e.target)) {
            setToggleCalculator(false)
        }
    }
    useEffect(() => {
        if (toggleCalculator) {
            document.addEventListener('click', handleClick)
        } else {
            document.removeEventListener('click', handleClick)
        }
        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [toggleCalculator])
    return (
        <div
            ref={calRef}
            className={`z-50 shadow-md fixed h-screen w-[35%] max-lg:w-[55%] max-sm:w-[80%] overflow-y-auto transition-all ease-linear duration-200 bg-[#283142] ${
                toggleCalculator ? 'right-0' : '-right-full'
            }`}
        >
            <div className='bg-[#004f86] py-3 px-2 relative'>
                <CgClose
                    size={23}
                    className='text-white/90 absolute left-4 cursor-pointer'
                    onClick={() => setToggleCalculator(false)}
                />
                <h1 className='text-base text-center font-medium  text-white'>
                    Stock Calculator
                </h1>
            </div>
            <div className='my-4 px-4'>
                <h1 className='text-[1rem] text-white'>Calculator Type</h1>
                <div className='w-full rounded-md bg-[#171d33] flex overflow-hidden mt-1'>
                    <button
                        className={`py-3 px-2 flex-1  ${
                            calculationType === 'riskFinance'
                                ? 'bg-[#004f86] text-white'
                                : 'text-white/60'
                        }`}
                        onClick={() => setCalculationType('riskFinance')}
                    >
                        Risk Finance
                    </button>
                    <button
                        className={`py-3 px-2 flex-1  ${
                            calculationType === 'stopLoss'
                                ? 'bg-[#004f86] text-white'
                                : 'text-white/60'
                        }`}
                        onClick={() => setCalculationType('stopLoss')}
                    >
                        Stop Loss
                    </button>
                </div>
            </div>

            {calculationType === 'riskFinance' && (
                <div className='px-4'>
                    <RiskFinance />
                </div>
            )}
            {calculationType === 'stopLoss' && (
                <div className='px-4'>
                    {' '}
                    <StopLoss />
                </div>
            )}
        </div>
    )
}

export default RiskCalculator
