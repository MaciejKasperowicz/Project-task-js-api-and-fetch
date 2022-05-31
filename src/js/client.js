// import { cli } from 'webpack';
import './../css/client.css';

import ExcursionsAPI from './ExcursionsAPI';
// console.log('client');
const excursionsAPI = new ExcursionsAPI("excursions");

class Client {
    constructor(api) {
        this.apiService = api;
        // this.base = "excursions";
        this.excursionsItemPrototype = document.querySelector(".excursions__item--prototype");
        this.summaryItemPrototype = document.querySelector(".summary__item--prototype");
        this.excursionsDB = "excursions";
        this.summaryDB = "summary";
        this.ordersDB = "orders"
    }
    loadExcursions() {
        this.apiService.loadData(this.excursionsDB)
            .then(data => this.insertExcursions(data))
            .catch(err => console.error(err));

    }
    // loadSummary() {
    //     this.apiService.loadData(this.summaryDB)
    //         .then(data => this.insertSummaryItems(data))
    //         .catch(err => console.error(err))
    //         .finally(() => this._updateTotalPrice());
    // }

    insertExcursions(data) {
        // console.log(data)
        const excursionsUl = this._findElement(".excursions");

        this._clearElement(excursionsUl);
        // this._createExcursion(data, excursionsUl);
        data.forEach(element => {
            // console.log(element)
            const excursion = this._createExcursion(element);
            excursionsUl.appendChild(excursion)
        })
    }

    // insertSummaryItems(data) {
    //     console.log(data)
    //     const summaryUl = this._findElement(".summary");

    //     this._clearElement(summaryUl);
    //     // this._createExcursion(data, excursionsUl);
    //     data.forEach(element => {
    //         // console.log(element)
    //         const summaryItem = this._createSummaryItem(element);
    //         summaryUl.appendChild(summaryItem)
    //     })
    // }

    _createExcursion(element) {
        // data.forEach(element => {
        const excursionsItem = this.excursionsItemPrototype.cloneNode(true);
        // console.log(excursionsItem)
        excursionsItem.classList.remove("excursions__item--prototype");
        const excTitleEl = excursionsItem.querySelector(".excursions__title");
        const excDescriptionEl = excursionsItem.querySelector(".excursions__description");
        const excPriceAdultEl = excursionsItem.querySelector(".excursion__price-adult");
        const excPriceChildEl = excursionsItem.querySelector(".excursion__price-child");

        excursionsItem.dataset.id = element.id;
        excTitleEl.textContent = element.title;
        excDescriptionEl.textContent = element.description;
        excPriceAdultEl.textContent = element.priceAdult;
        excPriceChildEl.textContent = element.priceChild;

        return excursionsItem
    };

    _findElement(selector, from = document) {
        // return document.querySelector(".excursions");
        return from.querySelector(selector);
    }

    _clearElement(element) {
        element.innerHTML = "";
        // element.appendChild(this.excursionsItemPrototype);
    }

    _createSummaryItem(element) {
        console.log(element)
        const summaryItem = this.summaryItemPrototype.cloneNode(true);
        summaryItem.classList.remove("summary__item--prototype");
        const sumNameEl = summaryItem.querySelector(".summary__name");
        const sumTotalPriceEl = summaryItem.querySelector(".summary__total-price");
        const sumRemoveBtnEl = summaryItem.querySelector(".summary__btn-remove");
        const adultQuantityEl = summaryItem.querySelector(".quantity--adult");
        const childQuantityEl = summaryItem.querySelector(".quantity--child");
        const priceAdultEl = summaryItem.querySelector(".price--adult");
        const priceChildEl = summaryItem.querySelector(".price--child");

        const totalPrice = element.quantityAdult * element.priceAdult + element.quantityChild * element.priceChild;

        summaryItem.dataset.id = element.id;
        summaryItem.dataset.title = element.title;
        summaryItem.dataset.adultQuantity = element.quantityAdult;
        summaryItem.dataset.childQuantity = element.quantityChild;
        summaryItem.dataset.priceAdult = element.priceAdult;
        summaryItem.dataset.priceChild = element.priceChild;
        summaryItem.dataset.totalPrice = totalPrice;
        sumRemoveBtnEl.dataset.id = element.id;

        sumNameEl.textContent = element.title;
        adultQuantityEl.textContent = element.quantityAdult;
        childQuantityEl.textContent = element.quantityChild;
        priceAdultEl.textContent = element.priceAdult;
        priceChildEl.textContent = element.priceChild;
        sumTotalPriceEl.textContent = totalPrice;

        return summaryItem
    }


