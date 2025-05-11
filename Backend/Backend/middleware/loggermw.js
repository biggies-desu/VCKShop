const logger = (req, res, next) => {
    const now = new Date().toISOString();
    console.log(`[${now}] ${req.method} request to ${req.url}`);
    next(); // Pass control to the next middleware/route
};

module.exports = logger;