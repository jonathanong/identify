
const debug = require('debug')('jongleberry:identify')
const { exec } = require('child_process')

class Identify {
  constructor (options = {}) {
    this.sharp_enabled = options.sharp !== false
    this.imagemagick_enabled = options.imagemagick !== false
  }

  get sharp () {
    if (this._sharp != null) return this._sharp
    this._sharp = Identify.detectSharp()
    return this._sharp
  }

  get imagemagick () {
    if (this._imagemagick) return this._imagemagick
    this._imagemagick = Identify.detectImageMagick()
    return this._imagemagick
  }

  async identify (filename) {
    if (this.sharp_enabled && this.sharp) return ['sharp', await this.identifySharp(filename)]
    if (this.imagemagick_enabled && await this.imagemagick) return ['imagemagick', await this.identifyImageMagick(filename)]
    throw new Error('No supported image identification methods.')
  }

  identifySharp (filename) {
    return this.sharp(filename).metadata()
  }

  identifyImageMagick (filename) {
    return new Promise((resolve, reject) => {
      exec(`convert ${filename} json:`, (err, stdout) => {
        if (err) return reject(err)
        debug('convert stdout: %s', stdout)
        try {
          let data = JSON.parse(stdout)
          if (Array.isArray(data)) [data] = data
          resolve(data)
        } catch (err) {
          reject(err)
        }
      })
    })
  }

  normalize (...args) {
    return Identify.normalize(...args)
  }

  isNotAnImageError (err) {

  }
}

Identify.detectSharp = () => {
  try {
    return require('sharp')
  } catch (_) {
    return false
  }
}

Identify.detectImageMagick = () => new Promise(resolve => exec('convert --version', err => resolve(!err)))

// normalizes to sharp's format
Identify.normalize = ([type, result]) => {
  if (type === 'sharp') {
    return {
      format: result.format,
      width: result.width,
      height: result.height,
      space: result.space,
      hasAlpha: result.hasAlpha,
    }
  }
  if (type === 'imagemagick') {
    return {
      format: result.image.format.toLowerCase(),
      width: result.image.geometry.width,
      height: result.image.geometry.height,
      space: result.image.colorspace.toLowerCase(),
      hasAlpha: !!result.image.channelDepth.alpha,
    }
  }

  throw new Error('Unknown result type, must be imagemagick or sharp.')
}

module.exports = Identify
