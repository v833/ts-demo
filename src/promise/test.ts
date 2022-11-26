import { MyPromise } from './index'

const p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('set time out')
  }, 1000)
})
  .then((res) => {
    console.log('then:', res)
    return 'ok'
  })
  .then((res) => {
    return new MyPromise((resovle) => {
      setTimeout(() => {
        resovle('ok2')
        console.log('then2:', res)
      }, 1000)
    })
  })
  .then((res) => {
    console.log('then3:', res)
    return 'ok3'
  })
// export {}
