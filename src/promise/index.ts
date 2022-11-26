import { Executor, ResolveType, RejestType } from './actionType'

const enum Status {
  PEDDING,
  FULFILLED,
  REJECTED
}

export class MyPromise<T = any> {
  public reoslve!: ResolveType
  public reject!: RejestType
  private status: Status
  public resolveExectorValue: any
  public rejectExectorValue: any
  // 成功状态要执行的函数
  public resolveThenCallbacks: (() => void)[] = []
  public rejectThenCallbacks: (() => void)[] = []

  constructor(exector: Executor) {
    this.status = Status.PEDDING
    this.reoslve = (value: any): any => {
      if (this.status === Status.PEDDING) {
        this.status = Status.FULFILLED
        this.resolveExectorValue = value
        this.resolveThenCallbacks.forEach((cb) => cb())
      }
    }
    this.reject = (value: any): any => {
      if (this.status === Status.PEDDING) {
        this.status = Status.REJECTED
        this.rejectExectorValue = value
      }
    }
    try {
      exector(this.reoslve, this.reject)
    } catch (err) {
      this.status = Status.PEDDING
      this.reject(err)
      throw new Error('stop')
    }
  }
  then(resolveInthen: ResolveType, rejectInthen?: RejestType) {
    return new MyPromise((resolve, reject) => {
      let result: any
      // console.log('this', this)
      if (this.status === Status.FULFILLED) {
        result = resolveInthen(this.resolveExectorValue)
        resolve(result)
      }
      if (rejectInthen && this.status === Status.REJECTED) {
        result = rejectInthen(this.rejectExectorValue)
        reject(result)
      }
      if (this.status === Status.PEDDING) {
        console.log('padding')
        this.processManyAsyncAndSync(resolveInthen, resolve)
      }
    })
  }
  catch(rejectInCatch: RejestType) {
    if (this.status === Status.REJECTED) {
      rejectInCatch(this.rejectExectorValue)
    }
  }
  // 执行多个异步 和 多级 then的处理方法
  processManyAsyncAndSync(resolveInthen: ResolveType, resolve: ResolveType) {
    let result: any
    this.resolveThenCallbacks.push(() => {
      result = resolveInthen(this.resolveExectorValue)

      // 如果是异步的Promise对象
      if (isPromise(result)) {
        // 放入异步队列中, 先执行前一个任务, 可以得到resolveExectorValue
        // 写法1
        // setTimeout(() => {
        //   resolve(result.resolveExectorValue)
        // }, 1000)
        // 写法2
        result.then((resolveSuccess) => {
          resolve(resolveSuccess)
        })
      } else {
        resolve(result)
      }
    })
  }
  static all(promises: MyPromise[]) {
    return new MyPromise((resolve, reject) => {
      const allPromisesValue: any[] = []
      promises.forEach((promise, index) => {
        promise.then(
          (resolveSuccess) => {
            processData(resolveSuccess, index)
          },
          (rejectFail) => {
            reject(rejectFail)
            return
          }
        )
      })
      // 利用索引
      function processData(resolveSuccess: any, index: number) {
        allPromisesValue[index] = resolveSuccess
        if (index === promises.length - 1) {
          resolve(allPromisesValue)
        }
      }
    })
  }
}

function isPromise(val: any): val is MyPromise<any> {
  return isObject(val) && isFunction(val.then)
}

function isObject(val: any): val is Object {
  return typeof val === 'object' && val !== null
}

function isFunction(val: any): val is Function {
  return typeof val === 'function'
}
