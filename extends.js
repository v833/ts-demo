function Person(name, age) {
  this.name = name
  this.age = age
}

Person.prototype.say = function () {
  console.log(this.name)
}

function Child(name, age) {
  Person.call(this, name, age)
}

Child.prototype = Object.create(Person.prototype)

Child.prototype.constructor = Child
