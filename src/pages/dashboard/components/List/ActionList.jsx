import React from 'react'
import { useTranslation } from 'react-i18next'
import { List } from 'antd';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { updateScreener,updateScreenerName} from '../../../../features/Screener/screenerSlice';
import { updateRankIndustryStock } from '../../../../features/RankIndustryStock/rankIndustryStockSlice';
import actionListData from "../../../../assets/actionlistData.json";

const ActionList = ({setListAction}) => {
    const { t,i18n} = useTranslation();
    const currentTheme = useSelector((state) => state.currentTheme.currentTheme);
    const dispatch = useDispatch();
    const actionName= (action) => {

        return i18n.language==='en'?action.nameen:action.namear;
    }

    const updateListAction =(action)=>{
        let actName = `${action.key}-all`
        setListAction(actName)
        dispatch(updateScreener(actName))
        dispatch(updateScreenerName(actionName(action)))
    }

    return ( 
        <div  className={`action-list ${
            i18n.language === "en" ? "font-loader-en" : "font-loader"
          } ${currentTheme === "Dark" && "dark-skin"}`}>
            <h3>{t("Bianat List")}</h3>
            <div className='list'>
                <List 
                dataSource={actionListData.data}
             
                renderItem={item => (<List.Item onClick={()=>{ updateListAction(item) }}>{actionName(item)}</List.Item>)}
                />
            </div>
        </div>
     );
}
 
export default ActionList;