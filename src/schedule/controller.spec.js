const App = require('../app');
const assert = require('assert');
const request = require('supertest');
const sinon = require('sinon')

let scheduleSet = [
    {"scheduleId": 4523, "day": "SUN", "start": 15, "end": 1425},
    {"scheduleId": 4524, "day": "SAT", "start": 15, "end": 1425},
    {"scheduleId": 4525, "day": "FRI", "start": 15, "end": 1425},
    {"scheduleId": 4526, "day": "THU", "start": 15, "end": 1425},
    {"scheduleId": 4527, "day": "WED", "start": 15, "end": 1425},
    {"scheduleId": 4528, "day": "TUE", "start": 15, "end": 1425},
    {"scheduleId": 4529, "day": "MON", "start": 15, "end": 660},
    {"scheduleId": 4530, "day": "MON", "start": 780, "end": 900}
];
const preparationDelay = 20;
const rushDelay = 10;

describe('Schedule/controller', () => {

    it('GET /api/random', () => {
        const app = (new App()).app;
        return request(app)
            .get('/api/random')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(404)
            .then(response => {
                assert.equal(response.body.key, 'not.found');
            })
    })

    it('GET /api/schedule', () => {
        const app = (new App()).app;
        return request(app)
            .get('/api/schedule')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .then(response => {
                assert.equal(Object.keys(response.body).length, scheduleSet.length);
            })
    });

    it('GET /api/schedule/4523', () => {
        const app = (new App()).app;
        let schedule = scheduleSet.find(element => element.scheduleId === 4523);
        return request(app)
            .get('/api/schedule/4523')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .then(response => {
                assert.equal(response.body.scheduleId, schedule.scheduleId);
                assert.equal(response.body.day, schedule.day);
                assert.equal(response.body.start, schedule.start);
                assert.equal(response.body.end, schedule.end);
            })
    })

    it('GET /api/schedule/9999999999', () => {
        const app = (new App()).app;
        return request(app)
            .get('/api/schedule/9999999999')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(404)
            .then(response => {
                assert.equal(response.body, 'Unknown schedule id 9999999999');
            })
    })

    it('GET /api/next-order-date should respond with Friday Schedule', () => {
        const app = (new App()).app;
        let clock = sinon.useFakeTimers(new Date('Fri Sep 28 2018 08:00:00 GMT').getTime());
        let date = new Date();
        let schedule = scheduleSet.find(element => element.day === 'FRI');
        let estimatedTime = date.getHours() * 60 + date.getMinutes() + preparationDelay + rushDelay
            + 15 - (date.getHours() * 60 + date.getMinutes() + preparationDelay + rushDelay)%15;
        return request(app)
            .get('/api/next-order-date')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .then(response => {
                assert.equal(response.body.day, schedule.day);
                assert.equal(response.body.minutes, estimatedTime);
            })
    })

    it('GET /api/next-order-date should respond with Saturday Schedule', () => {
        const app = (new App()).app;
        let clock = sinon.useFakeTimers(new Date('Fri Sep 28 2018 21:59:00 GMT').getTime());
        let schedule = scheduleSet.find(element => element.day === 'SAT');
        let estimatedTime = schedule.start + preparationDelay + rushDelay
            + 15 - (schedule.start + preparationDelay + rushDelay)%15;
        return request(app)
            .get('/api/next-order-date')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .then(response => {
                assert.equal(response.body.day, schedule.day);
                assert.equal(response.body.minutes, estimatedTime);
            })
    })

    it('PUT /api/schedule', () => {
        const app = (new App()).app;
        let newSchedule = {
            'scheduleId': 4523,
            'day': 'SUN',
            'start': 150,
            'end': 750
        };
        return request(app)
            .put('/api/schedule/4523')
            .send(newSchedule)
            .expect('Location', '/api/schedule')
            .expect(201)
            .then(response => {
                assert.equal(response.body.key, 'entity.updated')
            })
    })

    it('PUT /api/schedule', () => {
        const app = (new App()).app;
        let newSchedule = {
            'scheduleId': 4523,
            'day': 'SUN',
            'start': 222,
            'end': 750
        };
        return request(app)
            .put('/api/schedule/4523')
            .send(newSchedule)
            .expect(400)
            .then(response => {
                assert.equal(response.body, 'Start and/or end not a multiple of 15')
            })
    })
});