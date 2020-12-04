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
    // 如果 then 中没有写回调函数
    // 则把当前 promise 的 value 通过调用下一个 promise 的 resolve(this.value) 传递下去
    if (!callback.onFulfilled) {
      callback.resolve(this.value);
      return;
    }
    const ret = callback.onFulfilled(this.value);
    callback.resolve(ret);
  }

  _resolve(value) {

    // *****
    // 如果 value 也是一个 promise 对象
    // 那么需要在 value 的 then() 之后，执行当前 promise 的 resolve 逻辑
    // 这样就实现了当前 promise 的 onFulfilled 回调函数的执行时机依赖于它上一个 promise 的 onFulfilled 返回值的 promise 状态
    // 从而实现多个异步操作进行同步的有顺序的执行
    if (value && (typeof value === 'object' || typeof value === 'function')) {
      const then = value.then;
      if (typeof then === 'function') {
        then.call(value, this._resolve.bind(this));
        return;
      }
    }

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

const p = new Promise(resolve => {
  mockAjax('getUserId', 1, result => {
    resolve(result);
  });
});

const pThen1 = p.then(result => {
  console.log('##### result1 #####', result);
  return '前缀' + result;
});

p.then(result => {
  console.log('##### result2 #####', result);
  console.log('\n');
  return '前缀' + result;
});

const pThen2 = pThen1.then(result => {
  console.log('##### result3 #####', result);
  return result + '后缀';
});

pThen2.then(result => {
  console.log('##### result4 #####', result);
});

// onFulfilled 回调的返回值也是一个 promise 的真实情景模拟
// 实现多个异步请求的同步顺序执行
const apiHdl = (params = {}, callback) => {
  const {url = '', time} = params;
  setTimeout(() => {
    switch (url) {
      case 'getRoomList':
        callback([
          {roomId: 1, name: '房间A'},
          {roomId: 2, name: '房间B'}
        ]);
        break;
      case 'getRoomDetail':
        callback({
          roomId: 1,
          name: '房间A',
          location: '深圳南山',
          capacity: 10
        });
        break;
      default:
        break;
    }
  }, 1000 * time);
};

const getRoomList = () => {
  return new Promise(resolve => {
    apiHdl({url: 'getRoomList', time: 2}, result => {
      resolve(result);
    });
  });
};

const getRoomDetail = (roomId) => {
  return new Promise(resolve => {
    apiHdl({url: 'getRoomDetail', roomId, time: 1}, result => {
      resolve(result);
    });
  });
};

getRoomList().then(roomList => {
  console.log('##### roomList #####', roomList);
  const room = roomList[0] || {};
  return getRoomDetail(room.roomId || '');
}).then(roomDetail => {
  console.log('##### roomDetail #####', roomDetail);
});