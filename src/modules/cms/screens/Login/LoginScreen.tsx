import { UserOutlined, SafetyOutlined } from "@ant-design/icons";
import { Card, Row, Col, Button, Form, Input } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { client } from "../../../../supabase/client";
import { useMessages } from "../../../../hooks/useMessages";
import { Spinner } from "../../../../components";

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { showError, contextHolder } = useMessages();

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
      setIsLoading(true);
      const { data } = await client.auth.signInWithPassword({
        email,
        password,
      });
      if (data.session) {
        localStorage.setItem("isAuthenticated", "true");
        navigate("/app");
      } else {
        showError(
          "Se detectó un error en la autenticación, valida si el correo o la contraseña son correctos"
        );
      }
    } catch (err) {
      showError(
        "Error en la autenticación, valida si el correo o la contraseña son correctos"
      );
    }
    setIsLoading(false);
  };

  return (
    <>
      {contextHolder}
      {isLoading ? (
        <Spinner />
      ) : (
        <Row
          justify='center'
          align='middle'
          style={{ minHeight: "100vh", padding: 10, boxShadow: "10" }}
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
                <Form.Item
                  name='password'
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese su contraseña",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<SafetyOutlined className='site-form-item-icon' />}
                    placeholder='Contraseña'
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    disabled={!isEmailValid || email === "" || password === ""}
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
      )}
    </>
  );
};

export default LoginScreen;
