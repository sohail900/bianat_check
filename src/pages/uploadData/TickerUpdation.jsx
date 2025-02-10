import React from 'react'
import { Form,Input,Button,message } from 'antd';
import { deleteTicker } from '../../services/apis';
import { useTranslation } from 'react-i18next';

const TickerUpdation = () => {
    const { t } = useTranslation();

    const handleDeleteTicker = async (values) => {
        try {
            const response = await deleteTicker(values.ticker);
            console.log(response);
            if (response.status === 200) {
                message.success('Ticker deleted successfully')
            } else {
                message.error('Ticker deletion failed')
            }
        
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="delete-ticker-container">
            <h1>{t('Delete Ticker')}</h1>
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={{
                    maxWidth: 300,
                }}
                onFinish={handleDeleteTicker}
            >
                <Form.Item
                    label={t('Ticker')}
                    name="ticker"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Ticker!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        {t('Delete')}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
 
export default TickerUpdation;