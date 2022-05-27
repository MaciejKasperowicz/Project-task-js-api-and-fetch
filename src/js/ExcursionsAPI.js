class ExcursionsAPI {
    constructor(dataBase) {
        // this.excursionsUrl = 'http://localhost:3000/excursions';
        // this.ordersUrl = 'http://localhost:3000/orders';
        this.url = "http://localhost:3000/";
        this.dataBase = dataBase
        // this.excursions = "excursions";
        // this.orders = "orders";
    }

    loadData() {
        return this._fetch(this.dataBase)
    }

    addData(data) {
        const options = {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" }
        };
        // console.log(options)
        return this._fetch(this.dataBase, options);
    }

    removeData(id) {
        const options = {
            method: "DELETE"
        }
        // return this._fetch(options, "excursions", `/${id}`);
        return this._fetch(this.dataBase, options, `/${id}`);

    }

    updateData(id, data) {
        const options = {
            method: "PUT",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" }
        };

        // return this._fetch(options, "excursions", `/${id}`);
        return this._fetch(this.dataBase, options, `/${id}`);
    }

    // _fetch(options, base = "excursions", additionalPath = "") {
    _fetch(base, options, additionalPath = "") {
        // const url = `${this.url}${base}${additionalPath}`;
        const url = `${this.url}${base}${additionalPath}`;
        return fetch(url, options)
            .then(resp => {
                if (resp.ok) { return resp.json(); }
                return Promise.reject(resp);
            });
    }


}

export default ExcursionsAPI;