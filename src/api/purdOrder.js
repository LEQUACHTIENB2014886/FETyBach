import request from '@/utils/request.js';

export const getPurListPOAPI = (params) => {
  return request({
    url: '/api/v1/purd/PurListD2',
    method: 'get',
    params,
  });
};
//---------//
export const getPurListSAPI = (params) => {
  return request({
    url: '/api/v1/purd/PurListD2',
    method: 'get',
    params,
  });
};

export const getDetailListSAPI = (params) => {
  return request({
    url: '/api/v1/purd/DetailListD2',
    method: 'get',
    params,
  });
};

export const setPackQtySAPI = (params) => {
  return request({
    url: '/api/v1/purd/SetPackQtyD2',
    method: 'post',
    params,
  });
};

export const addPackSAPI = (params) => {
  return request({
    url: '/api/v1/purd/AddPackD2',
    method: 'post',
    params,
  });
};

export const delPackSAPI = (params) => {
  return request({
    url: '/api/v1/purd/DelPackD2',
    method: 'post',
    params,
  });
};

export const loadingQtySAPI = (data) => {
  return request({
    url: '/api/v1/purd/LoadingQtyD2',
    method: 'post',
    data,
  });
};

export const CFMSAPI = (params) => {
  return request({
    url: '/api/v1/purd/CFMD2',
    method: 'post',
    params,
  });
};

export const uploadFileSAPI = (data) => {
  return request({
    url: '/api/v1/purd/UploadLotFileD2',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
