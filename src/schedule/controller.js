class ScheduleController {
    constructor(app, data) {

        app.get('/api/schedule', function (request, response) {
            return data.getScheduleSet().then(function (scheduleSet) {
                response.status(200).json(scheduleSet);
            })
        })

        app.get('/api/schedule/:id', function (request, response) {
            let id = request.params.id;
            return data.getScheduleAsync(id).then(function (schedule) {
                if (schedule) {
                    response.status(200).json(schedule);
                } else response.status(404).json('Unknown schedule id ' + id);
            })
        })

        app.get('/api/next-order-date', function (request, response) {
            return data.getNextOrderingDate().then(function (schedule) {
                if (schedule) {
                    response.status(200).json(schedule);
                } else response.status(404).json('Error');
            })
        })

        app.put('/api/schedule/:id', function (request, response) {
            let newSchedule = request.body;
            if (newSchedule.start % 15 !== 0 || newSchedule.end % 15 !== 0) {
                response.status(400).json('Start and/or end not a multiple of 15');
            }
            else return data.updateScheduleAsync(newSchedule).then(function (schedule) {
                if (schedule) {
                    response.location('/api/schedule').status(201).json({
                        key: 'entity.updated'
                    });
                } else response.status(404).json('Unknown schedule id ' + request.body.scheduleId);
            })
        })

        app.put('/api/schedule/', function (request, response) {
            let newSchedule = request.body;
            return data.updateScheduleSetAsync(newSchedule).then(function (schedule) {
                if (schedule) {
                    response.location('/api/schedule').status(201).json({
                        key: 'entity.updated'
                    });
                } else response.status(404).json('Error');
            })
        })

        app.post('/api/schedule', function (request, response) {
            let newSchedule = request.body;
            if (newSchedule.start % 15 !== 0 || newSchedule.end % 15 !== 0) {
                response.status(400).json('Start and/or end not a multiple of 15');
            }
            else return data.addScheduleAsync(newSchedule).then(function (schedule) {
                if (schedule) {
                    response.location('/api/schedule').status(201).json({
                        key: 'entity.added'
                    });
                } else response.status(404).json('Unknown schedule id ' + request.body.scheduleId);
            })
        })
    }
}

module.exports = ScheduleController;