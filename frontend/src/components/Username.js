import React from 'react';
import { Form, Input, Modal, Select } from 'antd';
import Axios from "axios";

class Username extends React.Component {
  state = {
    mode: 'login'
  }
  onFinish = values => {
    const { mode } = this.state;
    // API Here
    Axios.post(mode === 'reg' ? '/auth/register' : '/auth/login',{
      username: values.username,
      password: values.password
    }).then(res => {
      this.props.onLogin({
        username: values.username,
        token: res.data.token,
        rooms: res.data.rooms
      })
    })
  };
  handleChange = (value) => {
    this.setState({ mode: value })
  }
  render() {
    const {
      onCancel,
      visible
    } = this.props;
    const { mode } = this.state
    return (
      <Modal 
        style={{ width: 500, maxWidth: '95%' }} 
        visible={visible}
        onCancel={onCancel}
        okButtonProps={{form:'username-form', key: 'submit', htmlType: 'submit'}}
        okText={ mode === 'reg' ? 'Register' : 'Login'}
      >
        <Form
          name="basic"
          onFinish={this.onFinish}
          id="username-form"
        >
          <Form.Item className="mb-3">
            <Select defaultValue="login" style={{ width: 120 }} onChange={this.handleChange}>
              <Select.Option value="login">Login</Select.Option>
              <Select.Option value="reg">Register</Select.Option>
            </Select>
          </Form.Item>
          <h2>{ mode === 'reg' ? 'Register' : 'Login'}</h2>
          <Form.Item
            label="Username"
            name="username"
            className="mb-2"
            rules={[{ required: true, message: 'This field is required' }]}
          >
            <Input placeholder="Username"/>
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            className="mb-2"
            rules={[{ required: true, message: 'This field is required' }]}
          >
            <Input placeholder="Password" type="password"/>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Username;
