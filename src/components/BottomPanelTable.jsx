import React, { useEffect } from 'react'
import { Table } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { updateStock } from '../features/Stock/stockSlice'

/**
 * @name BottomPanelTable
 * @description: This component is used to display the bottom panel table.
 * @purpose: To display the bottom panel table.
 * @param {Object} data - Data to be rendered in the table.
 * @param {Object} columns - Columns to be rendered in the table.
 * @param {Number} currentIndex - Current index of the table.
 * @param {String} code - Current stock code.
 * @returns {Object} JSX object.
 */

const BottomPanelTable = ({ data, columns, code = '', currentIndex }) => {
    const dispatch = useDispatch()
    const currentStock = useSelector((state) => state.currentStock.currentStock)
    const { t, i18n } = useTranslation()

    const rowKey = 'code'
    const currentPage = () => {
        if (currentIndex % 20 === 0) {
            return currentIndex / 20
        }
        return Math.floor(currentIndex / 20) + 1
    }
    const currentp = currentPage()

    useEffect(() => {
        document.getElementById('table-panel').dir = i18n.dir()
    }, [])

    return (
        <div id='table-panel'>
            <Table
                // pagination={{ pageSize: 100, current: currentp ? currentp : 1 }}
                className={`${
                    i18n.language === 'en' ? 'font-loader-en' : 'font-loader'
                }`}
                pagination={false}
                rowClassName={(record, index) => {
                    if (record.code === code || record.code === currentStock) {
                        return 'table-row-dark'
                    } else {
                        return 'table-row-light'
                    }
                }}
                onRow={(record) => {
                    return {
                        onClick: () => {
                            dispatch(updateStock(record.code))
                        },
                    }
                }}
                scroll={{ y: 'calc(100vh - 309px)', x: 'max-content' }}
                selectedRowKeys={[code]}
                rowKey={rowKey}
                dataSource={data}
                columns={columns}
                size='small'
            />
        </div>
    )
}

export default BottomPanelTable
