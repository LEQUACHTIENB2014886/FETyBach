import request from '@/utils/request.js';

export const login = async (data) => {
  return request({
    url: '/api/v1/user/login_by_password',
    method: 'post',
    data,
  });
};

export const getUserInfo = () => {
  return request({
    url: '/api/v1/user/info',
    method: 'get',
  });
};

export const getUserListAPI = (params) => {
  return request({
    url: '/api/v1/user/list',
    method: 'get',
    params,
  });
};

export const createUserAPI = (data) => {
  return request({
    url: '/api/v1/user/create',
    method: 'post',
    data,
  });
};

export const updateUserAPI = (data) => {
  return request({
    url: '/api/v1/user/update',
    method: 'post',
    data,
  });
};

export const deleteUserAPI = (data) => {
  return request({
    url: '/api/v1/user/delete',
    method: 'delete',
    data,
  });
};
