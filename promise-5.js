// 真正的链式调用

class Promise {
  callbacks = [];
  status = 'pending';
  value = null;

  constructor(fn) {
    fn(this._resolve.bind(this));
  }

  then(onFulfilled) {
    return new Promise(resolve => {
      this._handle({
        onFulfilled: onFulfilled || null,
        resolve: resolve
      });
    })
  }

  _handle(callback) {
    if (this.status === 'pending') {
      this.callbacks.push(callback);
      return;
    }
    // 如果 then 中没有传递任何东西
    if (!callback.onFulfilled) {
      callback.resolve(this.value);
      return;
    }
    const ret = callback.onFulfilled(this.value);
    console.log('##### ret #####', ret);
    callback.resolve(ret);
  }

  _resolve(value) {
    this.status = 'fulfilled';
    this.value = value;
    this.callbacks.forEach(callback => this._handle(callback));
  }
}

const mockAjax = (url, time, callback) => {
  setTimeout(() => {
    callback(url + '异步请求耗时' + time + '秒');
  }, 1000 * time);
};

new Promise(function (resolve) {
  mockAjax('getUserId', 1, result => {
    resolve(result);
  });
}).then(result => {
  console.log('##### result1 #####', result);
  return '前缀' + result;
}).then(result => {
  console.log('##### result2 #####', result);
});
