import React, { useState, useEffect } from 'react'
import { NavLink as Link, useLocation, useNavigate } from 'react-router-dom'
import {
    Layout,
    Menu,
    Image,
    Switch,
    Dropdown,
    Avatar,
    Space,
    Tooltip,
    Button,
    notification,
} from 'antd'
import { useTranslation } from 'react-i18next'
import cookies from 'js-cookie'
import i18next from 'i18next'
import { InfoCircleOutlined } from '@ant-design/icons'
import MobileScreenNotAvailable from './MobileScreenNotAvailable'
import RiskCalculator from '../pages/RiskCalculator/RiskCalculator'

import {
    StockOutlined,
    DownOutlined,
    LineChartOutlined,
    QuestionCircleOutlined,
    QuestionCircleTwoTone,
} from '@ant-design/icons'
import bianatLog from '../assets/bianat-logo.png'
import transparent from '../assets/transparent.png'
import UserAuthModal from '../components/UserAuthModal'
import { useDispatch, useSelector } from 'react-redux'
import { updateTheme } from '../features/Theme/themeSlice'
import { changeLanguage } from '../features/Language/languageSlice'
import { logout } from '../features/Auth/authSlice'
import Feedback from './Feedback'
import { IoCalculatorOutline } from 'react-icons/io5'

/**
 * @name: BianatHeader
 * @description:  Header Component for the app.
 * @purpose: To render the header of the app.
 * @returns {JSX.Element}
 */

