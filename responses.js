const response = (statusCode, data , message, res, pagenation = null) => {
    res.status(statusCode).json({
        payload: {
            status_code: statusCode,
            data: data,
            message: message
        },
        pagenation: pagenation
    });
};

module.exports = response;