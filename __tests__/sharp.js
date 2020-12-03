const assert = require('assert')
const path = require('path')

const Identify = require('..')

const identify = new Identify({
  sharp: true,
  imagemagick: false,
})

test('girl.png', async () => {
  const [method, result] = await identify.identify(path.resolve('fixtures/girl.png'))
  assert.strictEqual(method, 'sharp')
  assert(result.format)
})
