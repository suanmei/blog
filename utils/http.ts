import axios from 'axios';
import qs from 'qs';

axios.interceptors.request.use(config => config, error => Promise.reject(error));

axios.interceptors.response.use(response => response, error => Promise.resolve(error.response));

function checkStatus(response) {
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    return response;
  }
  // 异常状态下，把错误信息返回去
  return {
    status: -404,
    msg: '网络异常',
  };
}

function checkCode(res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === -404) {
    console.warn(res.msg);
  }
  return res;
}

export default {
  post(url, trans, data, opt) {
    return axios(Object.assign({
      method: 'post',
      url,
      data: trans ? qs.stringify(data) : data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      withCredentials: true,
    }, opt))
      .then(response => checkStatus(response))
      .then(res => checkCode(res));
  },
  get(url, params?, opt?) {
    const options = typeof opt === 'undefined' ? params : opt;

    return axios(Object.assign({
      method: 'get',
      url,
      params, // get 请求时带的参数
    }, options))
      .then(response => checkStatus(response))
      .then(res => checkCode(res));
  },
};
