import request from '@/utils/request.js';

export const GetPurCFMAPI = (params) => {
  return request({
    url: '/api/v1/cfm/PurCFM',
    method: 'get',
    params,
  });
};

export const GetDetailCFMAPI = (params) => {
  return request({
    url: '/api/v1/cfm/DetailCFM',
    method: 'get',
    params,
  });
};

export const CFMALLAPI = (data) => {
  return request({
    url: '/api/v1/cfm/CFMALL',
    method: 'post',
    data,
  });
};