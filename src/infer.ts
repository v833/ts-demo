class People {
  name: string
  age: number
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
}

class Child extends People {}

const test1: Extract<Child, People> = new Child('test', 1)
const test2: Exclude<People, string> = new Child('test', 1)

const test3: Omit<Child, 'name'> = new Child('test', 1)
const test4: Pick<Child, 'name' | 'age'> = new Child('test', 1)
const test5: Record<'name' | 'age', string> = { name: 'test', age: '1' }
