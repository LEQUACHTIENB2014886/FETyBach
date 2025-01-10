import request from '@/utils/request.js';

export const getPurListPrintAPI = (params) => {
  return request({
    url: '/api/v1/purp/PurListPrint',
    method: 'get',
    params,
  });
};

export const getDetailListPrintAPI = (data) => {
  return request({
    url: '/api/v1/purp/DetailListPrint',
    method: 'post',
    data,
  });
};

export const getLabelPrintAPI = (data) => {
  return request({
    url: '/api/v1/purp/LabelPrint',
    method: 'post',
    data,
  });
};