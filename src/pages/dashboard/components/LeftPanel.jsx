import React,{useState,useEffect} from 'react'
import HistoryTable from './HistoryTable';
import ScreenerControls from "../components/ScreenerController/ScreenerControls";
import ActionList from './List/ActionList'
import TopTraders from './List/TopTraders';
import { Collapse } from 'antd'
import { useTranslation } from 'react-i18next';
const LeftPanel = ({interval, handleCurrentFilter,handleShowScreener,selectedFilter,handleCurrentAction,handleCurrentTrader,showScreener,handleKuzzleData, handleChartHeightOnViewScreener}) => {
      const [listAction, setListAction] = useState(undefined)
      const [trader, setTrader] = useState(undefined)
        const { t } = useTranslation()
    


        useEffect(() => {
            if (listAction) {
                handleCurrentAction(listAction)
            }
        }, [listAction])

        useEffect(() => {
            if (trader) {
                handleCurrentTrader(trader)
            }
        }, [trader])


    const item =[
        {
            key: '1',
            label: t('History'),
            children: <HistoryTable interval={interval} />,
        },
        {
            key: '2',
            label: t('Screeners'),
            children: <ScreenerControls
                handleCurrentFilter={handleCurrentFilter}
                handleShowScreener={handleShowScreener}
                selectedFilter={selectedFilter}
                handleCurrentAction={handleCurrentAction}
                handleCurrentTrader={handleCurrentTrader}
                showScreener={showScreener}
                handleKuzzleData={handleKuzzleData}
                handleChartHeightOnViewScreener={handleChartHeightOnViewScreener}
            />,
        },
        {
            key: '3',
            label: t('Actions'),
            children: <ActionList setListAction={setListAction} />,
        },
        {
            key: '4',
            label: t('Top Traders'),
            children: <TopTraders setTrader={setTrader} />,
        }
    ]    
    return (
        <>
            <Collapse defaultActiveKey={['1']} ghost className='left-panel-section'>
                {item.map((i) => (
                    <Collapse.Panel header={i.label} key={i.key}>
                        {i.children}
                    </Collapse.Panel>
                ))}
            </Collapse>
        </>
    )
}
 
export default LeftPanel;