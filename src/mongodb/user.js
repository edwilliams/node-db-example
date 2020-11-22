const { get } = require('./')

const COLLECTION = 'users'

// const getAllUsers = () => {
//   return new Promise((resolve, reject) => {
//     get()
//       .collection(COLLECTION)
//       .find() // .find(query, { projection })
//       // .limit(5)
//       .sort({ name: 1 })
//       .toArray((err, result) => {
//         if (err) reject(err)
//         resolve(result)
//       })
//   })
// }

/**
 * Create user
 * @function
 * @param {Object} data.email - name of user
 * @param {Object} data.nonce - used as one time password (OTP)
 */
const _create = ({ email, nonce }) => {
  return new Promise((resolve, reject) => {
    // NB mongo assigns unique `_id` unless specified
    // more: https://www.mongodb.com/blog/post/generating-globally-unique-identifiers-for-use-with-mongodb
    get()
      .collection(COLLECTION)
      // .insertMany(arr, (err, res) => {
      //   if (err) reject(err)
      //   resolve('Number of documents inserted: ' + res.insertedCount)
      // })
      .insertOne({ email, nonce }, (err, res) => {
        if (err) reject(err)
        resolve(res.ops)
      })
  })
}

/**
 * Get user
 * @function
 * @param {string} email - name of user
 */
const _get = ({ email }) => {
  return new Promise((resolve, reject) => {
    get()
      .collection(COLLECTION)
      .findOne({ email }, (err, result) => {
        if (err) reject(err)
        resolve(result)
      })
  })
}

/**
 * Update user
 * @function
 * @param {string} email - email of user
 * @param {Object} opts.nonce - nonce sent to user
 */
const _update = (email, { nonce }) => {
  return new Promise((resolve, reject) => {
    const myquery = { email }
    const newVals = { $set: {} } // { $set: { name: 'buzz' } }
    if (nonce !== undefined) newVals.$set.nonce = nonce
    get()
      .collection(COLLECTION)
      // .updateMany(myquery, newVals, (err, res) => {}) // var myquery = { address: /^S/ } // var newVals = { $set: { name: 'Minnie' } }
      .updateOne(myquery, newVals, (err, res) => {
        // if (res.modifiedCount === 0) reject('failed to update - does user was found')
        if (err) reject(err)
        resolve({ success: !!email })
      })
  })
}

/**
 * Delete user
 * @function
 * @param {string} email - name of user
 */
const _delete = ({ email }) => {
  return new Promise((resolve, reject) => {
    get()
      .collection(COLLECTION)
      // .deleteMany()
      .deleteOne({ email }, (err, res) => {
        if (err) reject(err)
        resolve({ success: 'todo' })
      })
  })
}

module.exports = {
  get: _get,
  create: _create,
  update: _update,
  delete: _delete
}
