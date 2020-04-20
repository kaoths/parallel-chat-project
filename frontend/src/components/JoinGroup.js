import React from 'react';
import { Form, Input, Modal } from 'antd';

const JoinGroup = (props) => {
  const onFinish = values => {
    // API Here
    console.log(values);
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
      okButtonProps={{form:'join-group-form', key: 'submit', htmlType: 'submit'}}
      okText="Join"
    >
      <Form
        name="basic"
        onFinish={onFinish}
        id="join-group-form"
      >
        <h2>Join a Group</h2>
        <Form.Item
          label="Group Id"
          name="groupId"
          className="mb-2"
          rules={[{ required: true, message: 'This field is required' }]}
        >
          <Input placeholder="Enter Group ID"/>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default JoinGroup;
