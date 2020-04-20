import React from 'react';
import { Form, Input, Modal } from 'antd';

const Username = (props) => {
  const onFinish = values => {
    // API Here
    if (values.username && values.username !== "") {
      localStorage.setItem("username", values.username);
      props.onCancel(); // Dismiss Modal
    }
  };
  const {
    onCancel,
    visible
  } = props;
  return (
    <Modal 
      style={{ width: 500, maxWidth: '95%' }} 
      visible={visible}
      onCancel={onCancel}
      okButtonProps={{form:'username-form', key: 'submit', htmlType: 'submit'}}
      okText="Apply"
    >
      <Form
        name="basic"
        onFinish={onFinish}
        id="username-form"
        initialValues={{ username: localStorage.getItem("username") ? localStorage.getItem("username") : "" }}
      >
        <h2>Enter a Username</h2>
        <Form.Item
          label="Username"
          name="username"
          className="mb-2"
          rules={[{ required: true, message: 'This field is required' }]}
        >
          <Input placeholder="Username"/>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default Username;
