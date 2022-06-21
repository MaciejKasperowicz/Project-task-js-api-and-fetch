class ExcursionsAPI {
    constructor(dataBase) {
        this.url = "http://localhost:3000/";
        this.dataBase = dataBase
    }

    loadData(database) {
        return this._fetch(database)
    }

    addData(data, database) {
        const options = {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" }
        };
        return this._fetch(database, options);
    }

    removeData(database, id = "") {
        const options = {
            method: "DELETE"
        }
        return this._fetch(database, options, `/${id}`);
    }


    updateData(id, data, database) {
        const options = {
            method: "PUT",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" }
        };

        return this._fetch(database, options, `/${id}`);
    }

    _fetch(database, options, additionalPath = "") {
        const url = `${this.url}${database}${additionalPath}`;
        return fetch(url, options)
            .then(resp => {
                if (resp.ok) { return resp.json(); }
                return Promise.reject(resp);
            });
    }


}

export default ExcursionsAPI;