export class LocalStorageFactory {
  static instance: LocalStorageFactory
  // 设置为private 防止外部new
  private constructor() {}

  setItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  getItem(key: string) {
    const result = localStorage.getItem(key)
    return result ? JSON.parse(result) : null
  }

  // 静态方法不可以访问对象属性/实例属性
  static getInstance() {
    if (!this.instance) {
      this.instance = new LocalStorageFactory()
    }
    return this.instance
  }
}

export const myLocal = LocalStorageFactory.getInstance()
