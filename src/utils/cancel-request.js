import qs from 'qs';

export default class CancelRequest {
  constructor() {
    this.pendingRequest = new Map();
  }

  generateReqKey(config) {
    const { url, method, params, data } = config;
    return [url, method, qs.stringify(params), qs.stringify(data)].join('&');
  }

  checkoutPendingRequest(config, CancelToken) {
    let source = null;
    if (config.cancelToken) {
      source = config.source;
    } else {
      source = CancelToken.source();
      config.cancelToken = source.token;
      config.requestKey = this.generateReqKey(config);
    }
    const requestKey = config.requestKey;
    if (this.pendingRequest.has(requestKey)) {
      this.removeRequestKey(requestKey);
      source.cancel('double request：' + requestKey);
    } else {
      this.pendingRequest.set(requestKey, source);
    }
  }

  removeRequestKey(requestKey) {
    setTimeout(() => {
      this.pendingRequest.delete(requestKey);
    }, 200);
  }
}
