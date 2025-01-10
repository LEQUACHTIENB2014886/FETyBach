import request from '@/utils/request.js';

export const getPurListAPI = (params) => {
  return request({
    url: '/api/v1/pur/PurList',
    method: 'get',
    params,
  });
};

export const getDetailListAPI = (params) => {
  return request({
    url: '/api/v1/pur/DetailList',
    method: 'get',
    params,
  });
};

export const setPackQtyAPI = (params) => {
  return request({
    url: '/api/v1/pur/SetPackQty',
    method: 'post',
    params,
  });
};

export const addPackAPI = (params) => {
  return request({
    url: '/api/v1/pur/AddPack',
    method: 'post',
    params,
  });
};

export const delPackAPI = (params) => {
  return request({
    url: '/api/v1/pur/DelPack',
    method: 'post',
    params,
  });
};

export const loadingQtyAPI = (data) => {
  return request({
    url: '/api/v1/pur/LoadingQty',
    method: 'post',
    data,
  });
};

export const CFMAPI = (params) => {
  return request({
    url: '/api/v1/pur/CFM',
    method: 'post',
    params,
  });
};

export const ImportPackQty = (data) => {
  return request({
    url: '/api/v1/pur/ImportPackQty',
    method: 'post',
    data,
  });
};


export const uploadFileAPI = (data) => {
  return request({
    url: '/api/v1/pur/UploadLotFile',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

