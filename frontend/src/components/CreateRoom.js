import React from 'react';
import { Form, Input, Modal, Select } from 'antd';

class CreateRoom extends React.Component {
  state = {
    mode: 'join'
  }
  onFinish = values => {
    const { socket, username } = this.props;
    if (this.state.mode === 'create') {
      socket.emit('addRoom',{
        username,
        roomName: values.roomName
      });
    } else {
      socket.emit('joinRoom',{
        username,
        roomName: values.roomName
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
    const { mode } = this.state;
    return (
      <Modal 
        style={{ width: 500, maxWidth: '95%' }} 
        visible={visible}
        onCancel={onCancel}
        okButtonProps={{form:'create-group-form', key: 'submit', htmlType: 'submit'}}
        okText={ mode === 'create' ? 'Create' : 'Join'}
      >
        <Form
          name="basic"
          onFinish={this.onFinish}
          id="create-group-form"
        >
          <Form.Item className="mb-3">
            <Select defaultValue="join" style={{ width: 120 }} onChange={this.handleChange}>
              <Select.Option value="join">Join</Select.Option>
              <Select.Option value="create">Create</Select.Option>
            </Select>
          </Form.Item>
          <h2>{ mode === 'create' ? 'Create a Room' : 'Join an Existing Room'}</h2>
          <Form.Item
            label="Room Name"
            name="roomName"
            className="mb-2"
            rules={[{ required: true, message: 'This field is required' }]}
          >
            <Input placeholder="Enter Room ID"/>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default CreateRoom;
