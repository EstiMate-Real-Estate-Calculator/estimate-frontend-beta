import React from 'react';
import { Card, Row, Col } from 'antd';
import {
  CalculatorOutlined,
  PieChartOutlined,
  LineChartOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ToolOutlined,
} from '@ant-design/icons';

const features = [
  { icon: <CalculatorOutlined />, title: 'Advanced ROI Calculator', description: 'Calculate potential returns with our comprehensive ROI tools' },
  { icon: <PieChartOutlined />, title: 'Mortgage Analysis', description: 'Compare mortgage options and analyze payment structures' },
  { icon: <LineChartOutlined />, title: 'Market Trends', description: 'Stay updated with real-time market analysis and trends' },
  { icon: <TeamOutlined />, title: 'Expert Agent Network', description: 'Connect with verified real estate investment experts' },
  { icon: <CheckCircleOutlined />, title: 'Verified Listings', description: 'All properties are verified by our expert team' },
  { icon: <ToolOutlined />, title: 'Investment Tools', description: 'Access powerful tools to analyze and compare investments' }
];

const EstimatePage = () => {
  return (
    <>
      <div className='estimateWrapper'>
        <h2 className="title">Why EstiMate</h2>
        <div className="featuresGrid">
          <Row gutter={16}>
            {features.map((item, index) => (
              <Col md={8}>
                <Card key={index} className="card" bordered={false}>
                  <div className="iconWrapper">
                    {item.icon}
                  </div>
                  <div className="featureTitle">{item.title}</div>
                  <div className="description">{item.description}</div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </>
  );
};

export default EstimatePage;
