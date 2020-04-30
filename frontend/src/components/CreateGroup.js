import React from 'react';
import { Form, Input, Modal, Select } from 'antd';

class CreateGroup extends React.Component {
  onFinish = values => {
    const { socket } = this.props;
    const username = localStorage.getItem("username")

    if (this.state.mode === 'create') {
      socket.emit('addRoom',{
        username,
        roomName: values.groupId
      });
    } else {
      socket.emit('joinRoom',{
        username,
        roomName: values.groupId
      })
    }
  };
  handleChange = (value) => {
    this.setState({ mode: value })
  }
  render() {
    const {
      onCancel,
      visible
    } = this.props;
    return (
      <Modal 
        style={{ width: 500, maxWidth: '95%' }} 
        visible={visible}
        onCancel={onCancel}
        okButtonProps={{form:'create-group-form', key: 'submit', htmlType: 'submit'}}
        okText="Create"
      >
        <Form
          name="basic"
          onFinish={this.onFinish}
          id="create-group-form"
        >
          <Select defaultValue="create" style={{ width: 120 }} onChange={this.handleChange}>
            <Select.Option value="create">Create</Select.Option>
            <Select.Option value="join">Join</Select.Option>
          </Select>
          <h2>Create a Group</h2>
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
}

export default CreateGroup;
