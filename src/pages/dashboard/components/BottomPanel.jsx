import React, { useState, useEffect, memo, useContext } from 'react'
import { Row, Col, Dropdown, Menu, Tooltip, Button, message, Tree } from 'antd'
import {
    PlayCircleOutlined,
    PauseCircleOutlined,
    ExpandOutlined,
    SaveOutlined,
    CloseOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { CaretUpOutlined, MinusSquareOutlined } from '@ant-design/icons'
import Screener from './Screener'
import BottomPanelDropDown from './BottomPanel/BottomPanelDropDown'
import Quarter from './BottomPanel/Quarter'
import SettingPanel from './BottomPanel/SettingPanel'
import { changeLanguage } from '../../../features/Language/languageSlice'
import SubscriptionGaurd from '../../../hoc/SubscriptionGaurd'
import MultilevelDropdown from './MultilevelDropdown'
import { KuzzleContext } from '../../../App'
import authApi from './../../../services/authApi'
import dropdownKeys from '../../../assets/dropdownKeys.json'

/**
 * @name BottomPanel
 * @description Bottom panel component for dashboard
 * @purpose To display bottom panel data
 * @param {handleChartHeight} handleChartHeight - function to handle chart height
 * @param {handleBottomPanel} handleBottomPanel - function to handle bottom panel
 * @param {showScreener} showScreener - function to show screener
 * @param {selectedFilter} selectedFilter - selected filter
 * @param {isOpenBottomPanel} isOpenBottomPanel - is open bottom panel boolean
 * @param {handleBottomHalf} handleBottomHalf - function to handle bottom half screen size
 * @param {handleBottomFull} handleBottomFull - function to handle bottom full screen size
 *  @param {showBottomFull} showBottomFull - show bottom full boolean
 * @param {showBottomHalf} showBottomHalf - show bottom half boolean
 * @param {handleCurrentFilter} handleCurrentFilter - function to handle current filter
 * @returns {JSX} JSX element
 */

const BottomPanel = ({
    handleChartHeight,
    handleBottomPanel,
    handleShowScreener,
    showScreener,
    selectedFilter,
    isOpenBottomPanel,
    handleBottomHalf,
    handleBottomFull,
    showBottomFull,
    handleChartHeightOnViewScreener,
    showBottomHalf,
    handleCurrentFilter,
    currentInterval,
    currentAction,
    ActionsData,
    currentTrader,
}) => {
    const { user, subscriptionDetails } = useSelector((state) => state.auth)
    const { kuzzleHttp: kuzzle } = useContext(KuzzleContext)
    const [quarters, setQuarters] = useState([])
    const [earning, setEarning] = useState('eps')
    const [sales, setSales] = useState('sales')
    const [taxMargin, setTaxMargin] = useState('margin')
    const currentStock = useSelector((state) => state.currentStock.currentStock)
    const [play, setPlay] = useState(false)
    const [duration, setDuration] = useState(5000)
    const [initialPos, setInitialPos] = useState(null)
    const [initialSize, setInitialSize] = useState(null)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [dynamicColumn, setDynamicColumn] = useState([])
    const [stocksInScreen, setStocksInScreen] = useState([])
    const [kuzzleData, setKuzzleData] = useState([])
    const [choice, setChoice] = useState(null)
    const { i18n, t } = useTranslation()
    const dispatch = useDispatch()
    const { currentTheme } = useSelector((state) => state.currentTheme)
    const { screenerName } = useSelector((state) => state.currentScreener)
    let i = currentInterval.includes('D') ? 4 : window.innerWidth > 1800 ? 8 : 4
    const getStocksInScreen = async () => {
        const actions = currentAction.split('-')

        try {
            const response = await authApi.get(
                `/stock-actions/actions/${actions[1]}/${actions[0]}`
            )

            setStocksInScreen(response.data)
            setKuzzleData(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    const getTopTraders = async () => {
        try {
            const response = await authApi.get(
                `/screen-matrix/${currentTrader}`
            )
            setStocksInScreen(response.data)
            setKuzzleData(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (currentAction) {
            getStocksInScreen()
        }
        if (ActionsData && ActionsData.length > 0) {
            setStocksInScreen(ActionsData)
            setKuzzleData(ActionsData)
            handleShowScreener(true)
        }
    }, [currentAction, ActionsData])

    useEffect(() => {
        if (currentTrader) {
            getTopTraders()
        }
    }, [currentTrader])

    useEffect(() => {
        const getQuarterlyFundamentalData = async () => {
            try {
                const response = await authApi.get(
                    `/fundamentals/quarterly-fundamental-data/${currentStock}`
                )
                let filterQuarters = response.data.filter(
                    (quarter) =>
                        !(
                            quarter.eps === 0 &&
                            quarter.sales === 0 &&
                            quarter.margin === 0
                        )
                )
                setQuarters(filterQuarters)
            } catch (err) {
                console.log(err)
            }
        }

        getQuarterlyFundamentalData()
    }, [currentStock])

    useEffect(() => {
        document.getElementById('panel').dir = 'ltr'
        if (document.getElementById('bottom-panel')) {
            document.getElementById('bottom-panel').dir = 'ltr'
        }
        dispatch(changeLanguage(i18n.language))
    }, [i18n.language])

    const handleSaveScreener = async (values) => {
        try {
            const response = await kuzzle.document.create(
                'bianat',
                'screener',
                {
                    ...values,
                    username: user.username,
                }
            )

            handleCurrentFilter({
                ...response._source,
                _id: response._id,
            })

            message.success('Screener saved successfully!!')
        } catch (err) {
            message.error(err.message)
        }
    }

    const manageSizeOFBottomPanel = (value) => {
        switch (value) {
            case 'half':
                handleBottomHalf(!showBottomHalf)
                handleBottomFull(false)
                break
            case 'full':
                handleBottomHalf(false)
                handleBottomFull(!showBottomFull)
                break
            default:
                break
        }
    }
    const initial = (e) => {
        let resizable = document.getElementById('bottom-panel')
        setInitialPos(e.clientY)
        setInitialSize(resizable.offsetHeight)
    }

    const resize = (e) => {
        if (!e.target.id) {
            let resizable = document.getElementById('bottom-panel')
            let diff = e.clientY - initialPos
            // setHeihgtDiff(diff);
            resizable.style.height = `${
                parseInt(initialSize) + parseInt(diff)
            }px`
        }
    }
    const treeData = [
        {
            title: 'Export',
            key: '0-0',
            children: [
                {
                    title: 'Excel',
                    key: 'excel',
                },
                {
                    title: 'Csv',
                    key: 'csv',
                },
            ],
        },
        {
            title: 'Column Selection',
            key: 'columnSelection',
        },
        {
            title: 'Save Layout',
            key: 'saveLayout',
        },
    ]

    const menu = (
        <Menu
            className={`${currentTheme === 'Dark' && 'dark-skin'}`}
            onClick={(e) => {
                setDuration(parseInt(e.key))
            }}
            selectedKeys={[`${duration}`]}
        >
            <Menu.Item key='5000'>5s</Menu.Item>
            <Menu.Item key='10000'>10s</Menu.Item>
            <Menu.Item key='15000'>15s</Menu.Item>
            <Menu.Item key='20000'>20s</Menu.Item>
        </Menu>
    )

    let allowedWidgets = subscriptionDetails?.pages?.find(
        (item) => item.id === 'dashboard'
    )

    return (
        <div id='panel'>
            <div className='max-sm:hidden'>
                {(currentInterval.includes('D') ||
                    currentInterval <= 5 ||
                    currentInterval.includes('W')) && (
                    <Row gutter={0}>
                        <SubscriptionGaurd id='bottompanel' page='dashboard'>
                            {quarters &&
                                quarters.map((quarter, index) => {
                                    if (i > 0) {
                                        i--
                                        if (i === 0) return

                                        return (
                                            <Quarter
                                                key={index}
                                                earnings={earning}
                                                sales={sales}
                                                taxMargin={taxMargin}
                                                wholeData={quarters}
                                                data={quarters[i]}
                                            />
                                        )
                                    }
                                })}
                        </SubscriptionGaurd>
                        {quarters &&
                            quarters.map((quarter, index) => {
                                if (index === 0)
                                    return (
                                        <Quarter
                                            key={index}
                                            earnings={earning}
                                            sales={sales}
                                            taxMargin={taxMargin}
                                            wholeData={quarters}
                                            data={quarters[i]}
                                        />
                                    )
                            })}
                        {quarters && quarters.length > 0 && (
                            <Col flex='60px'>
                                <table className='table table-info'>
                                    <tbody>
                                        <tr>
                                            <th
                                                scope='col'
                                                style={{ padding: 8 }}
                                            >
                                                {/* {t("EPS Due")} 11/12 */}
                                            </th>
                                        </tr>
                                        <tr>
                                            <td>
                                                <BottomPanelDropDown
                                                    options={dropdownKeys.opt1}
                                                    setValue={setEarning}
                                                    placeholder={t(
                                                        'dashboard.EPS'
                                                    )}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <BottomPanelDropDown
                                                    options={dropdownKeys.opt1}
                                                    setValue={setSales}
                                                    placeholder={t(
                                                        `dashboard.sales`
                                                    )}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <BottomPanelDropDown
                                                    options={dropdownKeys.opt2}
                                                    setValue={setTaxMargin}
                                                    placeholder={t(
                                                        `dashboard.margin`
                                                    )}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Col>
                        )}
                    </Row>
                )}
            </div>
            {showScreener && (
                <SubscriptionGaurd id='bottomtable' page='dashboard'>
                    <div
                        id='bottom-panel'
                        className={`bottom-panel max-sm:w-full ${
                            isOpenBottomPanel ? 'is-open' : 'is-close'
                        } ${showBottomHalf ? 'bottom-half-open' : ''} ${
                            showBottomFull ? 'bottom-full-open' : ''
                        }`}
                        style={{ bottom: 'auto' }}
                        // draggable="true"
                        onDragStart={initial}
                        onDrag={resize}
                        onDragEnd={(e) => {
                            let diff = e.clientY - initialPos
                            handleChartHeight(parseInt(diff))
                        }}
                    >
                        <div
                            className='bottom-panel-toggle'
                            style={{ cursor: 'n-resize' }}
                        >
                            <div className='stock-screen'>
                                <span>
                                    {screenerName} contains{' '}
                                    {stocksInScreen.length} stocks per screen
                                </span>
                            </div>
                            <i
                                className='fa-solid fa-angle-up max-sm:hidden'
                                onClick={() => {
                                    handleBottomPanel(!isOpenBottomPanel)
                                    handleBottomHalf(false)
                                    handleBottomFull(false)
                                }}
                            ></i>

                            <div className='cta-bp max-sm:hidden'>
                                <a
                                    onClick={() => {
                                        setPlay(!play)
                                    }}
                                >
                                    {!play ? (
                                        <PlayCircleOutlined />
                                    ) : (
                                        <PauseCircleOutlined />
                                    )}
                                </a>

                                <Dropdown overlay={menu} placement='topRight'>
                                    <Button
                                        size='middle'
                                        icon={<CaretUpOutlined />}
                                    ></Button>
                                </Dropdown>

                                <a href='#'>
                                    <MinusSquareOutlined
                                        onClick={() => {
                                            manageSizeOFBottomPanel('half')
                                        }}
                                    />
                                </a>
                                <a href='#'>
                                    <ExpandOutlined
                                        onClick={() => {
                                            manageSizeOFBottomPanel('full')
                                        }}
                                    />
                                </a>
                                <MultilevelDropdown
                                    setChoice={setChoice}
                                    setIsModalVisible={setIsModalVisible}
                                    menuItems={treeData}
                                />
                                {/* <Tooltip title={selectionMenu}>
                  <SettingFilled
                    color="blue"
                    onClick={() => {
                      selectionMenu;
                    }}
                  />
                </Tooltip> */}

                                {selectedFilter &&
                                    Object.keys(selectedFilter).length > 0 &&
                                    !selectedFilter._id && (
                                        <a href='#'>
                                            <SaveOutlined
                                                onClick={async () =>
                                                    await handleSaveScreener(
                                                        selectedFilter
                                                    )
                                                }
                                            />
                                        </a>
                                    )}
                                <a href='#'>
                                    <CloseOutlined
                                        onClick={() => {
                                            handleBottomPanel(
                                                !isOpenBottomPanel
                                            )
                                            handleShowScreener(false)
                                            handleChartHeightOnViewScreener(
                                                false
                                            )
                                        }}
                                    />
                                </a>
                            </div>
                        </div>
                        <div className='max-sm:hidden'>
                            <SettingPanel
                                isModalVisible={isModalVisible}
                                setIsModalVisible={setIsModalVisible}
                                setDynamicColumn={setDynamicColumn}
                            />
                        </div>

                        <Screener
                            setChoice={setChoice}
                            exportData={choice}
                            play={play}
                            duration={duration}
                            selectedFilter={selectedFilter}
                            dynamicColumn={dynamicColumn}
                            setStocksInScreen={setStocksInScreen}
                            setKuzzleData={setKuzzleData}
                            kuzzleData={kuzzleData}
                            currentAction={currentAction}
                        />
                    </div>
                </SubscriptionGaurd>
            )}
        </div>
    )
}

export default memo(BottomPanel)
