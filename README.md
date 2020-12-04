# @jongleberry/identify

[![Node.js CI](https://github.com/jonathanong/identify/workflows/Node.js%20CI/badge.svg?branch=master)](https://github.com/jonathanong/identify/actions?query=workflow%3A%22Node.js+CI%22+branch%3Amaster+event%3Apush)
[![codecov](https://codecov.io/gh/jonathanong/identify/branch/master/graph/badge.svg?token=5wtDORuxKg)](https://codecov.io/gh/jonathanong/identify)

A tiny image identification service:

- Uses `libvips` via `sharp` if available
- Falls back to ImageMagick
- Errors if neither exist

## API

```js
const IdentifyService = require('@jongleberry/identify')

const identifyService = new IdentifyService({
  // defaults, no need to set these
  sharp: true,
  imagemagick: true, 
})

const filename = 'some-image.png'

try {
  const result = await identifyService.identify(filename)
  // ['imagemagick', {}]
  // ['sharp', {}]

  const metadata = await identifyService.normalize(result)
  // { width, height, ... }
} catch (err) {
  if (identifyService.isNotAnImageError(err)) throw new Error(`${filename} is not an image.`)
  throw err
}
```
