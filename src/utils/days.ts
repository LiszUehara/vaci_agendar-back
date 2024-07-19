import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';

if(relativeTime){   
    dayjs.extend(relativeTime);
}

export function resetMinutes(date: dayjs.ConfigType) {
    return dayjs(date).set('minute', 0).set('second', 0).set('millisecond', 0).toDate()
}
export function getStartDateTimeDay(date: dayjs.ConfigType) {
    return dayjs(date).set('hour', 0).toISOString()
}
export function getEndDateTimeDay(date: dayjs.ConfigType) {
    return dayjs(date).set('hour', 23).set('minute', 59).set('second', 59).toISOString()
}

export default dayjs;