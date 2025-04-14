import React from 'react';
import {
    SearchOutlined,
    SyncOutlined,
    SmileOutlined
} from '@ant-design/icons';
import { Row, Col } from "antd";

const ThreeSteps = () => {
    const steps = [
        { icon: <SearchOutlined />, title: 'Browse Properties', description: 'Explore our curated selection of high-potential investment properties' },
        { icon: <SyncOutlined />, title: 'Analyze Investment Potential', description: 'Use our advanced tools to evaluate ROI and market trends' },
        { icon: <SmileOutlined />, title: 'Connect with Agents', description: 'Get expert guidance from our verified real estate professionals' }
    ];
    return (
        <div className="stepsSection">
            <div>
                <h2 className="title">Three Steps to Smart Investments</h2>
                <div className="stepsGrid">
                    <Row gutter={16}>
                        {steps.map((step, index) => (
                            <Col xs={24} md={8}>
                                <div key={index} className="card">
                                    <div className="iconWrapper">
                                        {step.icon}
                                    </div>
                                    <div className="stepTitle">{step.title}</div>
                                    <div className="description">{step.description}</div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>
        </div>
    )
}

export default ThreeSteps