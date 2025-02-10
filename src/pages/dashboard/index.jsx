import React from 'react'
import { Layout, Switch, Space, Image } from 'antd'
import { connect } from 'react-redux'
import { widget } from '../../charting_library'
import HistoryTable from './components/HistoryTable'
import BianatHeader from '../../components/BianatHeader'
import RightPanel from './components/RightPanel'
import BottomPanel from './components/BottomPanel'
import { updateStock, updateStockType } from '../../features/Stock/stockSlice'
import { updateTheme } from '../../features/Theme/themeSlice'
import BianatResources from './components/BianatResource'
import SubscriptionGaurd from '../../hoc/SubscriptionGaurd'
import ScreenerControls from './components/ScreenerController/ScreenerControls'
import { getIndicatorsData, getIndexHistoricalData } from '../../services/apis'
import LeftPanel from './components/LeftPanel'
import BianatTourGuide from '../../components/BianatTourGuide'
/**
 * @name TVChartContainer
 * @description TVChartContainer page
 * @purpose To display the TVChartContainer page
 *
 * @returns {JSX} JSX element containing the TVChartContainer page
 */

const { Content } = Layout

//Global state handling
const mapStateToProps = (state) => ({
    currentStock: state.currentStock.currentStock,
    currentLanguage: state.currentLanguage.currentLanguage,
    currentTheme: state.currentTheme.currentTheme,
    stockType: state.stockType.stockType,
    userId: state.auth.user?.username,
})

