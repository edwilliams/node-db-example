const fs = require('fs')
const util = require('util')
const parse = require('csv-parse/lib/sync')
const stringify = util.promisify(require('csv-stringify'))
const { v4: uuidv4 } = require('uuid')

const dhHead = {
  id: 'id',
  nonce: 'nonce',
  email: 'email'
}

/**
 * Get all users
 * @function
 */
const __getAllUsers = () => {
  return new Promise((resolve, reject) => {
    const data = fs.readFileSync('./db.csv', 'utf8')

    const records = parse(data, {
      columns: true,
      skip_empty_lines: true
    })

    resolve(records)
  })
}

/**
 * Create user
 * @function
 * @param {Object} data.email - name of user
 * @param {Object} data.nonce - used as one time password (OTP)
 */
const _create = ({ email, nonce }) => {
  return new Promise(async (resolve, reject) => {
    const users = await __getAllUsers()

    users.push({ id: uuidv4(), nonce, email })

    const rows = await stringify([dhHead, ...users])
    fs.writeFileSync('./db.csv', rows)

    resolve()
  })
}

/**
 * Get user
 * @function
 * @param {string} email - name of user
 */
const _get = email => {
  return new Promise(resolve => {
    const data = fs.readFileSync('./db.csv', 'utf8')

    const records = parse(data, {
      columns: true,
      skip_empty_lines: true
    })

    const user = records.find(record => record.email === email)

    resolve(user)
  })
}

/**
 * Update user
 * @function
 * @param {string} userId - id of user
 * @param {Object} opts.nonce - nonce sent to user
 */
const _update = (userId, { nonce }) => {
  return new Promise(async (resolve, reject) => {
    const users = await __getAllUsers()

    users.forEach(user => {
      if (user.id === userId) user.nonce = nonce
    })

    const rows = await stringify([dhHead, ...users])
    fs.writeFileSync('./db.csv', rows)

    resolve()
  })
}

/**
 * Delete user
 * @function
 * @param {string} email - name of user
 */
const _delete = email => {
  return new Promise((resolve, reject) => {
    // todo: delete user
    resolve(null)
  })
}

module.exports = {
  _create,
  _get,
  _update,
  _delete
}
