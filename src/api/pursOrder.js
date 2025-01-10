import request from '@/utils/request.js';

export const getPurListPOAPI = (params) => {
  return request({
    url: '/api/v1/purs/PurListKHPO',
    method: 'get',
    params,
  });
};
//---------//
export const getPurListSAPI = (params) => {
  return request({
    url: '/api/v1/purs/PurListS',
    method: 'get',
    params,
  });
};

export const getDetailListSAPI = (params) => {
  return request({
    url: '/api/v1/purs/DetailListS',
    method: 'get',
    params,
  });
};

export const setPackQtySAPI = (params) => {
  return request({
    url: '/api/v1/purs/SetPackQtyS',
    method: 'post',
    params,
  });
};

export const addPackSAPI = (params) => {
  return request({
    url: '/api/v1/purs/AddPackS',
    method: 'post',
    params,
  });
};

export const delPackSAPI = (params) => {
  return request({
    url: '/api/v1/purs/DelPackS',
    method: 'post',
    params,
  });
};

export const loadingQtySAPI = (data) => {
  return request({
    url: '/api/v1/purs/LoadingQtyS',
    method: 'post',
    data,
  });
};

export const CFMSAPI = (params) => {
  return request({
    url: '/api/v1/purs/CFMS',
    method: 'post',
    params,
  });
};

export const uploadFileSAPI = (data) => {
  return request({
    url: '/api/v1/purs/UploadLotFileS',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
