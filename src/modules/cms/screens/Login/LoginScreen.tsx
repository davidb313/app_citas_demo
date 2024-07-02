import { UserOutlined } from "@ant-design/icons";

import { Card, Row, Col, Button, Form, Input } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { client } from "../../../../supabase/client";
import { useMessages } from "../../../../hooks/useMessages";

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);

  const { showSuccess, showError, contextHolder } = useMessages();

  const navigate = useNavigate();

  const validateEmail = (_: any, value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value || emailRegex.test(value)) {
      setIsEmailValid(true);
      return Promise.resolve();
    } else {
      setIsEmailValid(false);
      return Promise.reject(new Error("Ingresa un correo válido"));
    }
  };

  const onFinish = async () => {
    try {
      const response = await client.auth.signInWithOtp({
        email,
      });
      if (response.error === null) {
        showSuccess(
          "Te enviamos un correo, sigue las instrucciones para ingresar a la App"
        );
        navigate("/app");
      }
    } catch (err) {
      showError(
        "Se detectó un error en la autenticación, valida si el correo ingresado es correcto"
      );
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