const mapDispatchToProps = { updateStock, updateTheme, updateStockType }
class TVChartContainer extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isMobile: window.innerWidth < 640,
            showLeftPanel: false,
            showRightPanel: false,
            selectedDate: new Date(),
            selectedLimit: 'daily',
            showHistoryTable: false,
            showBottomPanel: true,
            showBottomHalf: false,
            showBottomFull: false,
            currentStock: this.props.currentStock,
            currentTheme: this.props.currentTheme,
            currentLanguage: this.props.currentLanguage,
            isZoomIn: true,
            showScreener: false,
            currentInterval: 'D',
            selectedFilter: {},
            chartHeight: window.innerHeight - 230,
            userId: this.props.userId,
            load_last_chart: true,
            currentAction: '',
            currentTrader: '',
            kuzzleData: [],
            stockType: this.props.stockType,
            currentExchange:
                this.props.stockType === 'Stock' ? 'TASI' : 'Mutual Funds',
            isOpen: false,
        }
    }

    static defaultProps = {
        symbol: '1050',
        interval: 'D',
        containerId: 'tv_chart_container',
        datafeedUrl: process.env.REACT_APP_BASE_URL,
        libraryPath: '/charting_library/',
        chartsStorageUrl: process.env.REACT_APP_BASE_URL,
        chartsStorageApiVersion: '1.1',
        clientId: 'tradingview.com',
        userId: 'public_user_id',
        fullscreen: false,
        autosize: true,
        theme: 'Dark',
        timezone: 'Asia/Riyadh',
    }
    tvWidget = null
    indicatorData = null
    componentDidUpdate() {
        if (this.props.currentStock) {
            if (this.props.stockType != 'Stock') {
                this.setState({ showRightPanel: false })
            }
            this.setState({ currentStock: this.props.currentStock })
        }
        document.body.style.backgroundColor =
            this.props.currentTheme === 'Dark' ? '#12161F' : '#FFFFFF'
        if (this.state.currentLanguage !== this.props.currentLanguage) {
            this.setState({ currentLanguage: this.props.currentLanguage })
            this.chartReady(this.props.currentLanguage)
        }

        if (this.tvWidget._ready) {
            this.tvWidget.changeTheme(this.props.currentTheme)
        }
        setTimeout(() => {
            if (this.props.currentTheme) {
                if (this.tvWidget._ready) {
                    this.tvWidget.changeTheme(this.props.currentTheme)
                }
            }
        }, 5000)

        if (
            this.state.currentStock !== this.props.currentStock &&
            this.props.currentStock
        ) {
            if (this.tvWidget !== null && this.tvWidget != undefined) {
                if (this.state.stockType === 'Mutual Fund') {
                    this.tvWidget.activeChart().setChartType(2)
                } else {
                    this.tvWidget.activeChart().setChartType(0)
                }

                this.tvWidget
                    .activeChart()
                    .setSymbol(this.props.currentStock?.toString())
            }

            if (this.tvWidget !== null && this.tvWidget != undefined) {
                this.tvWidget.activeChart().setZoomEnabled(this.state.isZoomIn)
            }
        }
    }
    componentDidMount() {
        const location = window.location.search
        if (location.includes('action')) {
            const action = location.split('=')
            this.setState({ currentAction: action[1] })
            this.handleShowScreener(true)
        }

        if (window.Tawk_API) {
            window.Tawk_API.hideWidget()
        }

        this.chartReady(undefined)
        document.body.style.backgroundColor =
            this.props.currentTheme === 'Dark' ? '#12161F' : '#FFFFFF'
        setTimeout(() => {
            if (this.props.currentTheme) {
                if (this.tvWidget._ready) {
                    this.tvWidget.changeTheme(this.props.currentTheme)
                }
            }
        }, 7000)
    }

    chartReady = (lang) => {
        const widgetOptions = {
            symbol:
                this.props && this.state.currentStock
                    ? this.state.currentStock
                    : this.props.currentStock,

            datafeed: new window.Datafeeds.UDFCompatibleDatafeed(
                `${this.props.datafeedUrl}/api/chart/${
                    this.props.currentLanguage
                        ? this.props.currentLanguage
                        : lang
                }`
            ),

            interval: this.props.interval,
            container: this.props.containerId,
            library_path: this.props.libraryPath,

            locale:
                lang != undefined
                    ? lang
                    : this.props && this.state.currentLanguage
                      ? this.state.currentLanguage
                      : this.props.currentLanguage,
            charts_storage_url: `${this.props.chartsStorageUrl}api/chart/${
                // /api
                this.props.currentLanguage ? this.props.currentLanguage : lang
            }`,
            charts_storage_api_version: this.props.chartsStorageApiVersion,
            client_id: this.props.clientId,
            user_id: this.state.userId || this.props.userId,
            fullscreen: this.props.fullscreen,
            autosize: this.props.autosize,
            theme: this.props.currentTheme,
            load_last_chart: true,
            studies_overrides: this.props.studiesOverrides,
            enabled_features: ['study_templates'],
            disabled_features: this.state.isMobile
                ? [
                      'use_localstorage_for_settings',
                      'left_toolbar',
                      'header_widget',
                      'timeframes_toolbar',
                      'edit_buttons_in_legend',
                      'context_menus',
                      'control_bar',
                      'border_around_the_chart',
                  ]
                : ['control_bar'],

            custom_indicators_getter: async function (PineJS) {
                let indData = await getIndexHistoricalData('TASI')
                return Promise.resolve([
                    {
                        name: 'Custom Styles For Every Point',
                        metainfo: {
                            _metainfoVersion: 51,
                            id: 'CustomStylesForEveryPoint@tv-basicstudies-1',
                            description: 'Custom Styles For Every Point',
                            shortDescription: 'Custom Styles For Every Point',
                            is_price_study: false,
                            isCustomIndicator: true,
                            plots: [
                                {
                                    id: 'plot_0',
                                    type: 'line',
                                },
                                {
                                    id: 'plot_1',
                                    type: 'colorer',
                                    target: 'plot_0',
                                    palette: 'paletteId1',
                                },
                            ],
                            palettes: {
                                paletteId1: {
                                    colors: {
                                        0: {
                                            name: 'First color',
                                        },
                                        1: {
                                            name: 'Second color',
                                        },
                                    },
                                },
                            },
                            defaults: {
                                palettes: {
                                    paletteId1: {
                                        colors: {
                                            0: {
                                                color: 'red',
                                                width: 1,
                                                style: 0,
                                            },
                                            1: {
                                                color: 'blue',
                                                width: 3,
                                                style: 1,
                                            },
                                        },
                                    },
                                },
                                styles: {},
                                precision: 4,
                                inputs: {},
                            },
                            styles: {
                                plot_0: {
                                    title: 'Equity value',
                                    histogramBase: 0,
                                },
                            },
                            inputs: [],
                            format: {
                                type: 'price',
                                precision: 4,
                            },
                        },
                        constructor: function () {
                            this.main = function (context, inputCallback) {
                                this._context = context
                                this._input = inputCallback

                                const value = Math.random() * 200
                                const colorIndex = value > 100 ? 0 : 1

                                return [value, colorIndex]
                            }
                        },
                    },
                    {
                        name: 'Bianat Relative Strength Indicator',
                        metainfo: {
                            _metainfoVersion: 51,
                            id: 'RSIIndicator@tv-basicstudies-1',
                            description: 'Bianat Relative Strength Indicator',
                            shortDescription: 'BRSI',
                            is_price_study: false,
                            isCustomIndicator: true,
                            plots: [
                                {
                                    id: 'plot_0',
                                    type: 'line',
                                },
                                {
                                    id: 'plot_1',
                                    type: 'line',
                                },
                                {
                                    id: 'plot_2',
                                    type: 'line',
                                    target: 'filledAreaId1',
                                    // palette: "paletteId1",
                                },
                            ],

                            // filledAreas: [
                            //   {
                            //     id: "filledAreaId1",
                            //     objAId: "plot_0",
                            //     objBId: "plot_1",
                            //     title: "Filled area between first and second plot",
                            //     type: "plot_plot",
                            //     palette: "paletteId1",
                            //   },
                            // ],

                            // palettes: {
                            //   paletteId1: {
                            //     valToIndex: {
                            //       0: 0,
                            //       1: 1,
                            //     },
                            //     colors: {
                            //       0: {
                            //         name: "First color",
                            //       },
                            //       1: {
                            //         name: "Second color",
                            //       },
                            //     },
                            //   },
                            // },
                            defaults: {
                                filledAreasStyle: {
                                    filledAreaId1: {
                                        color: 'yellow',
                                        visible: true,
                                        transparency: 40,
                                    },
                                },

                                palettes: {
                                    paletteId1: {
                                        colors: {
                                            0: {
                                                color: 'green',
                                                width: 1,
                                                style: 0,
                                            },
                                            1: {
                                                color: 'blue',
                                                width: 3,
                                                style: 1,
                                            },
                                        },
                                    },
                                },

                                styles: {
                                    plot_0: {
                                        linestyle: 1,
                                        visible: false,
                                        linewidth: 1,
                                        plottype: 2,
                                        trackPrice: true,
                                        color: 'blue',
                                    },
                                    // plot_1: {
                                    //   linestyle: 1,
                                    //   visible: true,
                                    //   linewidth: 2,
                                    //   plottype: 2,
                                    //   trackPrice: true,
                                    //   color: "red",
                                    // },
                                    plot_2: {
                                        linestyle: 1,
                                        visible: false,
                                        linewidth: 2,
                                        plottype: 2,
                                        trackPrice: true,
                                        color: 'yellow',
                                    },
                                },
                                precision: 4,
                                inputs: {
                                    integer: 14,
                                },
                                overlay: true,
                            },
                            styles: {
                                plot_0: {
                                    title: 'First plot',
                                    histogramBase: 0,
                                },
                                // plot_1: {
                                //   title: "Second plot",
                                //   histogramBase: 0,
                                // },
                            },
                            inputs: [
                                {
                                    id: 'integer',
                                    name: 'integer',
                                    type: 'integer',
                                    defval: 14,
                                    min: 14,
                                    step: 1,
                                },
                            ],
                            format: {
                                type: 'price',
                                precision: 4,
                            },
                        },

                        constructor: function () {
                            let wholeData = indData
                            console.log('whole-data', wholeData)
                            // this.init = async function (context, inputCallback) {
                            //   const result = await getIndicatorsData(
                            //     context?.symbol?.ticker,
                            //     context?.symbol.info?.exchange
                            //   );
                            //   data = result[context.symbol.ticker];
                            //   wholeData = data;
                            // };

                            this.main = function (context, inputCallback) {
                                const indexData =
                                    wholeData[
                                        context.symbol.info.exchange
                                            ? context.symbol.info.exchange
                                            : 'TASI'
                                    ]
                                if (isNaN(context.symbol.time)) {
                                    return [0, 0, 0]
                                }
                                return [
                                    0,
                                    (context.symbol.close /
                                        (indexData[
                                            new Date(context.symbol.time)
                                                ?.toISOString()
                                                ?.split('T')[0]
                                        ] || 1)) *
                                        100,
                                    0,
                                ]
                            }
                        },
                    },
                ])
            },
        }

        const haveSameDate = (timestamp1, timestamp2) => {
            const date1 = new Date(timestamp1)
            const date2 = new Date(timestamp2)
            return (
                date1.getUTCFullYear() === date2.getUTCFullYear() &&
                date1.getUTCMonth() === date2.getUTCMonth() &&
                date1.getUTCDate() === date2.getUTCDate()
            )
        }
        const calculateRSI = (prices) => {
            var gains = []
            var losses = []
            var period = 14

            for (var i = 1; i < prices.length; i++) {
                var priceChange = prices[i] - prices[i - 1]
                if (priceChange > 0) {
                    gains.push(priceChange)
                    losses.push(0)
                } else {
                    gains.push(0)
                    losses.push(-priceChange)
                }
            }

            var avgGain = gains.slice(-14).reduce((a, b) => a + b, 0) / 14
            var avgLoss = losses.slice(-14).reduce((a, b) => a + b, 0) / 14
            if (avgLoss === 0) {
                var rsi = 100 // Set RSI to 100 for this case
            } else {
                var rs = avgGain / avgLoss
                var rsi = 100 - 100 / (1 + rs)
            }

            var colorIndex = rsi > 70 ? 0 : rsi < 30 ? 1 : 0

            return [0, rsi, colorIndex]
        }

        const tvWidget = new widget(widgetOptions)

        this.tvWidget = tvWidget

        tvWidget.onChartReady(() => {
            tvWidget.headerReady().then(() => {
                tvWidget
                    .activeChart()
                    .onSymbolChanged()
                    .subscribe(null, (data) => {
                        this.setState({ stockType: data.type })
                        this.setState({ currentExchange: data.exchange })
                        this.props.updateStockType(data.type)
                        this.props.updateStock(data.ticker)
                    })
                //set chart barStyle

                tvWidget.activeChart().setChartType(0)

                tvWidget.activeChart().setTimezone('Asia/Riyadh')
                tvWidget
                    .activeChart()
                    .onIntervalChanged()
                    .subscribe(null, (data) => {
                        this.handleCurrentInterval(data)
                    })
            })
        })
    }
    componentWillUnmount() {
        if (this.tvWidget !== null) {
            this.tvWidget.remove()
            this.tvWidget = null
        }
    }

    handleCurrentAction = (action) => {
        this.setState({ currentAction: action })
        this.handleShowScreener(true)
    }

    handleCurrentTrader = (action) => {
        this.setState({ currentTrader: action })
        this.handleShowScreener(true)
    }

    handleKuzzleData = (data) => {
        if (data) {
            this.setState({ kuzzleData: data })
        }
    }

    handleChartHeightOnViewScreener = (checked) => {
        let height = window.innerHeight / 2
        let interval = this.state.currentInterval
        if (checked) {
            height = window.innerHeight / 2
        } else if (!(interval.includes('D') || interval <= 5)) {
            this.setState({ showBottomFull: false })
            this.setState({ showBottomHalf: false })
            height = window.innerHeight / 2
        } else {
            this.setState({ showBottomFull: false })
            this.setState({ showBottomHalf: false })
            height = window.innerHeight - 230
        }
        this.setState({ chartHeight: height })
    }
    handleCurrentInterval = (interval) => {
        this.setState({
            currentInterval: interval,
        })
    }

    handleSwitch = (value) => {
        this.setState({
            isZoomIn: !value,
        })
    }
    handleLeftPanel = (value) => {
        this.setState({ showLeftPanel: value })
    }
    handleRightPanel = (value) => {
        this.setState({ showRightPanel: value })
    }

    handleDateChange = (date, dateString) => {
        this.setState({ selectedDate: date._d })
    }
    handleBottomHalf = (value) => {
        this.setState({ showBottomHalf: value })
    }
    handleBottomFull = (value) => {
        this.setState({ showBottomFull: value })
    }
    handleBottomPanel = (value) => {
        this.setState({ showBottomPanel: value })
    }

    handleLimitChange = (value) => {
        this.setState({ selectedLimit: value.target.value })
    }

    handleShowScreener = (value) => {
        if (value && this.state.showScreener === false) {
            this.setState({ chartHeight: window.innerHeight / 2 })
        }
        this.setState({ showScreener: value })
    }

    handleCurrentFilter = (value) => {
        this.setState({ selectedFilter: value })
    }

    handleChartHeight = (value) => {
        const { chartHeight } = this.state
        let height
        if (value < 0) {
            if (-1 * value > chartHeight) {
                chartHeight = chartHeight + 1
            } else {
                height = chartHeight + value
            }
        } else {
            height = this.state.chartHeight + value
        }
        this.setState({ chartHeight: height })
    }

    handleIsopen = (value) => {
        this.setState({ isOpen: value })
    }

    render() {
        return (
            <React.Fragment>
                <Layout>
                    <Content
                        style={{ marginTop: 0 }}
                        className={`${
                            this.props.currentTheme === 'Dark' && 'dark-skin'
                        }`}
                    >
                        <div className='dashboard-content'>
                            <div
                                className={`main-panel ${
                                    !this.state.showLeftPanel && 'is-left-full'
                                } ${
                                    !this.state.showRightPanel &&
                                    'is-right-full'
                                }
                  ${!this.state.showBottomPanel && 'is-bottom-full'}
                  ${this.state.showBottomHalf && 'is-bottomHalf-full'}
                  ${this.state.showBottomFull && 'is-bottomFull-full'}`}
                            >
                                {/* {!this.state.isMobile && (
                                    <> */}
                                <div className='max-sm:hidden'>
                                    <BianatResources
                                        handleIsopen={this.handleIsopen}
                                        resolution={this.state.currentInterval}
                                    />
                                </div>
                                {/* </>
                                )} */}
                                <div
                                    className={` sm:${
                                        this.state.showHistoryTable
                                            ? 'chartwrapper open-history'
                                            : 'chartwrapper close-history'
                                    }`}
                                >
                                    {/* {!this.state.isMobile && (
                                        <> */}
                                    <div className='fixed-btn max-sm:hidden'>
                                        <Space>
                                            <Switch
                                                onChange={this.handleSwitch}
                                            />
                                            <span>Fixed</span>
                                        </Space>
                                    </div>
                                    {/* </>
                                    )} */}
                                    <div
                                        className={`max-sm:hidden ${
                                            this.state.showHistoryTable
                                                ? 'showTable chart-detail-info'
                                                : 'notShowTable chart-detail-info'
                                        }`}
                                    >
                                        {/* {!this.state.isMobile && (
                                            <> */}
                                        <div className='max-sm:hidden'>
                                            <LeftPanel
                                                interval={
                                                    this.state.currentInterval
                                                }
                                                handleCurrentFilter={
                                                    this.handleCurrentFilter
                                                }
                                                handleShowScreener={
                                                    this.handleShowScreener
                                                }
                                                selectedFilter={
                                                    this.state.selectedFilter
                                                }
                                                handleCurrentAction={
                                                    this.handleCurrentAction
                                                }
                                                handleCurrentTrader={
                                                    this.handleCurrentTrader
                                                }
                                                showScreener={
                                                    this.state.showScreener
                                                }
                                                handleKuzzleData={
                                                    this.handleKuzzleData
                                                }
                                                handleChartHeightOnViewScreener={
                                                    this
                                                        .handleChartHeightOnViewScreener
                                                }
                                            />
                                        </div>
                                        {/* </>
                                        )} */}

                                        {/* <SubscriptionGaurd page="dashboard" id="leftTable"> */}

                                        {/* </SubscriptionGaurd> */}
                                    </div>

                                    <div
                                        className='trad-chart max-sm:fixed max-sm:top-0 max-sm:-left-[12.5rem] max-sm:w-screen max-sm:overflow-y-auto
                                        '
                                    >
                                        <div
                                            className={`main-chart-wrap ${
                                                this.state.isMobile && ' w-full'
                                            }`}
                                        >
                                            {/* <div
                        className={`watermark ${
                          this.state.showBottomHalf && "watermarHalf"
                        } ${this.state.showBottomFull && "watermarkFull"}`}
                      >
                        <Image src={waterMark} preview={false} width={160} />
                      </div> */}

                                            {/* ////////////////////////////////////////////// */}
                                            <div
                                                style={{
                                                    height: this.state.isMobile
                                                        ? ''
                                                        : !this.state
                                                                .showBottomHalf &&
                                                            !this.state
                                                                .showBottomFull
                                                          ? this.state
                                                                .chartHeight
                                                          : '',
                                                }}
                                                id={this.props.containerId}
                                                className={`TVChartContainer ${
                                                    this.state.isMobile
                                                        ? ''
                                                        : ''
                                                } `}
                                            />
                                        </div>
                                        {/* ////////////////////////////////////////// */}
                                        {/* {!this.state.isMobile && (
                                            <> */}
                                        <BottomPanel
                                            currentInterval={
                                                this.state.currentInterval
                                            }
                                            handleChartHeight={
                                                this.handleChartHeight
                                            }
                                            handleShowScreener={
                                                this.handleShowScreener
                                            }
                                            selectedFilter={
                                                this.state.selectedFilter
                                            }
                                            showScreener={
                                                this.state.showScreener
                                            }
                                            handleBottomPanel={
                                                this.handleBottomPanel
                                            }
                                            isOpenBottomPanel={
                                                this.state.showBottomPanel
                                            }
                                            handleBottomFull={
                                                this.handleBottomFull
                                            }
                                            handleBottomHalf={
                                                this.handleBottomHalf
                                            }
                                            showBottomHalf={
                                                this.state.showBottomHalf
                                            }
                                            showBottomFull={
                                                this.state.showBottomFull
                                            }
                                            handleCurrentFilter={
                                                this.handleCurrentFilter
                                            }
                                            currentAction={
                                                this.state.currentAction
                                            }
                                            ActionsData={this.state.kuzzleData}
                                            currentTrader={
                                                this.state.currentTrader
                                            }
                                            handleChartHeightOnViewScreener={
                                                this
                                                    .handleChartHeightOnViewScreener
                                            }
                                        />
                                        {/* </>
                                        )} */}
                                    </div>
                                </div>
                            </div>

                            {this.state.stockType &&
                                this.state.stockType === 'Stock' && (
                                    <RightPanel
                                        showRightPanel={
                                            this.state.showRightPanel
                                        }
                                        handleRightPanel={this.handleRightPanel}
                                        handleShowScreener={
                                            this.handleShowScreener
                                        }
                                    />
                                )}
                        </div>
                        {!this.state.isMobile && (
                            <>
                                <BianatTourGuide
                                    steps={[
                                        {
                                            selector: '.chart-detail-info',
                                            content:
                                                'This is the chart detail info section',
                                        },
                                        {
                                            selector: '.main-chart-wrap',
                                            content:
                                                'This is the main chart wrap section',
                                        },
                                        {
                                            selector: '.trad-chart',
                                            content:
                                                'This is the trade chart section',
                                        },
                                        {
                                            selector: '.main-panel',
                                            content:
                                                'This is the main panel section',
                                        },
                                    ]}
                                    isOpen={this.state.isOpen}
                                    setIsGuideOpen={this.handleIsopen}
                                />
                            </>
                        )}
                    </Content>
                </Layout>
            </React.Fragment>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TVChartContainer)
