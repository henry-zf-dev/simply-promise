// 简单链式调用

class Promise {
  callbacks = [];

  constructor(fn) {
    fn(this._resolve.bind(this));
  }

  then(onFulfilled) {
    this.callbacks.push(onFulfilled);
    return this;
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

p.then(tip => {
  console.log('##### tip1 #####', tip);
}).then(tip => {
  console.log('##### tip2 #####', tip);
});
