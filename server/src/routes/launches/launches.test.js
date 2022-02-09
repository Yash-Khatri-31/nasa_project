const request = require('supertest');
const app = require('../../app');

describe('Test GET/launches', () => {
    test('Should return 200 success',async () => {
        const response = await request(app)
            .get('/launches')
            .expect('Content-Type',/json/)
            .expect(200);
        // expect(response.statusCode).toBe(200) // supertest gives it own easier format
    })
})

describe('Test POST/launches', () => {
    const launchData = {
        mission:'USS',
        target:'Kepler',
        launchDate:'January 4, 2023',
        rocket:'NCC'
    }
    const launchDataNoDate = {
        mission:'USS',
        target:'Kepler',
        rocket:'NCC'
    }
    const launchDatawithInvalidDate = {
        mission:'USS',
        target:'Kepler',
        rocket:'NCC',
        launchDate:'hola'
    }
    const launchDataInvalidInput = {
 
        target:'Kepler',
        rocket:'NCC',
        launchDate:'January 27, 2034'
    }
    test('Should return 201 created',async () => {
        const response = await request(app)
        .post('/launches')
        .send(launchData)
        .expect('Content-Type',/json/)
        .expect(201);

    const requestDate = new Date(launchData.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();

    expect(requestDate === responseDate);
    expect(response.body).toMatchObject(launchDataNoDate); //we are making checks without the date so we dont get the date error
    });

    test('Should check invalid input',async () => {
        const response = await request(app)
        .post('/launches')
        .send(launchDataInvalidInput)
        .expect('Content-Type',/json/)
        .expect(400)
    expect(response.body).toStrictEqual({
        err:'Missing required Mission'
        })
    });
    test('Check invalid date input ', async () => {
        const response = await request(app)
        .post('/launches')
        .send(launchDatawithInvalidDate)
        .expect('Content-Type',/json/)
        .expect(400);
    expect(response.body).toStrictEqual({
        err:"Invalid launch date"
        })
    });
})