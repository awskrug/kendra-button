/**
 * This is just example
 */

/**
 * @name IE11지원
 * @url https://github.com/zeit/next.js/blob/canary/examples/with-polyfills/next.config.js
 * @description IE11포함 모던 웹브라우저의 polyfill 지원하는 코드
 */
require('dotenv').config()
const path = require('path')
const Dotenv = require('dotenv-webpack')
module.exports = {
  webpack: config => {
    const originalEntry = config.entry
    config.plugins = config.plugins || []
    let envs = new Dotenv({
      path: path.join(__dirname, '.env'), // Read the .env file
      systemvars: true,
    })
    const stageName = process.env.STAGE
    Object.assign(envs.definitions, {
      'process.env.REQ_SERVER':
        stageName === 'prod'
          ? `"${process.env.REQ_SERVER_PROD}"`
          : `"${process.env.REQ_SERVER_DEV}"`,
      'process.env.S3_BUCKET':
        stageName === 'prod' ? `"${process.env.S3_BUCKET_PROD}"` : `"${process.env.S3_BUCKET_DEV}"`,
      'process.env.S3_BUCKET_DEV': `"${process.env.S3_BUCKET_DEV}"`,
      'process.env.S3_BUCKET_PROD': `"${process.env.S3_BUCKET_PROD}"`,
    })
    config.plugins.push(envs)
    config.entry = async () => {
      const entries = await originalEntry()
      if (entries['main.js'] && !entries['main.js'].includes('./polyfills.js')) {
        entries['main.js'].unshift('./polyfills.js')
      }
      return entries
    }
    return config
  },
  env: {
    LOCAL: process.env.LOCAL,
    DEV: process.env.DEV,
    STAGE: process.env.STAGE,
  },
}
