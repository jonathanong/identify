
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
          resolve(JSON.parse(stdout)[0])
        } catch (err) {
          reject(err)
        }
      })
    })
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

module.exports = Identify