const BianatHeader = ({ setIsGuideOpen = () => {}, followUpPage }) => {
    const loc = useLocation()
    const [active, setActive] = useState('login')
    const [showModal, setShowModal] = useState(false)
    const [toggleCalculator, setToggleCalculator] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const currentTheme = useSelector((state) => state.currentTheme.currentTheme)
    const auth = useSelector((state) => state.auth)
    const [isDark, setIsDark] = useState(currentTheme === 'Dark')
    const [currentLocation, setCurrentLocation] = useState(loc.pathname)
    const [width, setWidth] = useState(window.innerWidth)
    const [showFeedback, setShowFeedback] = useState(false)
    const { t, i18n } = useTranslation()
    const { Header } = Layout
    const dispatch = useDispatch()

    const isAdmin = auth?.user?.roles?.includes('admin')
    const navigate = useNavigate()

    const handleUsername = () => {
        return auth.user.username.match(/\b(\w)/g).join('')
    }

    const handleTheme = (checked) => {
        setIsDark(checked)
        if (checked) {
            dispatch(updateTheme('Dark'))
        } else {
            dispatch(updateTheme('Light'))
        }
    }

    function handleWindowSizeChange() {
        setWidth(window.innerWidth)
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange)
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange)
        }
    }, [])

    const handleSignUpInModal = (value) => {
        // if (width < 768) {
        //   setIsModalVisible(!isModalVisible);
        // } else {
        if (value === 'signin') {
            setShowModal(true)
            setActive('login')
        } else {
            setShowModal(true)
            setActive('signup')
        }
        // }
    }

    const handleHeader = () => {
        if (auth.isAuth) {
            return true
        }
        return false
    }

    const [disableLinks, setDisableLinks] = useState(false)
    const [isNotificationOpen, setIsNotificationOpen] = useState(false)

    useEffect(() => {
        const storedSub = localStorage.getItem('new_sub')
        if (storedSub) {
            const parsedSub = JSON.parse(storedSub)
            setDisableLinks(!parsedSub.subscribed)
        }
    }, [])

    const usermenu = (
        <Menu
            className={`${currentTheme === 'Dark' && 'dark-skin'} ${
                i18n.language === 'en' ? 'font-loader-en' : 'font-loader'
            }`}
        >
            <Menu.Item>
                <Link to='/settings'>
                    <i className='fa-solid fa-gear'></i> {t('Settings')}
                </Link>
            </Menu.Item>
            {isAdmin && (
                <Menu.Item>
                    <Link to='/upload-data'>
                        <Space>
                            <i className='fa-solid fa-upload'></i>
                            <span>{t('Admin')}</span>
                        </Space>
                    </Link>
                </Menu.Item>
            )}
            <Menu.Item>
                <a
                    target='_blank'
                    rel='noopener noreferrer'
                    href='#'
                    onClick={(e) => {
                        e.preventDefault()
                        dispatch(logout())
                    }}
                >
                    <i className='fa-solid fa-arrow-right-from-bracket'></i>{' '}
                    {t('Log Out')}
                </a>
            </Menu.Item>
        </Menu>
    )

    const handleCookiesAndLanguage = (value) => {
        cookies.set('i18next', value)
        dispatch(changeLanguage(value))
        i18next.changeLanguage(value)
    }
    const text = <span>Coming Soon</span>
    const languageMenu = (
        <Menu
            onClick={(e) => {
                handleCookiesAndLanguage(e.key)
            }}
            className={`${currentTheme === 'Dark' && 'dark-skin'}`}
        >
            <Menu.Item key='en'>English</Menu.Item>
            <Menu.Item key='ar'>عربي</Menu.Item>
        </Menu>
    )

    // useEffect(() => {
    //   setCurrentLocation(loc.pathname);
    //   const interval = () => {
    //     return setInterval(() => {
    //       setCurrentTime(moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
    //     }, 1000);
    //   };
    //   const timer = interval();

    //   return () => {
    //     clearInterval(timer);
    //   };
    // }, []);
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const [api, contextHolder] = notification.useNotification()

    const openNotification = () => {
        if (isNotificationOpen) return // Prevent multiple notifications

        setIsNotificationOpen(true)
        api.info({
            message: t('Warning'),
            description: t(
                "Dear user, your account doesn't have an active subscription. Please subscribe to continue using the service."
            ),
            placement: 'topLeft',
            duration: 20,
            className: 'notification',
            style: {
                background: 'yellow',
                color: 'black',
                width: 600,
                fontSize: 16,
                fontWeight: 'bold',
                direction: 'ltr',
            },
            onClose: () => setIsNotificationOpen(false),
        })
    }

    return (
        <>
            <Header
                className={`${
                    i18n.language === 'en' ? 'font-loader-en' : 'font-loader'
                } ${currentTheme === 'Dark' && 'dark-skin'} ${
                    followUpPage === 'true' && 'top-0'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {contextHolder}

                <div className='logo'>
                    <Link to='/dashboard'>
                        <Image
                            src={
                                currentTheme === 'Dark'
                                    ? transparent
                                    : bianatLog
                            }
                            alt='logo'
                            preview={false}
                        />
                    </Link>
                </div>

                {currentLocation && handleHeader() && (
                    <Menu
                        selectedKeys={[currentLocation]}
                        theme='light'
                        style={{ width: '50%' }}
                        mode='horizontal'
                        onClick={() => {
                            if (disableLinks) {
                                openNotification()
                            }
                        }}
                    >
                        <Menu.Item key='/dashboard'>
                            <Link
                                to={'/dashboard'}
                                className={`${
                                    disableLinks ? 'pointer-events-none' : ''
                                }`}
                            >
                                <Space>
                                    <i className='fa-solid fa-house'></i>
                                    <span>{t('Dashboard')}</span>
                                </Space>
                            </Link>
                        </Menu.Item>
                        <Menu.Item
                            key='/console'
                            onClick={() => {
                                window.open(
                                    '/console',
                                    'window',
                                    'width=1600, height=1000',
                                    'toolbar=no, menubar=no, resizable=yes'
                                )
                            }}
                            className={`${
                                disableLinks ? 'pointer-events-none' : ''
                            }`}
                        >
                            <Link to='#'>
                                <Space>
                                    <i className='far fa-chart-bar'></i>
                                    <span>{t('Console')}</span>
                                </Space>
                            </Link>
                        </Menu.Item>

                        <Menu.Item key='/marketPulse'>
                            <Link
                                to='/marketPulse'
                                className={`${
                                    disableLinks ? 'pointer-events-none' : ''
                                }`}
                            >
                                <Space>
                                    <LineChartOutlined />
                                    <span>{t('Market Pulse')}</span>
                                </Space>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key='/openPosition'>
                            <Link
                                to='/openPostions'
                                className={`${
                                    disableLinks ? 'pointer-events-none' : ''
                                }`}
                            >
                                <Space>
                                    <span>{t('openPosition.heading')}</span>
                                </Space>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key='/followUp'>
                            <Link
                                to='/followUp'
                                className={`${
                                    disableLinks ? 'pointer-events-none' : ''
                                }`}
                            >
                                <Space>
                                    <span>{t('followup.followUp')}</span>
                                </Space>
                            </Link>
                        </Menu.Item>
                        <Menu.Item
                            key='/risk-calculator'
                            onClick={() => setToggleCalculator(true)}
                        >
                            <p

                            // className={`${
                            //     disableLinks ? 'pointer-events-none' : ''
                            // }`}
                            >
                                <Space>
                                    <IoCalculatorOutline />
                                    <span>{t('riskCalc')}</span>
                                </Space>
                            </p>
                        </Menu.Item>

                        <Menu.Item
                            key='https://bianat.tawk.help/'
                            onClick={() => {
                                window.open('https://bianat.tawk.help/')
                            }}
                        >
                            <Link
                                to='#'
                                className={`${
                                    disableLinks ? 'pointer-events-none' : ''
                                }`}
                            >
                                <Space>
                                    <QuestionCircleOutlined />
                                    <span>{t('Knowledge Center')}</span>
                                </Space>
                            </Link>
                        </Menu.Item>

                        <Menu.Item
                            key='/screener'
                            disabled
                            className={`${
                                disableLinks ? 'pointer-events-none' : ''
                            }`}
                        >
                            <Tooltip title={text} placement='topLeft'>
                                <Link to='/screener'>
                                    <Space>
                                        <StockOutlined />
                                        <span>{t('Screener')}</span>
                                    </Space>
                                </Link>
                            </Tooltip>
                        </Menu.Item>
                    </Menu>
                )}
                <div
                    className={`${
                        i18n.language === 'en'
                            ? 'search-form'
                            : 'search-form-ar'
                    }`}
                >
                    {currentLocation && !handleHeader() && (
                        <Link to='#' className='knowledge-tab'>
                            <span
                                onClick={() => {
                                    window.open('https://bianat.tawk.help/')
                                }}
                            >
                                <span>{t('Knowledge Center')}</span>
                            </span>
                        </Link>
                    )}
                    {isAdmin && (
                        <Button
                            type='primary'
                            shape='round'
                            onClick={() => {
                                window.open(
                                    '/feedbacks',
                                    'window',
                                    'width=1600, height=1000',
                                    'toolbar=no, menubar=no, resizable=yes'
                                )
                            }}
                        >
                            {t('View Feedback')}
                        </Button>
                    )}
                    <Button
                        type='primary'
                        shape='round'
                        className='mx-1'
                        onClick={() => setShowFeedback(!showFeedback)}
                    >
                        {t('Feedback')}
                    </Button>
                    <Button
                        shape='round'
                        type='primary'
                        className='px-1 h-6 mt-[3px]'
                        icon={
                            <InfoCircleOutlined className='text-white text-[14px]' />
                        }
                        onClick={() => setIsGuideOpen(true)}
                    ></Button>
                    <div className='time-phone'>
                        <div className='phone'>
                            <Link to='tel:96265777766'>
                                <span className='text-nowrap'>
                                    Tel:(966)-505841283
                                </span>
                            </Link>
                        </div>
                        {/* <span className="timedate">{currentTime}</span> */}
                    </div>

                    <Switch
                        className={`${i18n.language === 'ar' && 'radiobtn-ar'}`}
                        onChange={(checked) => {
                            handleTheme(checked)
                        }}
                        checked={isDark}
                    />
                </div>

                <Menu
                    theme='light'
                    className={`log-menu ${
                        !handleHeader() ? 'menu-header' : 'menu-header-landing'
                    }`}
                    mode='horizontal'
                >
                    <Menu.Item key='1'>
                        <Dropdown
                            placement='bottomRight'
                            className={`lang-dropdown ${isDark && 'dark-skin'}`}
                            arrow
                            overlay={languageMenu}
                        >
                            <a
                                className='ant-dropdown-link'
                                onClick={(e) => e.preventDefault()}
                            >
                                <i className='fa-solid fa-language'></i>
                            </a>
                        </Dropdown>
                    </Menu.Item>

                    {!handleHeader() ? (
                        <>
                            {/* <Menu.Item key="2" onClick={() => handleSignUpInModal("signin")}>
                {`${t("Sign_In")}`}
              </Menu.Item> */}
                            <Menu.Item
                                key='3'
                                className='highlight-btn'
                                onClick={() => navigate('/')}
                            >
                                <span>Home</span>
                            </Menu.Item>
                        </>
                    ) : (
                        <Menu.Item key='2'>
                            <Dropdown
                                placement='bottomRight'
                                overlayClassName='user-menu'
                                overlay={usermenu}
                            >
                                <a
                                    className='ant-dropdown-link'
                                    onClick={(e) => e.preventDefault()}
                                >
                                    <Avatar style={{ background: 'orange' }}>
                                        {handleUsername()}
                                    </Avatar>
                                    <DownOutlined />
                                </a>
                            </Dropdown>
                        </Menu.Item>
                    )}
                </Menu>
            </Header>
            <Feedback
                setShowFeedback={setShowFeedback}
                showFeedback={showFeedback}
            />
            <UserAuthModal
                showModal={showModal}
                setShowModal={setShowModal}
                active={active}
                setActive={setActive}
            />
            <MobileScreenNotAvailable
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
            />
            {/* risk calculator */}
            <RiskCalculator
                toggleCalculator={toggleCalculator}
                setToggleCalculator={setToggleCalculator}
            />
        </>
    )
}

export default BianatHeader
