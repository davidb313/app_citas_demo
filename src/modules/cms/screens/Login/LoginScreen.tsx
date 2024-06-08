import { UserOutlined } from "@ant-design/icons";

import { Card, Row, Col, Button, Form, Input, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { client } from "../../../../supabase/client";

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const navigate = useNavigate();

  const error = () => {
    messageApi.open({
      type: "error",
      content: "El email proporcionado no está autorizado",
    });
  };

  const validateEmail = (_: any, value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value || emailRegex.test(value)) {
      setIsEmailValid(true); // Actualiza el estado a válido
      return Promise.resolve();
    } else {
      setIsEmailValid(false); // Actualiza el estado a no válido
      return Promise.reject(new Error("Ingresa un correo válido"));
    }
  };

  const onFinish = async () => {
    try {
      const response = await client.auth.signInWithOtp({
        email,
      });
      if (response.error === null) {
        navigate("/app");
      }
    } catch (err) {
      error();
    }
  };

  return (
    <>
      {contextHolder}
      <Row
        justify='center'
        align='middle'
        style={{ minHeight: "100vh", padding: 10 }}
      >
        <Col xs={24} sm={16} md={12} lg={8}>
          <Card title='Iniciar Sesión'>
            <Form
              name='normal_login'
              className='login-form'
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name='username'
                rules={[
                  { required: true, message: "Por favor ingrese su correo" },
                  { validator: validateEmail },
                ]}
              >
                <Input
                  prefix={<UserOutlined className='site-form-item-icon' />}
                  placeholder='Email'
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  disabled={!isEmailValid || email === ""}
                  type='primary'
                  style={{ width: "100%" }}
                  size='large'
                  shape='round'
                  htmlType='submit'
                  className='login-form-button mt-4'
                >
                  Continuar
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default LoginScreen;
