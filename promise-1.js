// 极简实现

class Promise {
  callbacks = [];

  constructor(fn) {
    fn(this._resolve.bind(this));
  }

  then(onFulfilled) {
    this.callbacks.push(onFulfilled);
  }

  _resolve(value) {
    this.callbacks.forEach(fn => fn(value));
  }
}

const p = new Promise(function (resolve) {
  setTimeout(() => {
    resolve('3秒后执行');
  }, 3000);
});

// 注：then 只是回调函数的注册，真正执行的触发是在 resolve 时
p.then(tip => {
  console.log('##### tip1 #####', tip);
});
