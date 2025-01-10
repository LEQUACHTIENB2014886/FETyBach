import request from '@/utils/request.js';

export const getRoleAPI = (roleId) => {
  return request({
    url: `/api/v1/role/view/${roleId}`,
    method: 'get',
  });
};

export const getRoleListAPI = (params) => {
  return request({
    url: '/api/v1/role/list',
    method: 'get',
    params,
  });
};

export const createRoleAPI = (data) => {
  return request({
    url: '/api/v1/role/create',
    method: 'post',
    data,
  });
};

export const updateRoleAPI = (data) => {
  return request({
    url: '/api/v1/role/update',
    method: 'post',
    data,
  });
};

export const deleteRoleAPI = (data) => {
  return request({
    url: '/api/v1/role/delete',
    method: 'delete',
    data,
  });
};
