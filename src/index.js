
const { exec } = require('child_process')

let sharp
try {
  sharp = require('sharp')
} catch (_) {}

class Identify {
  constructor (options = {}) {
    this.vips = options.vips !== false && sharp
    this.imagemagick = options.imagemagick !== false
    Identify.detectImageMagick().then((supported) => {
      if (!supported) this.imagemagick = false
    })
  }

  identify = async (filename) => {
    if (this.vips) return ['vips', await this._identifySharp(filename)]
    if (this.imagemagick) return ['imagemagick', await this._identifyImageMagick(filename)]
    throw new Error('No supported image identification methods.')
  }

  _identifySharp (filename) {

  }

  _identifyImageMagick (filename) {
    return new Promise((resolve, reject) => {
      exec(`convert ${filename} json:`, (err, stdout) => {
        if (err) return reject(err)
        try {
          resolve(JSON.parse(stdout)[0])
        } catch (err) {
          reject(err)
        }
      })
    })
  }
}

Identify.detectImageMagick = () => new Promise(resolve => exec('convert --version', err => resolve(!err)))

module.exports = Identify
