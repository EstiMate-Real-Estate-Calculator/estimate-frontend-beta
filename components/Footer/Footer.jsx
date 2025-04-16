// EstimateFooter.jsx
import React from 'react';
import { Layout, Row, Col, Typography, Space, Divider } from 'antd';
import { FacebookOutlined, TwitterOutlined, LinkedinOutlined, InstagramOutlined } from '@ant-design/icons';
import '../../styles/Footer.scss';

const { Footer } = Layout;
const { Title, Text, Link } = Typography;

const EstimateFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Footer className="estimate-footer">
      <div className="footer-container">
        <Row gutter={[24, 36]}>
          {/* Logo and Tagline */}
          <Col xs={24} md={6} lg={6}>
            <div className="footer-logo">
              <h2>EstiMate</h2>
              <Text className="tagline">Smart Real Estate Investment Solutions</Text>
            </div>
          </Col>

          {/* Resources Column */}
          <Col xs={24} sm={8} md={6} lg={6}>
            <Title level={5}>Resources</Title>
            <ul className="footer-links">
              <li><Link href="/dashboard">ROI Calculator</Link></li>
              <li><Link href="/dashboard">Mortgage Analysis</Link></li>
              <li><Link href="/dashboard">Market Trends</Link></li>
            </ul>
          </Col>

          {/* Company Column */}
          <Col xs={24} sm={8} md={6} lg={6}>
            <Title level={5}>Company</Title>
            <ul className="footer-links">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="https://discord.gg/RXmpKUqz">Contact</Link></li>
              <li><Link href="/FAQ">FAQ</Link></li>
            </ul>
          </Col>

          {/* Connect Column */}
          <Col xs={24} sm={8} md={6} lg={6}>
            <Title level={5}>Connect</Title>
            <ul className="footer-links">
              <li>
                <Link href="https://discord.gg/RXmpKUqz" target="_blank" rel="noopener noreferrer">
                  Join our Discord
                </Link>
              </li>
              <li>
                <Space className="social-icons">
                  <Link href="#" aria-label="Facebook">
                    <FacebookOutlined />
                  </Link>
                  <Link href="#" aria-label="Twitter">
                    <TwitterOutlined />
                  </Link>
                  <Link href="#" aria-label="LinkedIn">
                    <LinkedinOutlined />
                  </Link>
                  <Link href="#" aria-label="Instagram">
                    <InstagramOutlined />
                  </Link>
                </Space>
              </li>
            </ul>
          </Col>
        </Row>

        <Divider className="footer-divider" />

        <Row justify="space-between" align="middle" className="footer-bottom">
          <Col xs={24} md={12} className="copyright">
            <Text>© {currentYear} EstiMate. All rights reserved.</Text>
          </Col>
          <Col xs={24} md={12}>
            <Space className="legal-links" size={20}>
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms-of-service">Terms of Service</Link>
            </Space>
          </Col>
        </Row>
      </div>
    </Footer>
  );
};

export default EstimateFooter;