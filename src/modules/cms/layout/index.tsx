import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CalendarOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, MenuProps, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { LogoutOutlined } from "@ant-design/icons";
import { client } from "../../../supabase/client";

const { Header, Sider, Content } = Layout;

type RouteMap = {
  [key: string]: string;
};
type MenuClickEvent = MenuProps["onClick"];

const LayoutCms: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await client.auth.signOut();
      localStorage.removeItem("isAuthenticated");
      navigate("/cms");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const routeMap: RouteMap = {
    "0": "/app/appointment",
    "1": "/app/services",
  };

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick: MenuClickEvent = (e) => {
    const path = routeMap[e.key]; // Obtener la ruta correspondiente
    if (path) {
      navigate(path); // Navegar a la ruta
    } else {
      console.warn(`No route mapped for key: ${e.key}`);
    }
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className='demo-logo-vertical' />
        <Menu
          theme='dark'
          mode='inline'
          defaultSelectedKeys={["0"]}
          onClick={handleMenuClick}
          items={[
            {
              key: "0",
              icon: <CalendarOutlined />,
              label: "Calendario",
            },
            {
              key: "1",
              icon: <OrderedListOutlined />,
              label: "Servicios",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div className='flex items-center justify-between mr-4'>
            <Button
              type='text'
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />

            <Button
              onClick={handleLogout}
              type='link'
              shape='round'
              icon={<LogoutOutlined />}
              size='small'
            >
              Salir
            </Button>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutCms;
