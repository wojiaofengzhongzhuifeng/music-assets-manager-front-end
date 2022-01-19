import React from "react";
import { Layout, Menu } from 'antd';
import styles from './style.module.css'

const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;

const AuthLayout = ()=>{
  return (
    <div className={styles.layOutCt}>
      <Layout className={styles.layOut}>
        <Sider>
          <div className={styles.logo}>
            logo
          </div>
          <Menu
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            theme='dark'
            mode='inline'
          >
            <Menu.Item key="1">
              Navigation One
            </Menu.Item>
            <Menu.Item key="2">
              Navigation Two
            </Menu.Item>
            <SubMenu key="sub1" title="Navigation Two">
              <Menu.Item key="3">Option 3</Menu.Item>
              <Menu.Item key="4">Option 4</Menu.Item>
              <SubMenu key="sub1-2" title="Submenu">
                <Menu.Item key="5">Option 5</Menu.Item>
                <Menu.Item key="6">Option 6</Menu.Item>
              </SubMenu>
            </SubMenu>
            <SubMenu key="sub2" title="Navigation Three">
              <Menu.Item key="7">Option 7</Menu.Item>
              <Menu.Item key="8">Option 8</Menu.Item>
              <Menu.Item key="9">Option 9</Menu.Item>
              <Menu.Item key="10">Option 10</Menu.Item>
            </SubMenu>
            <Menu.Item key="link">
              <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
                Ant Design
              </a>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          {/*// todo 应该使用 className */}
          <Header style={{background: 'white', boxShadow: '0 3px 12px rgba(2, 20, 43, 0.08)'}}>
            header
          </Header>
          <Content>Content</Content>
          <Footer>Footer</Footer>
        </Layout>
      </Layout>
    </div>

  )
}
export default AuthLayout
