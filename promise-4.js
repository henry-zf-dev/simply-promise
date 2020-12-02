// 添加状态判断

class Promise {
  callbacks = [];
  status = 'pending';
  value = null;

  constructor(fn) {
    fn(this._resolve.bind(this));
  }

  then(onFulfilled) {
    if (this.status === 'pending') {
      this.callbacks.push(onFulfilled);
    } else {
      onFulfilled(this.value);
    }
    return this;
  }

  _resolve(value) {
    this.status = 'fulfilled';
    this.value = value;
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

setTimeout(() => {
  p.then(tip => {
    console.log('##### tip3 #####', tip);
  });
}, 4000);
