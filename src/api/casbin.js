import request from '@/utils/request.js';

export const getCasbinListAPI = (params) => {
  return request({
    url: '/api/v1/casbin/list',
    method: 'get',
    params,
  });
};

export const createCasbinAPI = (data) => {
  return request({
    url: '/api/v1/casbin/create',
    method: 'post',
    data,
  });
};

export const updateCasbinAPI = (data) => {
  return request({
    url: '/api/v1/casbin/update',
    method: 'post',
    data,
  });
};

export const deleteCasbinAPI = (data) => {
  return request({
    url: '/api/v1/casbin/delete',
    method: 'delete',
    data,
  });
};
