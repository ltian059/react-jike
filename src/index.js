import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import { RouterProvider } from "react-router";
import router from "./router";
// Provide the Redux Store to React
import { Provider } from 'react-redux'
import store from '@/store'
import 'normalize.css'
import locale from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
import { ConfigProvider } from 'antd';
dayjs.locale('zh-cn');
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider locale={locale}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);


