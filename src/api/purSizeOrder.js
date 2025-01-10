import request from '@/utils/request.js';

export const getPurListSizeAPI = (params) => {
  return request({
    url: '/api/v1/purSize/PurListSize',
    method: 'get',
    params,
  });
};

export const getDetailListSizeAPI = (params) => {
  return request({
    url: '/api/v1/purSize/DetailListSize',
    method: 'get',
    params,
  });
};

export const setPackQtySizeAPI = (params) => {
  return request({
    url: '/api/v1/purSize/SetPackQtySize',
    method: 'post',
    params,
  });
};

export const addPackSizeAPI = (params) => {
  return request({
    url: '/api/v1/purSize/AddPackSize',
    method: 'post',
    params,
  });
};

export const delPackSizeAPI = (params) => {
  return request({
    url: '/api/v1/purSize/DelPackSize',
    method: 'post',
    params,
  });
};

export const loadingQtySizeAPI = (data) => {
  return request({
    url: '/api/v1/purSize/LoadingQtySize',
    method: 'post',
    data,
  });
};

export const CFMSizeAPI = (params) => {
  return request({
    url: '/api/v1/purSize/CFMSize',
    method: 'post',
    params,
  });
};

export const uploadFileSizeAPI = (data) => {
  return request({
    url: '/api/v1/purSize/UploadLotFileSize',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
