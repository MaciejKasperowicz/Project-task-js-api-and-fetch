class ExcursionsAPI {
    constructor() {
        // this.excursionsUrl = 'http://localhost:3000/excursions';
        // this.ordersUrl = 'http://localhost:3000/orders';
        this.url = "http://localhost:3000/";
        this.excursions = "excursions";
        this.orders = "orders";
    }

    loadData() {
        return this._fetch()
    }

    addData(data) {
        const options = {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" }
        };
        // console.log(options)
        return this._fetch(options);
    }

    removeData(id) {
        const options = {
            method: "DELETE"
        }
        // return this._fetch(options, "excursions", `/${id}`);
        return this._fetch(options, `/${id}`);

    }

    updateData(id, data) {
        const options = {
            method: "PUT",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" }
        };

        // return this._fetch(options, "excursions", `/${id}`);
        return this._fetch(options, `/${id}`);
    }

    // _fetch(options, base = "excursions", additionalPath = "") {
    _fetch(options, additionalPath = "") {
        // const url = `${this.url}${base}${additionalPath}`;
        const url = `${this.url}${this.excursions}${additionalPath}`;
        return fetch(url, options)
            .then(resp => {
                if (resp.ok) { return resp.json(); }
                return Promise.reject(resp);
            });
    }


}

export default ExcursionsAPI;