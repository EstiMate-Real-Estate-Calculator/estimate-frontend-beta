import React from 'react';
import { Row, Col, Image, Button } from "antd";
import { RiCheckboxCircleFill } from "react-icons/ri";

const Analytics = () => {
    return (
        <div className='analyticsWrapper'>
            <div className='analyticsContent'>
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <div className='leftWrapper'>
                            <Image src="/images/analytics.png" alt="Not Found" preview={false} height={350} width={600} />
                        </div>
                    </Col>
                    <Col xs={24} md={12}>
                        <div className='analyticsText'>
                            <h2>Powerful Analytics at your Fingertips</h2>
                            <span><RiCheckboxCircleFill /> Mortgage Calculator</span>
                            <span><RiCheckboxCircleFill /> Mortgage Calculator</span>
                            <span><RiCheckboxCircleFill /> Mortgage Calculator</span>
                            <span><RiCheckboxCircleFill /> Mortgage Calculator</span>
                        </div>
                        <div className='buttonSection'>
                            <Button className="demo">
                                Try Demo
                            </Button>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Analytics;