    addExcursionsToSummary() {
        const excursionsUl = this._findElement(".excursions");
        // console.log(excursionsUl);
        const summaryUl = this._findElement(".summary");
        this._clearElement(summaryUl);
        let excID = 0;

        excursionsUl.addEventListener("click", (e) => {
            e.preventDefault();
            const targetEl = e.target;
            console.log(e.target)
            const isAddBtn = this._isElementType(targetEl, "submit");
            if (isAddBtn) {
                // const id = this._getItemFromRoot(targetEl);
                const itemRoot = this._findItemRoot(targetEl);
                console.log(itemRoot)
                const inputsRoot = itemRoot.querySelectorAll("input");
                // console.log(inputsRoot)
                // const [priceAdult, priceChild] = inputsRoot;
                // console.log(priceAdult, priceChild)
                const inputsToFill = [...inputsRoot].filter(input => {
                    if (input.type === "number") return input
                })
                console.log(inputsToFill)
                const isValid = this._validateExcursionsInputs(inputsToFill);
                console.log(isValid)

                if (isValid) {
                    const summaryUl = this._findElement(".summary");
                    // const excID = itemRoot.dataset.id;
                    const excTitle = this._findElement(".excursions__title", itemRoot);
                    const excPriceAdult = this._findElement(".excursion__price-adult", itemRoot);
                    const excPriceChild = this._findElement(".excursion__price-child", itemRoot);
                    const [excQuantityAdult, excQuantityChild] = inputsToFill.map(input => input.value);

                    const element = {
                        id: excID++,
                        title: excTitle.textContent,
                        priceAdult: excPriceAdult.textContent,
                        priceChild: excPriceChild.textContent,
                        quantityAdult: excQuantityAdult ? excQuantityAdult : 0,
                        quantityChild: excQuantityChild ? excQuantityChild : 0
                    }

                    const summaryItem = this._createSummaryItem(element);
                    summaryUl.appendChild(summaryItem);
                    // excQuantityAdult.value = "";
                    // excQuantityChild.value = "";
                    inputsToFill.map(input => input.value = "")
                    this._updateTotalPrice();

                    // const data = {
                    //     title: excTitle.textContent, priceAdult: excPriceAdult.textContent, priceChild: excPriceChild.textContent,
                    //     quantityAdult: excQuantityAdult ? excQuantityAdult : 0,
                    //     quantityChild: excQuantityChild ? excQuantityChild : 0
                    // }
                    // this.apiService.addData(data, this.summaryDB)
                    //     .catch(err => console.error(err))
                    //     .finally(() => this.loadSummary());
                }
            }
        })
    }


    removeExcursionsFromSummary() {
        const excursionsUl = this._findElement(".summary");
        excursionsUl.addEventListener("click", (e) => {
            e.preventDefault();
            const targetEl = e.target;
            const isRemoveBtn = this._isElementType(targetEl, "remove");
            // console.log(isRemoveBtn);
            if (isRemoveBtn) {
                const id = targetEl.dataset.id
                // const excursionToRemove = targetEl.parentElement.parentElement;
                const excursionToRemove = excursionsUl.querySelector(`[data-id='${id}']`);
                // console.log(excursionToRemove)
                excursionsUl.removeChild(excursionToRemove);
                // this.apiService.removeData(id, this.summaryDB)
                //     .catch(err => console.error(err))
                //     .finally(() => this.loadSummary());
            }
        })
    }

    _updateTotalPrice() {
        const totalPriceEl = this._findElement(".order__total-price-value");
        const summaryPanel = this._findElement(".summary");
        const summaryItems = summaryPanel.querySelectorAll(".summary__item");
        // console.log(summaryItems)
        const totalPrice = [...summaryItems].reduce((total, element) => total + parseFloat(element.dataset.totalPrice), 0);

        totalPriceEl.textContent = totalPrice;
    }

    addExcursionsToOrders() {
        const orderPanel = this._findElement(".order");
        const [inputName, inputEmail] = orderPanel.elements;
        const inputsToFill = [inputName, inputEmail];


        orderPanel.addEventListener("submit", (e) => {
            e.preventDefault();
            const totalPrice = this._findElement(".order__total-price-value").textContent;
            if (!totalPrice) return
            const isValid = inputsToFill.every(input => this._validateOrdersInputs(input.value, input));
            console.log(isValid);
            if (isValid) {
                const summaryUl = this._findElement(".summary");
                const summaryItems = document.querySelectorAll(".summary__item");

                summaryItems.forEach(item => {
                    const data = this._createDataForOrders(item)

                    this.apiService.addData(data, this.ordersDB)
                        .catch(err => console.error(err));
                });

                this._clearPanelForm(summaryUl, inputsToFill);
            }

        })
    }

    _clearPanelForm(summaryUl, inputsToFill) {
        summaryUl.innerHTML = "";
        inputsToFill.forEach(input => input.value = "")
        this._updateTotalPrice();
    }

    _createDataForOrders(item) {
        const { title, adultQuantity, childQuantity, priceAdult, priceChild, totalPrice } = item.dataset;

        const data = {
            title, adultQuantity, childQuantity, priceAdult, priceChild, totalPrice
        }
        return data
    }

    _validateOrdersInputs(value, input) {
        let re;
        if (input.name === "name") {
            re = /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/;
        } else {
            re = /\S+@\S+\.\S+/;
        }
        return re.test(value);
    }



    _isElementType(element, className) {
        return element.classList.value.includes(className)
    }

    _findItemRoot(targetElement) {
        return targetElement.parentElement.parentElement.parentElement
    }

    _getItemFromRoot(targetElement) {
        return this._findItemRoot(targetElement).dataset.id
    }

    _validateExcursionsInputs(inputsToFill) {
        if (inputsToFill.some(input => {
            return Number.isInteger(Number(input.value)) && Number(input.value) > 0
        })) {
            return true
        } else {
            return false
        }
    }



}

const client = new Client(excursionsAPI);
client.loadExcursions();
// client.loadSummary();
client.addExcursionsToSummary();
client.removeExcursionsFromSummary();
client.addExcursionsToOrders();