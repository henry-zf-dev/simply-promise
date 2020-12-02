// 添加延时机制

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
    setTimeout(() => {
      this.callbacks.forEach(fn => fn(value));
    });
  }
}

const p = new Promise(function (resolve) {
  resolve('立即执行');
});

p.then(tip => {
  console.log('##### tip1 #####', tip);
}).then(tip => {
  console.log('##### tip2 #####', tip);
});
