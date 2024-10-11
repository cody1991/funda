import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex } from 'antd';

import axios from "axios"

const App = () => {
  const onFinish = (values) => {
    console.log('Received values of form: ', values);

    axios.post('http://localhost:3000/user/login', {
      email: values.email,
      password: values.password
    }
    ).then(res => {
      const { data } = res;
      localStorage.setItem('token', data.token);
    })
  };
  return (
    <div style={
      {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#eee'
      }
    }>
      <Form
        name="login"
        initialValues={{
          remember: true,
        }}
        style={{
          maxWidth: 360,
          border: '1px solid #000',
          padding: 20,
          borderRadius: 4
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: 'Please input your Email!',
            },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your Password!',
            },
          ]}
        >
          <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Flex justify="space-between" align="center">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a href="https://login.funda.nl/account/login?ReturnUrl=%2Fconnect%2Fauthorize%2Fcallback%3Fclient_id%3Dfunda-app-js-client%26scope%3Dopenid%2520profile%2520funda_basic%2520funda_login_metadata%2520funda_api%2520offline_access%26response_type%3Dcode%26redirect_uri%3Dhttps%253A%252F%252Fwww.funda.nl%252Fauth%252Foidc%252Fsignin-callback%252F%26code_challenge%3DhxxU6bttDC0jqmH589DfG-0FZQeLS5M8u8qYPVbLb38%26code_challenge_method%3DS256%26state%3D29d1d00a16fd7851cdd0130ef174b3d07ad79f55">Forgot password</a>
          </Flex>
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );

};
export default App;