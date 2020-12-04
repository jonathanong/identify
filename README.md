# @jongleberry/identify

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
