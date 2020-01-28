const bcrypt = require('bcryptjs')

const db = require('../database/dbConfig.js')


function find() {
    // console.log(db('users').select('id', 'username'))
    return db('users').select('id', 'username')
}

function findById(id) {
    return db('users').where({id}).first('id', 'username')
}

function  findBy(filter) {
    return db('users').where(filter).first('id', 'username', 'password')
}

async function add(user) {
    user.password = await bcrypt.hash(user.password, 12)
    const [id] = await db('users').insert(user)
    return findById(id)
}

module.exports = {
    find, findBy, findById, add
}