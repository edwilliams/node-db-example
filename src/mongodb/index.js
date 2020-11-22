const MongoClient = require('mongodb').MongoClient
const config = require('./config')

let connection = null

const connect = () =>
  new Promise((resolve, reject) => {
    MongoClient.connect(config.mongodb.url, config.mongodb.options, (err, db) => {
      if (err) reject(err)
      connection = db.db(config.mongodb.db)
      resolve()
    })
  })

const get = () => {
  if (!connection) throw new Error('MongoDB Error: call connect first.')
  return connection
}

const createCollection = ({ collection }) => {
  return new Promise((resolve, reject) => {
    get().createCollection(collection, (err, res) => {
      if (err) reject(err)
      resolve('collection created')
    })
  })
}

module.exports = {
  connect,
  get,
  createCollection
}
