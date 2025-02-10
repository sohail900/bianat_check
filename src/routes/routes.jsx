import React, { useEffect, useState, lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { Spin } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import PrivateRoute from './PrivateRoute'
import IsLoggedIn from './IsLogedIn'
import getCurrentLanguage from '../utils/CurrentLanguage'
import { fetchFilterSettings } from '../features/FilterSettings/filterSettings'
import { getMyUserData } from '../features/Auth/authSlice' // Keep this import
import { useTranslation } from 'react-i18next'

const TVChartContainer = lazy(() => import('../pages/dashboard/index'))
const Home = lazy(() => import('../pages/home/Home'))
const Stocks = lazy(() => import('../pages/screener/Screener'))
const Landing = lazy(() => import('../pages/landing/page'))
const FeedBacks = lazy(() => import('../pages/feedback/index'))
const Privacy = lazy(() => import('../pages/privacy/Privacy'))
const Settings = lazy(() => import('../pages/settings/Settings'))
const AcceptablePolicy = lazy(
    () => import('../pages/acceptablePolicy/AcceptablePolicy')
)
const RefundPolicy = lazy(() => import('../pages/refundPolicy/RefundPolicy'))
const Questions = lazy(() => import('./../pages/questions/Question'))
const MarketSnap = lazy(() => import('../pages/marketSnapShot/MarketSnap'))
const AboutUs = lazy(() => import('../pages/aboutus/index'))
const UploadData = lazy(() => import('../pages/uploadData/index'))
const Thanks = lazy(() => import('../pages/thanks/ThankYou'))
const SessionExpired = lazy(
    () => import('../pages/SessionExpired/SessionExpired')
)
const ResetPassword = lazy(() => import('../pages/ResetPassword/ResetPassword'))
const SignIn = lazy(() => import('../pages/sign-in/page'))
const SignUp = lazy(() => import('../pages/sign-up/page'))
const ForgetPassword = lazy(() => import('../pages/forget-password/page'))
const NoMatch = lazy(() => import('../pages/no-match/page'))
const Subscription = lazy(
    () => import('../pages/Subscription-old/Subscription')
)
const TreeMap = lazy(() => import('../pages/heatMap/Treemap'))
const SaudiFundingDayYear = lazy(
    () => import('../pages/saudi-founding-day-year-package-offer/index')
)
const ChatBot = lazy(() => import('../pages/ChatBot/ChatBot'))
const FollowUp = lazy(() => import('../pages/followUp/followUp'))
const OpenPostions = lazy(() => import('../pages/openPositions/openPositions'))
const AddPotentialLongs = lazy(
    () => import('../pages/addPotentialLongs/addPotentialLongs')
)
const AddOpenPosition = lazy(
    () => import('../pages/addOpenPosition/AddOpenPosition')
)
const UpdateOpenPosition = lazy(
    () => import('../pages/addOpenPosition/UpdateOpenPosition')
)
import { signIn as SignInRedux } from '../features/Auth/authSlice'
import { dbChatBot } from '../utils/firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import TempProfileUpdate from '../pages/tempProfileUpdate/TempProfileUpdate'
import RiskCalculator from '../pages/RiskCalculator/RiskCalculator'

const RouteConfig = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const auth = useSelector((state) => state.auth)
    const [loading, setLoading] = useState(false)
    const currentLanguage = getCurrentLanguage()
    const { t } = useTranslation()

    // useEffect(() => {
    //   const dispatchAsyncThunkOnLoad = async () => {
    //     await dispatch(fetchFilterSettings()).unwrap();
    //     if (isAuth) {
    //       await dispatch(getMyUserData()).unwrap();
    //     }
    //     setLoading(true);
    //   };

    //   dispatchAsyncThunkOnLoad();
    // }, [dispatch, isAuth]);
    const updateUserData = async () => {
        const userId =
            auth?.user?.id ||
            (localStorage.getItem('newSub') ??
                JSON.parse(localStorage.getItem('newSub'))?.username) ||
            null
        if (!userId) return
        try {
            const docRef = doc(dbChatBot, 'users', userId)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                const data = docSnap.data()
                const rData = {
                    user: data,
                    access_token: auth?.access_token,
                }
                dispatch(SignInRedux(rData))
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        async function update() {
            await updateUserData()
            setLoading(true)
        }
        update()
    }, [])

    useEffect(() => {
        document.body.dir = currentLanguage.dir || 'ltr'
        document.title = `${t('BIANAT')}`
    }, [t])

    if (!loading) {
        return (
            <Spin
                size='large'
                style={{
                    justifyContent: 'center',
                    marginTop: '25%',
                    display: 'flex',
                }}
            />
        )
    }

    return (
        <Suspense
            fallback={
                <Spin
                    size='large'
                    style={{
                        justifyContent: 'center',
                        marginTop: '25%',
                        display: 'flex',
                    }}
                />
            }
        >
            <Routes>
                <Route
                    path='/update-profile-t'
                    element={<TempProfileUpdate />}
                />
                {/* <Route path="/risk-calculator" element={<RiskCalculator/>}/> */}
                <Route
                    path='/forget-password'
                    element={<IsLoggedIn Component={ForgetPassword} />}
                />
                <Route
                    path='/sign-up'
                    element={<IsLoggedIn Component={SignUp} />}
                />
                <Route
                    path='/sign-in'
                    element={<IsLoggedIn Component={SignIn} />}
                />
                <Route path='/' element={<IsLoggedIn Component={Landing} />} />
                <Route path='/aboutus' element={<AboutUs />} />
                <Route
                    path='/saudi-founding-day-year-package-offer'
                    element={<SaudiFundingDayYear />}
                />
                <Route
                    path='/dashboard'
                    element={<PrivateRoute Component={Home} />}
                />
                <Route
                    path='/console'
                    element={<PrivateRoute Component={TVChartContainer} />}
                />
                <Route
                    path='/screener'
                    element={<PrivateRoute Component={Stocks} />}
                />
                <Route
                    path='/settings'
                    element={<PrivateRoute Component={Settings} />}
                />
                <Route path='/privacy' element={<Privacy />} />
                <Route path='/acceptable' element={<AcceptablePolicy />} />
                <Route path='/refund' element={<RefundPolicy />} />
                <Route path='/questions' element={<Questions />} />
                <Route path='/chat-bot' element={<ChatBot />} />
                <Route
                    path='/marketPulse'
                    element={<PrivateRoute Component={MarketSnap} />}
                />
                <Route
                    path='/followUp'
                    element={<PrivateRoute Component={FollowUp} />}
                />
                <Route
                    path='openPostions'
                    element={<PrivateRoute Component={OpenPostions} />}
                />
                <Route path='/session/expired' element={<SessionExpired />} />
                {auth && auth?.user?.roles.includes('admin') && (
                    <>
                        <Route path='/upload-data' element={<UploadData />} />
                        <Route
                            path='/add-potential-long'
                            element={<AddPotentialLongs />}
                        />
                        <Route
                            path='/add-open-positions'
                            element={<AddOpenPosition />}
                        />
                        <Route
                            path='/update-open-position/:id'
                            element={<UpdateOpenPosition />}
                        />
                    </>
                )}
                <Route path='/thanks' element={<Thanks />} />
                <Route path='/feedbacks' element={<FeedBacks />} />
                <Route
                    path='/reset-password/:token'
                    element={<ResetPassword />}
                />
                <Route
                    path='/treemap'
                    element={<PrivateRoute Component={TreeMap} />}
                />
                <Route path='*' element={<NoMatch />} />
            </Routes>
        </Suspense>
    )
}

export default React.memo(RouteConfig)
