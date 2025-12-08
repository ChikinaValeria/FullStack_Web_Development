// logger.js

export const logger = (req, res, next) => {
    const startTime = Date.now();

    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const ip = req.ip;

    console.log(`[REQUEST] ${method} ${url} from IP: ${ip}`);

    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
        console.log('Request Body:', req.body);
    }

    // set the 'finish' event listener on the response object
    res.on('finish', () => {
        const endTime = Date.now();

        const duration = endTime - startTime; // execution time in milliseconds
        const statusCode = res.statusCode;

        console.log(`[RESPONSE] ${method} ${url} - Status: ${statusCode} (${duration}ms)`);
    });

    next();
};