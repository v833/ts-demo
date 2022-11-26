interface Action<T> {
  payload?: T
  type: string
}

type delayFunc2 = (input: Promise<number>) => Promise<Action<string>>
type delayFunc = EffectModule['delay']
//type delayFunc3= M extends (input: Promise<T>) => Promise<Action<U>>

class EffectModule {
  count = 1
  message = 'hello!'

  delay(input: Promise<number>): Promise<Action<string>> {
    return input.then((i) => ({
      payload: `hello ${i}!`,
      type: '下单'
    }))
  }

  setMessage(action: Action<Date>) {
    return {
      payload: action.payload!.getMilliseconds(),
      type: 'set-message'
    }
  }
}
// 已知条件：
type asyncMethod<T, U> = (input: Promise<T>) => Promise<Action<U>>
type asyncMethodConnect<T, U> = (input: T) => Action<U>

type syncMethod<T, U> = (action: Action<T>) => Action<U>
type syncMethodConnect<T, U> = (action: T) => Action<U>

// 第一步：获取函数名组成的联合类型。
type MethodNameType<T> = {
  [F in keyof T]: T[F] extends Function ? F : never
}[keyof T] // 增加了[keyof T]的目的 表示获取冒号后面的函数名[F]组成的联合类型

// 测试： 结果为"delay" | "setMessage"
type MethodNameUnionType = MethodNameType<EffectModule>

// 第二步：声明 dispatchType 类型
// 详细理解：
type dispatchType<M> = M extends asyncMethod<infer T, infer U>
  ? asyncMethodConnect<T, U>
  : M extends syncMethod<infer T, infer U>
  ? syncMethodConnect<T, U>
  : never

// 第三步：分派结果：
//  其中：EffectModule[methodName] 来获取方法类型
//  理解： dispatchType< EffectModule["delay"]>
// EffectModule["delay"]=(input: Promise<T>) => Promise<Action<U>>
// 如果M extends asyncMethod<infer V, infer W> 泛型约束成立
// 那么dispatchType就是asyncMethodConnect类型

//  理解： dispatchType<EffectModule["setMessage"]>
//  EffectModule["setMessage"]=(input: Action<T>) => Action<U>>
//  extends syncMethod<infer V, infer W> 泛型约束成立
// dispatchType就是syncMethodConnect<V, W>类型
// 如果还不成立，就直接返回never

// 4.通用化
type DispatchResultComm<T> = {
  [methodName in MethodNameType<T>]: dispatchType<T[methodName]>
}
type ResultType = DispatchResultComm<EffectModule>

let result: ResultType = {
  delay(input: number): Action<string> {
    return {
      payload: `hello!`,
      type: '下单'
    }
  },
  setMessage(action: Date) {
    return {
      payload: action.getMilliseconds(),
      type: 'set-message'
    }
  }
}
export {}
