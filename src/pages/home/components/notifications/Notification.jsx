import React,{useState,useEffect,useContext,useRef} from 'react'
import { Card, Button, Row, Col, Divider,message } from 'antd'
import { EditOutlined, FileAddOutlined, NotificationOutlined, PlusOutlined, PlusSquareOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { KuzzleContext } from '../../../../App';
import AddNotification from './components/AddNotification';
import ShowNotification from './components/ShowNotification';
import NotificationSound from './audio/notification-sound.mp3'


const Notification = () => {
    const {kuzzleHttp:kuzzle} = useContext(KuzzleContext);
    const { kuzzleSocket: kuzzleSocket } = useContext(KuzzleContext)
    const [notifications,setNotifications] = useState([]);
    const [currentAnnouncement,setCurrentAnnouncement] = useState(undefined);
    const [showNotificationModal,setShowNotificationModal] = useState(false);
    const [error,setError] = useState(null);
    const [type,setType] = useState('Add');
    const auth = useSelector(state => state.auth);
    const { t, i18n } = useTranslation();
    const audioPlayer = useRef(null)

    const playAudio = () => {
        audioPlayer.current.play()
    }

    const getNotifications = async () => {
        try {
            const response = await kuzzle.document.search(
                'bianat',
                'announcements',
                {
                    sort: {
                        '_kuzzle_info.createdAt': 'desc',
                    },
                }
            )
            setNotifications(response.hits);
        } catch (error) {
            setError(error);
        }
    }

    useEffect(() => {
        getNotifications();
    },[]);

    const subscribeToNotifications = async () => {
        try {
            await kuzzleSocket.realtime.subscribe(
                'bianat',
                'announcements',
                {},
                (notification) => {
                    if (notification.action === 'delete') {
                        const updatedNotifications = notifications.filter(
                            (existingNotification) =>
                                existingNotification._id !==
                                notification.result._id
                        )
                        setNotifications(updatedNotifications)
                        return
                    }

                    playAudio()
                    const index = notifications.findIndex(
                        (existingNotification) =>
                            existingNotification._id === notification.result._id
                    )

                    if (index !== -1) {
                        const updatedNotifications = [...notifications]
                        updatedNotifications[index] = notification.result
                        setNotifications(updatedNotifications)
                    } else {
                        setNotifications((prev) => [
                            notification.result,
                            ...prev,
                        ])
                    }
                }
            )
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteAnnouncement = async (id) => {
        try {
            const response = await kuzzle.document.delete('bianat','announcements',id);
            if(response){
                getNotifications();
                message.success('Notification deleted successfully');
            }
        } catch (error) {
            console.log(error)
        }


    }

    const handleEditAnnouncement = async (data) => {
        setType('Edit');
        setCurrentAnnouncement(data);
        setShowNotificationModal(true);
    }

    const handleAddAnnouncement = () => {
        setType('Add')
        setShowNotificationModal(true)
    }

    useEffect(() => {
        subscribeToNotifications();
    },[]);


    return (
        <>
            <Card
                className="info-card announcement"
                title={
                    <span>
                        {/* <NotificationOutlined  className='me-2 text-warning'/> */}
                        {t('Announcements')}
                    </span>
                }
                extra={
                    auth &&
                    auth.user?.roles.includes('admin') && (
                        <Button
                            className="edit-btn"
                            icon={<PlusOutlined />}
                            onClick={handleAddAnnouncement}
                        />
                    )
                }
            >
                {notifications.map((notification, index) => (
                    <ShowNotification
                        key={index}
                        announcement={notification}
                        deleteAnnouncement={handleDeleteAnnouncement}
                        editAnnouncement={handleEditAnnouncement}
                    />
                ))}
                <audio ref={audioPlayer} src={NotificationSound} />
            </Card>
            <AddNotification
                showNotificationModal={showNotificationModal}
                setShowNotificationModal={setShowNotificationModal}
                currentAnnouncement={currentAnnouncement}
                type={type}
            />
        </>
    )
}
 
export default Notification;