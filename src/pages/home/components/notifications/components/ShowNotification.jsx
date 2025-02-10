import React, { useEffect } from 'react'
import * as moment from 'moment-timezone'
import { useSelector } from 'react-redux'
import { Row, Col, Divider, Button } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';



const ShowNotification = ({
    announcement,
    deleteAnnouncement,
    editAnnouncement,
}) => {
    const {i18n } = useTranslation()
    const currentLanguage = i18n.language
     const auth = useSelector((state) => state.auth)
    const getHourBefore = (date) => {
        const date1 = new Date(date)
        const date2 = new Date()
        const diffTime = Math.abs(date2 - date1)
        const diffHours = Math.ceil(diffTime / (1000*60*60))

        if(diffHours <= 24){
            return diffHours+' hours ago'
        }else{
            return Math.ceil(diffHours / 24)+' days ago'
        }
    }

    const getDayFromDate = (date) => {
        const day = moment(date).format('DD')
        return day
    }

    const getMonthFromDate = (date) => {
        const month = moment(date).format('MMM')
        return month
    }

    return (
        <>
            <Row>
                <Col span={4}>
                    <h1>
                        {getDayFromDate(announcement?._source['date'])}
                        <span>
                            {getMonthFromDate(announcement?._source['date'])}
                        </span>
                    </h1>
                </Col>
                <Col span={14}>
                    <div className="bl-1 pl-3">
                        <h5 style={{ color: '#FFA500' }}>
                            {announcement._source['title' + currentLanguage]}
                        </h5>
                        <p>
                            {
                                announcement._source[
                                    'announcement' + currentLanguage
                                ]
                            }
                            <br />
                            <a
                                href={announcement._source['link']}
                                target="_blank"
                            >
                                {announcement._source['link']}
                            </a>
                        </p>
                        <small className="text-muted notif-date-align">
                            {/* {moment
                                .tz(
                                    new Date(
                                        announcement?._source._kuzzle_info.createdAt
                                    ),
                                    'Asia/Riyadh'
                                )
                                .format('dd, MMM DD, YYYY, hh:mm A')}{' '} */}
                                {
                                    moment(new Date(announcement?._source._kuzzle_info.createdAt)).format('dd, MMM DD, YYYY, hh:mm A')
                                }
                        </small>
                    </div>
                </Col>
                <Col span={6} className="text-end">
                    {auth && auth.user?.roles.includes('admin') && (
                        <>
                            <Button
                                type="primary"
                                className="btn-block"
                                icon={<EditOutlined />}
                                onClick={() => {
                                    editAnnouncement(announcement)
                                }}
                            />
                            <Button
                                type="danger"
                                className="btn-block ms-2"
                                icon={
                                    <DeleteOutlined className="text-dangers" />
                                }
                                onClick={() =>
                                    deleteAnnouncement(announcement._id)
                                }
                            />
                        </>
                    )}
                </Col>
            </Row>
            <Divider
                style={{
                    borderTop: '1px solid rgb(191 191 191 / 19%)',
                    margin: '14px 0px',
                }}
            />
        </>
    )
}
 
export default ShowNotification;