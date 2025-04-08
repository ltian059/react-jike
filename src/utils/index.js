/* 封装统一中转工具模块 */
import axios from './request'
import { getLocalStorageToken, setLocalStorageToken, removeLocalStorageToken } from './token'


export { axios, getLocalStorageToken, setLocalStorageToken, removeLocalStorageToken };
