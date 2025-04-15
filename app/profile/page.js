'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Select, Card, Row, Col } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import HeaderComponent from '@components/Header/Header';
import FooterComponent from '@components/Footer/Footer';
import '../../styles/Profile.scss';

const ProfilePage = () => {
    const [profileForm] = Form.useForm();
    const [addressForm] = Form.useForm();
    const [passwordForm] = Form.useForm();

    const [editingProfile, setEditingProfile] = useState(false);
    const [editingAddress, setEditingAddress] = useState(false);

    const onFinishPassword = (values) => {
        console.log('Password changed:', values);
        passwordForm.resetFields();
    };

    const onFinishProfile = (values) => {
        console.log('Profile updated:', values);
        setEditingProfile(false);
    };

    const onFinishAddress = (values) => {
        console.log('Address updated:', values);
        setEditingAddress(false);
    };

    return (
        <>
            <HeaderComponent />
            <div className="profile-container">
                <Card className="profile-card">
                    <div className="section-header">
                        <h2>Profile Details</h2>
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => setEditingProfile(!editingProfile)}
                            className="edit-button"
                        >
                            Edit
                        </Button>
                    </div>

                    <Form
                        form={profileForm}
                        layout="vertical"
                        onFinish={onFinishProfile}
                        disabled={!editingProfile}
                        className="profile-form"
                    >
                        <Row gutter={16}>
                            <Col md={12} xs={24}>
                                <Form.Item
                                    name="firstName"
                                    label="First Name"
                                    rules={[{ required: true, message: 'Please enter your first name' }]}
                                >
                                    <Input placeholder="Enter your first name" />
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={24}>
                                <Form.Item
                                    name="lastName"
                                    label="Last Name"
                                    rules={[{ required: true, message: 'Please enter your last name' }]}
                                >
                                    <Input placeholder="Enter your last name" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col md={12} xs={24}>
                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[
                                        { required: true, message: 'Please enter your email' },
                                        { type: 'email', message: 'Please enter a valid email' },
                                    ]}
                                >
                                    <Input placeholder="Enter your email" />
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={24}>
                                <Form.Item
                                    name="phoneNumber"
                                    label="Phone Number"
                                    rules={[
                                        { required: true, message: 'Please enter your phone number' },
                                        {
                                            pattern: /^\\d{10}$/,
                                            message: 'Phone number must be exactly 10 digits & should be valid.',
                                        },
                                    ]}
                                >
                                    <Input
                                        addonBefore="+1"
                                        placeholder="Enter your number"
                                        className="customInput"
                                        maxLength={10}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        {editingProfile && (
                            <Form.Item className="saveButton">
                                <Button type="primary" htmlType="submit">
                                    Save Changes
                                </Button>
                            </Form.Item>
                        )}
                    </Form>

                </Card>

                <Card className="profile-card">
                    <div className="section-header">
                        <h2>Address Details</h2>
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => setEditingAddress(!editingAddress)}
                            className="edit-button"
                        >
                            Edit
                        </Button>
                    </div>

                    <Form
                        form={addressForm}
                        layout="vertical"
                        onFinish={onFinishAddress}
                        disabled={!editingAddress}
                        className="profile-form"
                    >
                        <Form.Item
                            name="addressLine1"
                            label="Address Line"
                        >
                            <Input placeholder="Address line 1" className="address-input" />
                        </Form.Item>

                        <Form.Item
                            name="addressLine2"
                        >
                            <Input placeholder="Address line 2" className="address-input" />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="city"
                                    label="City"
                                >
                                    <Input placeholder="Enter your city" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="state"
                                    label="State"
                                >
                                    <Input placeholder="Enter your state" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="zipCode"
                                    label="Zip Code"
                                >
                                    <Input placeholder="Enter your zipcode" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="country"
                                    label="Country"
                                >
                                    <Select placeholder="Select your country">
                                        <Select.Option value="us">United States</Select.Option>
                                        <Select.Option value="ca">Canada</Select.Option>
                                        <Select.Option value="uk">United Kingdom</Select.Option>
                                        <Select.Option value="au">Australia</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        {editingAddress && (
                            <Form.Item className='saveButton'>
                                <Button type="primary" htmlType="submit">
                                    Save Changes
                                </Button>
                            </Form.Item>
                        )}
                    </Form>
                </Card>

                <Card className="profile-card">
                    <div className="section-header">
                        <h2>Change Password</h2>
                    </div>
                    <div className='mt-5'>
                        <Form
                            form={passwordForm}
                            layout="vertical"
                            onFinish={onFinishPassword}
                            className="profile-form"
                        >
                            <Row gutter={16}>
                                <Col md={12} xs={24}>
                                    <Form.Item
                                        name="currentPassword"
                                        label="Current Password"
                                        rules={[{ required: true, message: 'Please enter your current password!' }]}
                                    >
                                        <Input.Password placeholder="Enter your current password" />
                                    </Form.Item>
                                </Col>
                                <Col md={12} xs={24}>


                                    <Form.Item
                                        name="newPassword"
                                        label="New Password"
                                        rules={[{ required: true, message: 'Please enter your new password!' }]}
                                    >
                                        <Input.Password placeholder="Enter your new password" />
                                    </Form.Item></Col>
                            </Row>

                            <Form.Item className='saveButton'>
                                <Button type="primary" htmlType="submit" className="change-password-button">
                                    Change Password
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Card>
            </div>
            <FooterComponent />
        </>
    );
};

export default ProfilePage;