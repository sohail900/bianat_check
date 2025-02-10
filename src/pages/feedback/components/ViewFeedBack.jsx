import React,{useEffect, useState,useContext} from 'react'
import { Row, Col, Card,Pagination,Checkbox } from 'antd'
import { KuzzleContext } from '../../../App'


const ViewFeedBack = ({ feedbacks }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [feedbackPerPage, setFeedbackPerPage] = useState(5);
    const [feedbacksToShow, setFeedbacksToShow] = useState([]);
    const { kuzzleHttp: kuzzle } = useContext(KuzzleContext);

    useEffect(() => {
        const indexOfLastFeedback = currentPage * feedbackPerPage;
        const indexOfFirstFeedback = indexOfLastFeedback - feedbackPerPage;
        const currentFeedbacks = feedbacks?.slice(indexOfFirstFeedback, indexOfLastFeedback);
        setFeedbacksToShow(currentFeedbacks);
    }, [currentPage, feedbackPerPage])

    const handleMarkAsResolved = async (id,value) => {
    
        try{
            const response = await kuzzle.document.update('bianat', 'feedback', id, {
                resolved: value
            });

            if(response){
                console.log('resolved');
            }

        }catch(err){
            console.log(err);
        }

    }


    return (
        <>
            {feedbacksToShow?.map((feedback, index) => (
                <Row key={index} className=' ml-12 mr-12'>
                    <Col span={24}>
                        <Card className="feedback-card">
                            <div>
                                <span>Rating : </span>
                                <span>{feedback?._source?.rating}</span>
                            </div>
                            <div>
                                <span>Feedback : </span>
                                <span>{feedback?._source?.feedbackText}</span>
                            </div>
                            <div>
                                <span>Reason : </span>
                                <span>{feedback?._source?.reason}</span>
                            </div>
                            <div>
                                <span>Email : </span>
                                <span>{feedback?._source?.email}</span>
                            </div>
                            <div>
                                <span>Resolved : </span>
                                <span>
                                    {feedback?._source?.resolved ? 'Yes' : 'No'}
                                </span>
                            </div>
                            <div>
                                <span>Date : </span>
                                <span>
                                    {new Date(
                                              feedback?._source?._kuzzle_info?.createdAt
                                          ).toLocaleDateString()
                                    }
                                </span>
                            </div>
                            <div>
                                <span>Mark as resolved : </span>
                                <Checkbox
                                    onChange={(e) =>
                                        handleMarkAsResolved(
                                            feedback?._id,
                                            e.target.checked
                                        )
                                    }
                                />
                            </div>
                        </Card>
                    </Col>
                </Row>
            ))}
            <Pagination
            className='mr-12 ml-12'
                defaultCurrent={1}
                total={50}
                onChange={(page) => setCurrentPage(page)}
            />
        </>
    )
}
 
export default ViewFeedBack;