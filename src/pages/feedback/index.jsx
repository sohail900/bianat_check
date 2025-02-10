import React,{useContext, useEffect,useState} from 'react'
import { KuzzleContext } from '../../App'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import ViewFeedBack from './components/ViewFeedBack'
import { Layout } from 'antd'
import esb from 'elastic-builder'

const FeedBacks = () => {
    const { kuzzleHttp: kuzzle } = useContext(KuzzleContext);
    const {currentTheme} = useSelector((state) => state.currentTheme);
    const [feedbacks, setFeedbacks] = useState([]);

    const getAllFeedbacks = async () => {
        try {
          const response = await kuzzle.document.search(
              'bianat',
              'feedback',
              esb
                  .requestBodySearch()
                  .query(esb.matchAllQuery())
                  .sort(esb.sort('_kuzzle_info.createdAt', 'desc')),
              { size: 1000 }
          )
            setFeedbacks(response?.hits);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getAllFeedbacks();
    }
    ,[])

    return (
        <Layout className={`${currentTheme === 'Dark' && 'dark-skin'} `}>
            {feedbacks.length > 0 ? (
                <>
                    <span className=' font-bold px-14 py-5 text-lg'>Feedbacks</span>
                    <ViewFeedBack feedbacks={feedbacks} />
                </>
            ) : (
                <h1>No Feedbacks</h1>
            )}
        </Layout>
    )
}
 
export default FeedBacks;