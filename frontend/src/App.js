import React, { useState } from 'react';
import { Form, Button, Input, Card } from 'antd';

function App() {
  const [formValue, setFormValue] = useState({field: ""});
  const onFinish = values => {
    setFormValue(values);
  };
  return (
    <div className="d-flex align-center justify-center full-width" style={{ height: '100vh' }}>
      <Card style={{ width: 500, maxWidth: '95%' }}>
        <Form
          name="basic"
          onFinish={onFinish}
        >
          <h2>Sample Form</h2>
          <Form.Item
            label="Field"
            name="field"
            className="mb-2"
            // rules={[{ required: true, message: 'This field is required' }]}
          >
            <Input placeholder="Enter a value and click Submit"/>
          </Form.Item>

          { formValue.field !== "" && (
            <Form.Item className="mb-0">
              <p className="mb-0">The input value is: {formValue.field}</p>
            </Form.Item>
          )}

          <Form.Item className="mb-0 mt-4">
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default App;
