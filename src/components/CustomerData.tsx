import { Input } from "antd";
import React, { useState } from "react";
import { UserOutlined } from "@ant-design/icons";

const MyComponent = () => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");

  console.log(name, number);

  return (
    <div className='mt-6 space-y-4'>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        size='large'
        placeholder='Tu nombre'
        prefix={<UserOutlined />}
      />
      <Input
        value={number}
        type='number'
        onChange={(e) => setNumber(e.target.value)}
        size='large'
        placeholder='Tu teléfono'
        prefix={<UserOutlined />}
      />
    </div>
  );
};

export default MyComponent;
