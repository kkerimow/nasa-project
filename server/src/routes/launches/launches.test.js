
const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');
const { loadPlanetsData } = require('../../models/planets.model');


describe('Launches API', () => {

    beforeAll(async () => {
        await mongoConnect();
        await loadPlanetsData();
    });

    afterAll(async () => {
        await mongoDisconnect();
    });

    describe('Test Get /launches', () => {
        test('It should respond with 200 success', async () => {
            const response = await request(app)
                .get('/v1/launches')
                .expect('Content-Type', /json/)
                .expect(200);
            // expect(response.statusCode).toBe(200);
        })
    });

    describe('Test Post /launch', () => {

        const completeLaunchData = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-62 f',
            launchDate: 'January 4, 2028'
        };

        const lauchDataWithoutDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-62 f',
        }

        const lauchDataWithInvalidDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-62 f',
            launchDate: 'zoot'
        }

        test('It should respond with 201 created', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);

            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate);

            expect(response.body).toMatchObject(lauchDataWithoutDate);
        });

        test('It shoul catch missing required properties', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(lauchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toStrictEqual({
                error: 'Missing required launch property'
            });
        });

        test('It should catch invalid dates', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(lauchDataWithInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toStrictEqual({
                error: 'Invalid launch date'
            });
        });
    });
})

