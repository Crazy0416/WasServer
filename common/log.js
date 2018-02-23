var winston = require('winston');
const tsFormat = () => (new Date()).toLocaleTimeString();
const fs = require('fs');
const path = require('path');
const logDir = path.join(__dirname, '../');

if(!fs.existsSync(logDir)){
    fs.mkdirSync(logDir);
}

var logging = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            timestamp: tsFormat,
            level: 'debug',
            colorize:true
        }),
        new (require('winston-daily-rotate-file'))({
            level: 'debug',
            filename: `${logDir}/-logs.log`,
            timestamp: tsFormat,
            datePattern: 'yyyy-MM-dd',
            prepend:true,
            // maxsize: 1000000,
            // maxFiles: 5
        })
    ]
});

module.exports = logging;