const assert = require('assert')
const path = require('path')

const Identify = require('..')

const fixtures = [
  'girl.png',
  'text2.png'
]

fixtures.forEach((fixture) => {
  test(fixture, async () => {
    const sharpResult = await new Identify({
      sharp: true,
      imagemagick: false
    }).identify(path.resolve(`fixtures/${fixture}`))

    const imagemagickResult = await new Identify({
      sharp: false,
      imagemagick: true
    }).identify(path.resolve(`fixtures/${fixture}`))

    assert.deepStrictEqual(Identify.normalize(sharpResult), Identify.normalize(imagemagickResult))
  })
})
