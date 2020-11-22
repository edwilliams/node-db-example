const Airtable = require('airtable')
const { config } = require('process')
const { v4: uuidv4 } = require('uuid')
const config = require('./config')

Airtable.configure({
  endpointUrl: config.endpointUrl,
  apiKey: config.apiKey
})

const base = Airtable.base(config.base)

// todo: understand pagination
const __getAllUsers = () => {
  return new Promise((resolve, reject) => {
    base('pages')
      .select({
        // Selecting the first 3 records in main:
        // maxRecords: 3,
        view: 'main'
      })
      .eachPage(
        (records, fetchNextPage) => {
          // This function (`page`) will get called for each page of records.

          resolve(records)
          // records.forEach(record => {
          //   console.log('Retrieved', record.get('email'))
          // })

          // To fetch the next page of records, call `fetchNextPage`.
          // If there are more records, `page` will get called again.
          // If there are no more records, `done` will get called.
          fetchNextPage()
        },
        err => {
          if (err) {
            console.error(err)
            reject(err)
          }
        }
      )
  })
}

const _create = ({ email, nonce }) => {
  return new Promise((resolve, reject) => {
    base('pages').create(
      [
        {
          fields: {
            id: uuidv4(),
            email,
            nonce
          }
        }
      ],
      function (err, records) {
        if (err) {
          console.error(err)
          return
        }
        records.forEach(function (record) {
          console.log(record.getId())
        })
      }
    )

    resolve()
  })
}

const _get = async email => {
  const users = await __getAllUsers()
  return users.find(({ fields }) => fields.email === email)
}

const _update = (userId, { nonce }) => {
  return new Promise((resolve, reject) => {
    base('pages').update(
      [
        {
          id: '12345',
          fields: {
            id: userId,
            email: 'bob@example.com',
            nonce
          }
        }
      ],
      function (err, records) {
        if (err) {
          console.error(err)
          reject(err)
          return
        }
        records.forEach(function (record) {
          console.log(record.get('id'))
        })
      }
    )
    resolve()
  })
}

const _delete = email => {
  return new Promise(async (resolve, reject) => {
    const user = await _get(email)
    console.log(user)
    base('pages').destroy([user.id], function (err, deletedRecords) {
      if (err) {
        console.error(err)
        reject(err)
        return
      }
      // console.log('Deleted', deletedRecords.length, 'records')
      resolve()
    })
  })
}

// __getAllUsers()
// const { fields } = await _get('wanda@example.com')
// _create({ email: 'wanda@example.com', nonce: '' })
// _update('6dba9098-cd5b-4864-8eef-5c2ca8399830', { nonce: '456' })
// _delete('wanda@example.com')

module.exports = {
  _create,
  _get,
  _update,
  _delete
}
