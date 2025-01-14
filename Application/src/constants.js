const environment = {
    address: 'http://localhost',
    port: '5000',

    getFullURL: function () {
        return `${this.address}:${this.port}`;
    }
};

export {environment}