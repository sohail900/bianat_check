import React, { useState } from 'react'
import Home from './sections/Home'
import Services from './sections/Services'
import SectionDivider from './Components/section-divider'
import Plans from './sections/Plans'
import Footer from './Components/Footer'
import Faq from './sections/Faq'
import LanguageModal from './Components/LanguageModal'
import { ReactLenis } from '@studio-freight/react-lenis'
//@ts-ignore
import TawkMessengerReact from '@tawk.to/tawk-messenger-react'

export default function Landing() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <ReactLenis root>
            <main className='font-cairo max-w-7xl mx-auto px-5 md:px-10 flex flex-col items-center h-auto text-center overflow-x-hidden'>
                <LanguageModal
                    isOpen={isOpen}
                    closeModal={() => setIsOpen(false)}
                />
                <div className='fixed w-screen h-screen bg-gradient-to-br from-white to-[#F8FAFF] right-0 left-0 -z-10' />
                <Home onLangPress={() => setIsOpen(true)} />
                <Services />
                <SectionDivider />
                <Plans />
                <SectionDivider />
                <TawkMessengerReact
                    widgetId='1fvv5su7b'
                    propertyId='624d680ec72df874911d4c3e'
                />
                <Faq />
                <Footer />
            </main>
        </ReactLenis>
    )
}
