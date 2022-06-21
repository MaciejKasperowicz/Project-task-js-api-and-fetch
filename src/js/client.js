import Common from "./common";


export default class Client extends Common {
    constructor(api) {
        super(api)
        this.summaryItemPrototype = document.querySelector(".summary__item--prototype");
        this.orderItemPrototype = document.querySelector(".order__item--prototype");
        this.ordersDB = "orders"
    }

    removePreviousOrders() {
        this.apiService.loadData(this.ordersDB)
            .then(data => {
                if (data.length) {
                    const ids = data.map(item => item.id);
                    const createPromise = (id) => {
                        const options = {
                            method: "DELETE"

                        }
                        return fetch(`http://localhost:3000/orders/${id}`, options)
                            .then(resp => {
                                if (resp.ok) {
                                    // console.log(resp)
                                    return resp.json();
                                }
                                return Promise.reject(resp);
                            });
                    }
                    Promise.all(ids.map(id => createPromise(id)))
                    this.orders = this.apiService.loadData(this.ordersDB);
                } return
            })
    }


    addExcursionsToOrders() {
        const excursionsUl = this.findElement(".panel__excursions");
        const summaryUl = this.findElement(".summary");
        this.clearElement(summaryUl);

        excursionsUl.addEventListener("click", (e) => {
            e.preventDefault();
            const targetEl = e.target;
            const isAddBtn = this.isElementType(targetEl, "submit");
            if (isAddBtn) {
                const itemRoot = this.findItemRoot(targetEl);
                const inputsRoot = itemRoot.querySelectorAll("input");
                const inputsToFill = [...inputsRoot].filter(input => {
                    if (input.type === "number") return input
                })
                const isValid = this._validateExcursionsInputs(inputsToFill);

                if (isValid) {

                    const excTitle = this.findElement(".excursions__title", itemRoot);
                    const excPriceAdult = this.findElement(".excursion__price-adult", itemRoot);
                    const excPriceChild = this.findElement(".excursion__price-child", itemRoot);
                    const [excQuantityAdult, excQuantityChild] = inputsToFill.map(input => input.value);

                    const totalPrice = excQuantityAdult * excPriceAdult.textContent + excQuantityChild * excPriceChild.textContent;

                    const element = {
                        title: excTitle.textContent,
                        priceAdult: excPriceAdult.textContent,
                        priceChild: excPriceChild.textContent,
                        quantityAdult: excQuantityAdult ? excQuantityAdult : 0,
                        quantityChild: excQuantityChild ? excQuantityChild : 0,
                        totalPrice
                    }

                    this.apiService.addData(element, this.ordersDB)
                        .then(() => this.loadOrders())
                        .catch(err => console.error(err))
                        .then(() => this.clearInputs(inputsToFill))
                }
            }
        })
    }

    loadOrders() {
        this.apiService.loadData(this.ordersDB)
            .then(data => {
                if (data) {
                    this.insertOrders(data)
                }
            })
            .then(() => this._updateTotalPrice())
            .catch(err => console.error(err));
    }

    insertOrders(data) {
        const summaryUl = this.findElement(".summary");

        this.clearElement(summaryUl)
        data.forEach(element => {
            const order = this._createSummaryItem(element)
            summaryUl.appendChild(order)
        })
    }

