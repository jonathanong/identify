const assert = require('assert')
const path = require('path')

const Identify = require('..')

const fixtures = [
  'fixtures/download.sh',
  'LICENSE',
  'package.json',
  'src/index.js'
]

fixtures.forEach((fixture) => {
  describe(fixture, () => {
    test('imagemagick', async () => {
      const service = new Identify({
        sharp: false,
        imagemagick: true
      })

      try {
        await service.identify(path.resolve(fixture))
        throw new Error('boom')
      } catch (err) {
        assert(service.isNotAnImageError(err), err)
      }
    })

    test('sharp', async () => {
      const service = new Identify({
        sharp: true,
        imagemagick: false
      })

      try {
        await service.identify(path.resolve(fixture))
        throw new Error('boom')
      } catch (err) {
        assert(service.isNotAnImageError(err), err)
      }
    })
  })
})
