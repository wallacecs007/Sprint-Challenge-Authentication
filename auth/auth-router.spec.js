const server = require('../api/server.js')
const db = require('../database/dbConfig.js')
const request = require('supertest')
const users = require('../users/users-model.js')

beforeEach(async () => {
    await db.seed.run()
})

describe('users model', () => {
    test('list', async() => {
        const res = await users.list()
        expect(res.length).toBeGreaterThan(0)
    })
})

describe('register user', () => {

    it('should return 201', async () => {
        const res = await request(server)
            .post('/api/auth/register')
            .send({username: 'test', password: 'test123'})

        expect(res.status).toBe(201)
    })

    it('should return user', async () => {
        const res = await request(server)
            .post('/api/auth/register')
            .send({username: 'test', password: 'test123'})

        expect(res.body.user).toBeTruthy()
    })

})

describe('login user', () => {

    it('should return token', async() => {
        const res = await request(server)
            .post('/api/auth/login')
            .send({username: 'test', password: 'test123'})

        expect(res.body.token).toBeTruthy()
    })

    it('should return 200', async() => {
        const res = await request(server)
            .post('/api/auth/login')
            .send({username: 'test', password: 'test123'})

        expect(res.status).toBe(201)
    })

})