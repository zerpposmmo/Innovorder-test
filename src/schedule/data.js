const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

class Schedule {
    constructor() {
        this.scheduleSet = [
            {"scheduleId": 4523, "day": "SUN", "start": 15, "end": 1425},
            {"scheduleId": 4524, "day": "SAT", "start": 15, "end": 1425},
            {"scheduleId": 4525, "day": "FRI", "start": 15, "end": 1425},
            {"scheduleId": 4526, "day": "THU", "start": 15, "end": 1425},
            {"scheduleId": 4527, "day": "WED", "start": 15, "end": 1425},
            {"scheduleId": 4528, "day": "TUE", "start": 15, "end": 1425},
            {"scheduleId": 4529, "day": "MON", "start": 15, "end": 660},
            {"scheduleId": 4530, "day": "MON", "start": 780, "end": 900}
        ];
        this.preparationDelay = 20;
        this.rushDelay = 10;
    }

    addSchedule(newSchedule) {
        if (newSchedule.start % 15 === 0 || newSchedule.end % 15 === 0) {
            let lastSchedule = this.scheduleSet[Object.keys(this.scheduleSet).sort().pop()];
            if (lastSchedule.day === newSchedule.day) {
                if (lastSchedule.end + this.preparationDelay + this.rushDelay < newSchedule.start) {
                    newSchedule.scheduleId = lastSchedule.scheduleId + 1;
                    this.scheduleSet.push(newSchedule);
                    return this.scheduleSet[Object.keys(this.scheduleSet).sort().pop()];
                }
            }
        }
        return false;
    }

    async addScheduleAsync(newSchedule) {
        return await this.addSchedule(newSchedule);
    }

    async getScheduleAsync(id) {
        return await this.getSchedule(id);
    }

    async getScheduleSet() {
        return await this.scheduleSet;
    }

    async updateScheduleAsync(newSchedule) {
        return await this.updateSchedule(newSchedule)
    }

    async updateScheduleSetAsync(newScheduleSet) {
        return await this.updateScheduleSet(newScheduleSet)
    }

    getSchedule(id) {
        return this.scheduleSet.find(function (element) {
            return element.scheduleId === parseInt(id);
        });
    }

    getScheduleIndex(id) {
        return this.scheduleSet.findIndex(function (element) {
            return element.scheduleId === parseInt(id);
        });
    }


    getScheduleByDay(day) {
        return this.scheduleSet.filter(function (element) {
            return element.day === days[day];
        });
    }

    async getNextOrderingDate() {
        let date = new Date();
        let minutes = date.getHours() * 60 + date.getMinutes();
        let day = date.getDay();
        let daySchedule = this.findDaySchedule(day, minutes);
        if (daySchedule.day === days[day] && minutes >= daySchedule.start) {
            minutes = minutes + this.preparationDelay + this.rushDelay;
        } else minutes = daySchedule.start + this.preparationDelay + this.rushDelay;
        minutes += 15 - minutes % 15;
        return {
            "day": daySchedule.day,
            "minutes": minutes
        }
    }

    findDaySchedule(day, minutes) {
        let daySchedule = this.getScheduleByDay(day);
        if (daySchedule !== undefined) {
            if(minutes === undefined) {
                return daySchedule[daySchedule.length-1];
            }
            for (let i = 0; i < daySchedule.length; i++) {
                if (daySchedule[i].end > (minutes + this.preparationDelay + this.rushDelay)) {
                    return daySchedule[i];
                }
            }
        }
        if(day === 6) {
            return this.findDaySchedule(0);
        }
        return this.findDaySchedule(day+1);
    }

    updateSchedule(newSchedule) {
        let scheduleIndex = this.getScheduleIndex(newSchedule.scheduleId);
        this.scheduleSet[scheduleIndex] = newSchedule;
        return this.scheduleSet[scheduleIndex];
    }

    updateScheduleSet(newScheduleSet) {
        this.scheduleSet = newScheduleSet;
        return this.scheduleSet;
    }
}

module.exports = Schedule;