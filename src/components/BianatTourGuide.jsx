import React from 'react'
import Tour from 'reactour'
const BianatTourGuide = ({ steps, isOpen, setIsGuideOpen }) => {
    return (
        <Tour steps={steps} isOpen={isOpen} onRequestClose={()=>setIsGuideOpen(false)} />
    )
}
 
export default BianatTourGuide;