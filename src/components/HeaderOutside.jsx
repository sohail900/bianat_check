import React,{useEffect, useState} from "react";
import logo from "@assets/bianat-logo.png";
import { useTranslation } from "react-i18next";
import Button from "@shared/ui/Button";
import { Link } from "react-router-dom";
import { useLenis } from "@studio-freight/react-lenis";
import { ROUTES } from "@shared/constants";
import LanguageModal from "../pages/landing/Components/LanguageModal";
import { useLocation } from "react-router-dom";

const sections = [
	{ name: "Services", id: "services" },
	{ name: "Plans", id: "plans" },
	{ name: "FAQ", id: "faq" },
];


const Navbar = () => {
	const lenis = useLenis();
	const { t,i18n } = useTranslation();
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const location = useLocation();
	// const scrollTo = (id: string) => {
	// 	const element = document.getElementById(id);
	// 	if (element) {
	// 		lenis.scrollTo(element, { offset: -100 });
	// 	}
	// };


	return (
        <nav
            className={`flex justify-between items-center w-full head ${
                i18n.language === 'en' ? 'font-lodaer-en-cairo' : 'font-loader'
            }`}
            
        >
            <img src={logo} className="w-20 h-20 object-contain" />
            {/* <ul className="list-none hidden md:flex absolute left-1/2 -translate-x-1/2">
				{sections.map((section, index) => (
					<a
						onClick={() => scrollTo(section.id)}
						className={`mx-2 cursor-pointer text-base hover:text-blue-600 transition-all`}
						key={index}
					>
						{t(section.name).toString()}
					</a>
				))}
			</ul> */}
            <div className="flex space-x-2">
                <Button
                    onClick={() => {
                        console.log("hello")
                        // setShowLanguageModal(true)
                        }
                    }
                    className="mx-2"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.4}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                        />
                    </svg>
                </Button>
                <Link to="http://blog.bianat.sa" target="_blank">
                    <Button>{t('Knowledge Center').toString()}</Button>
                </Link>
                { location.pathname!=='/saudi-founding-day-year-package-offer' &&
                <Link to={ROUTES.signIn}>
                    <Button className="uppercase h-full">{t('Sign_In')}</Button>
                </Link>
                    }
            </div>
            <LanguageModal
                isOpen={showLanguageModal}
                closeModal={() => setShowLanguageModal(false)}
            />
        </nav>
    )
};

export default Navbar;
