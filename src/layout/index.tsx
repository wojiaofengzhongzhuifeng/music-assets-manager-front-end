import React from "react";
import { Layout, Menu } from 'antd';
import { Link, Routes, Route } from "react-router-dom";
import styles from './style.module.css'
import {MenuInfo} from "rc-menu/lib/interface";
import routerList from "../config/routers";
import {MenuList, MenuItemProps} from "../config/menus";

const { Header, Footer, Sider, Content } = Layout;
const { SubMenu,  } = Menu;

const AuthLayout = ()=>{
  const onClickMenu = (menuInfo: MenuInfo)=>{
    console.log(menuInfo);
  }
  const renderMenuList = (menuList: MenuItemProps[])=>{
   return menuList.map((menuItem)=>{
     const path = menuItem.path
     const title = menuItem.title
     const children = menuItem.children
     if(children){
       return (
         <SubMenu key={path} title={title}>
           {renderMenuList(children)}
         </SubMenu>
       )
     } else {
       return <Menu.Item key={path}>
         <Link to={path}>{title}</Link>
       </Menu.Item>
     }
   })
  }

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
            onClick={onClickMenu}
          >
            {renderMenuList(MenuList)}
          </Menu>
        </Sider>
        <Layout>
          {/*// todo 应该使用 className */}
          <Header style={{background: 'white', boxShadow: '0 3px 12px rgba(2, 20, 43, 0.08)'}}>
            header
          </Header>
          <Content style={{background: 'white', boxShadow: '0 3px 12px rgba(2, 20, 43, 0.08)', margin: '10px'}}>
            <Routes>
              {routerList.map((routerItem)=> <Route path={routerItem.path} element={routerItem.element} key={routerItem.path}/>)}
            </Routes>
          </Content>
          <Footer>Footer</Footer>
        </Layout>
      </Layout>
    </div>

  )
}
export default AuthLayout