    _createSummaryItem(element) {
        const summaryItem = this.summaryItemPrototype.cloneNode(true);
        summaryItem.classList.remove("summary__item--prototype");

        const sumNameEl = this.findElement(".summary__name", summaryItem);
        const sumTotalPriceEl = this.findElement(".summary__total-price", summaryItem)
        const sumRemoveBtnEl = this.findElement(".summary__btn-remove", summaryItem);
        const adultQuantityEl = this.findElement(".quantity--adult", summaryItem);
        const childQuantityEl = this.findElement(".quantity--child", summaryItem);
        const priceAdultEl = this.findElement(".price--adult", summaryItem);
        const priceChildEl = this.findElement(".price--child", summaryItem);


        summaryItem.dataset.id = element.id;
        summaryItem.dataset.title = element.title;
        summaryItem.dataset.adultQuantity = element.quantityAdult;
        summaryItem.dataset.childQuantity = element.quantityChild;
        summaryItem.dataset.priceAdult = element.priceAdult;
        summaryItem.dataset.priceChild = element.priceChild;
        summaryItem.dataset.totalPrice = element.totalPrice;
        sumRemoveBtnEl.dataset.id = element.id;

        sumNameEl.textContent = element.title;
        adultQuantityEl.textContent = element.quantityAdult;
        childQuantityEl.textContent = element.quantityChild;
        priceAdultEl.textContent = element.priceAdult;
        priceChildEl.textContent = element.priceChild;
        sumTotalPriceEl.textContent = element.totalPrice;

        return summaryItem
    }



    removeExcursionsFromOrders() {
        const excursionsUl = this.findElement(".summary");
        excursionsUl.addEventListener("click", (e) => {
            e.preventDefault();
            const targetEl = e.target;
            const isRemoveBtn = this.isElementType(targetEl, "remove");
            if (isRemoveBtn) {
                const id = targetEl.dataset.id;
                this.apiService.removeData(this.ordersDB, id)
                    .catch(err => console.error(err))
                    .finally(() => this.loadOrders());
                const excursionToRemove = this.findElement(`[data-id='${id}']`, excursionsUl);
                excursionsUl.removeChild(excursionToRemove);
            }
        })
    }

    _updateTotalPrice() {

        const totalPriceEl = this.findElement(".order__total-price-value");
        const summaryPanel = this.findElement(".summary");
        const summaryItems = summaryPanel.querySelectorAll(".summary__item");
        const totalPrice = [...summaryItems].reduce((total, element) => total + parseFloat(element.dataset.totalPrice), 0);

        totalPriceEl.textContent = totalPrice;
    }


    confirmTheOrder() {
        const orderPanel = this.findElement(".order");
        const [inputName, inputEmail] = orderPanel.elements;
        const inputsToFill = [inputName, inputEmail];
        const summaryUl = this.findElement(".summary");

        orderPanel.addEventListener("submit", (e) => {
            e.preventDefault();
            const totalPrice = this.findElement(".order__total-price-value").textContent;
            const inputNameValue = inputName.value;
            const inputEmailValue = inputEmail.value;
            if (!totalPrice) return
            const isValid = inputsToFill.every(input => this._validateOrdersInputs(input.value, input));
            if (isValid) {

                this.removePreviousOrders();
                this._showModal(this._getModalElements(), totalPrice, inputNameValue, inputEmailValue)
                this._clearPanelForm(summaryUl, inputsToFill);

                const { modal, modalBtn } = this._getModalElements();
                modalBtn.addEventListener("click", () => this._closeModal(modal))
            }
        })
    }

    _getModalElements() {
        const modal = this.findElement(".modal");
        const modalBtn = this.findElement(".closeBtn");
        const modalName = this.findElement(".modal__name");
        const modalAddress = this.findElement(".modal__address");
        const modalPrice = this.findElement(".modal__price");

        return {
            modal,
            modalBtn,
            modalName,
            modalAddress,
            modalPrice
        }
    }


    _showModal({ modal, modalName, modalAddress, modalPrice }, totalPrice, inputNameValue, inputEmailValue) {
        modal.style.display = "block";
        modalName.textContent = inputNameValue;
        modalAddress.textContent = inputEmailValue;
        modalPrice.textContent = totalPrice;
    }
    _closeModal(modal) {
        modal.style.display = "none";
    }




    _clearPanelForm(summaryUl, inputsToFill) {
        summaryUl.innerHTML = "";
        inputsToFill.forEach(input => input.value = "")
        this._updateTotalPrice();
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