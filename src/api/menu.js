import request from '@/utils/request.js';

export const getMenuTreeListAPI = (params) => {
  return request({
    url: '/api/v1/menu/tree',
    method: 'get',
    params,
  });
};

export const getMenuListAPI = (params) => {
  return request({
    url: '/api/v1/menu/list',
    method: 'get',
    params,
  });
};

export const createMenuAPI = (data) => {
  return request({
    url: '/api/v1/menu/create',
    method: 'post',
    data,
  });
};

export const updateMenuAPI = (data) => {
  return request({
    url: '/api/v1/menu/update',
    method: 'post',
    data,
  });
};

export const deleteMenuAPI = (data) => {
  return request({
    url: '/api/v1/menu/delete',
    method: 'delete',
    data,
  });
};
