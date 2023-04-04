import { format } from 'timeago.js';

const timeago = {};

timeago.timeago = (timestamp) => {
    return format(timestamp)
}

export default timeago