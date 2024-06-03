import React, { useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Button, Input, message } from "antd";
import { client } from "../supabase/client";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [emailConfirm, setEmailConfirm] = useState("");

  //Mensajes de confirmacion o error de la App
  const success = () => {
    messageApi.open({
      type: "success",
      content:
        "Correo enviado correctamente, revisa tu email y da clic en el botón Confimar",
      duration: 7,
    });
  };

  const error = () => {
    messageApi.open({
      type: "error",
      content:
        "No se encuentra tu correo, por favor verifica si esta bien escrito",
    });
  };

  const handleLogin = async () => {
    setEmail(email);
    try {
      const result = await client.auth.signInWithOtp({
        email,
      });
      if (result.data.user) {
        setEmailConfirm(result.data.user);
      }
      success();
    } catch (err) {
      error();
    }
  };

  return (
    <>
      {contextHolder}
      {emailConfirm ? (
        <Button onClick={(e) => client.auth.signOut} size='small'>
          Salir
        </Button>
      ) : (
        <div className='flex gap-2'>
          <Input
            size='small'
            required
            onChange={(e) => setEmail(e.target.value)}
            type='email'
            placeholder='Ingresa aquí tu email'
            prefix={<UserOutlined />}
          />
          <Button onClick={handleLogin} size='small'>
            Ingresa
          </Button>
        </div>
      )}
    </>
  );
};
