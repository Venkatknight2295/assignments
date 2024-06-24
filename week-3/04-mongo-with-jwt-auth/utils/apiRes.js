class ApiRes {
    constructor(status, message, data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    send(res) {
        res.status(this.status).json({
            status: this.status,
            message: this.message,
            data: this.data,
        });
    }
}

module.exports = ApiRes;