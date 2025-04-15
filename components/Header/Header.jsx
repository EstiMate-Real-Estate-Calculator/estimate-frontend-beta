import React, { useState } from 'react'
import { MenuOutlined } from '@ant-design/icons';
import { Layout, Dropdown, Button, Drawer } from "antd";
import { useRouter } from 'next/navigation';
import "../../styles/Header.scss";
import { FaUserCircle } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { LoginOutlined } from '@ant-design/icons';

const { Header } = Layout;

const HeaderComponent = () => {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const router = useRouter();

    const logout = () => {
        localStorage?.clear();
        window.open('/sign-in', '_self');
    }

    const items = [
        {
            key: '1',
            label: (
                <a href="/profile">
                    Profile <FaUser color='#155E75' />
                </a>
            ),
        },
        {
            key: '2',
            label: (
                <span onClick={() => logout()}>
                    Sign Out <FaSignOutAlt color='#155E75' />
                </span>
            ),
        },
    ];

    const handleLoginClick = () => {
        router.push('/sign-in');
    };

    return (
        <>
            <Header className="customHeader flex justify-between items-center px-6 py-4 bg-white shadow relative">
                <div className="text-xl font-bold text-white-600 logoSection" onClick={() => router.push('/dashboard')}>
                    EstiMate
                </div>
                {/* Navigation menu */}
                <nav className="hidden md:flex space-x-12 text-base font-medium text-white-700">
                    <a href="/" className="hover:text-primary">Home</a>
                    <a href="/dashboard" className="hover:text-primary">Listing</a>
                    <a href="/dashboard" className="hover:text-primary">Features</a>
                    <a href="https://chromewebstore.google.com/detail/estimate-demo/ibgdanpaoapljanhifdofglnibahljbe?authuser=1&hl=en" className="hover:text-primary" target="_blank"
                        rel="noopener noreferrer">Extension</a>
                    <a
                        href="https://discord.gg/RXmpKUqz"
                        className="hover:text-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Contact Us
                    </a>
                    <a href="/FAQ" className="hover:text-primary">FAQ</a>
                </nav>

                {window.location.pathname === "/" ? (
                    <Button
                        type="primary"
                        className="loginBtn"
                        onClick={handleLoginClick}
                    >
                        Log In / Sign Up
                    </Button>
                ) : (
                    <>
                        {/* To show Profile if logged in and login/signup if unauthenticated */}
                        <Dropdown menu={{ items }} className='headerDropdown hidden md:block' placement="bottomRight">
                            <FaUserCircle />
                        </Dropdown>
                    </>
                )}



                {/* Button to open the drawer  */}
                <Button
                    className="md:hidden text-gray-700 menuButton"
                    icon={<MenuOutlined />}
                    onClick={() => setDrawerVisible(true)}
                    type="text"
                />

                {/* This is a drawer for Mobile view of the Header*/}
                <Drawer
                    title="Menu"
                    placement="right"
                    onClose={() => setDrawerVisible(false)}
                    visible={drawerVisible}
                >
                    <nav className="flex flex-col space-y-4 text-base font-medium">
                        <a href="#home" onClick={() => setDrawerVisible(false)}>Home</a>
                        <a href="#listing" onClick={() => setDrawerVisible(false)}>Listing</a>
                        <a href="#features" onClick={() => setDrawerVisible(false)}>Features</a>
                        <a href="#extension" onClick={() => setDrawerVisible(false)}>Extension</a>
                        <a href="#contact" onClick={() => setDrawerVisible(false)}>Contact Us</a>

                        <div className="mt-6">
                            <Button onClick={logout}>
                                Logout
                            </Button>
                        </div>
                    </nav>
                </Drawer>
            </Header>
            <div className="w-full bg-yellow-100 text-yellow-800 text-center text-sm py-2 font-medium">
                🚧 This is a <strong>Beta version</strong>. All features are coming soon. Stay tuned!
            </div>
        </>
    )
}

export default HeaderComponent;