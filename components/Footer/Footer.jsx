import React from 'react'
import { Layout } from 'antd';
import "../../styles/Footer.scss";

const Footer = () => {
  const { Footer } = Layout;

  return (
    <Footer className="customFooter">
      © 2025 EstiMate
    </Footer>
  )
}

export default Footer;