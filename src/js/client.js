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
    }
    load() {
        this.apiService.loadData()
            .then(data => this.insert(data))
            .catch(err => console.error(err));
    }
    insert(data) {
        console.log(data)
        const excursionsUl = this._findElement(".excursions");

        this._clearElement(excursionsUl);
        // this._createExcursion(data, excursionsUl);
        data.forEach(element => {
            // console.log(element)
            const excursion = this._createExcursion(element);
            excursionsUl.appendChild(excursion)
        })
    }
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
        // excursionsUl.appendChild(excursionsItem);
        // });
    };

    _findElement(selector) {
        // return document.querySelector(".excursions");
        return document.querySelector(selector);
    }

    _clearElement(element) {
        element.innerHTML = "";
        // element.appendChild(this.excursionsItemPrototype);
    }

    addExcursionsToSummary() {
        const excursionsUl = this._findElement(".excursions");
        // console.log(excursionsUl);
        excursionsUl.addEventListener("click", (e) => {
            e.preventDefault();
            const targetEl = e.target;
            // console.log(targetEl);
            const isAddBtn = this._isElementType(targetEl, "submit");
            if (isAddBtn) {
                // const id = this._getItemFromRoot(targetEl);
                const itemRoot = this._findItemRoot(targetEl);
                const inputsRoot = itemRoot.querySelectorAll("input");
                // console.log(inputsRoot)
                // const [priceAdult, priceChild] = inputsRoot;
                // console.log(priceAdult, priceChild)
                const inputsToFill = [...inputsRoot].filter(input => {
                    if (input.type === "number") return input
                })
                console.log(inputsToFill)
                const isValid = this._validateInputs(inputsToFill);
                console.log(isValid)

                if (isValid) {
                    const [adult, child] = inputsToFill.map(input => input.value);
                    console.log(adult);
                    console.log(child);
                    this.createSummaryItem();

                }
            }
        })
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

    _validateInputs(inputsToFill) {
        if (inputsToFill.some(input => {
            return Number.isInteger(Number(input.value)) && Number(input.value) > 0
        })) {
            return true
        } else {
            return false
        }
    }

    createSummaryItem(element) {
        const summaryItem = this.summaryItemPrototype.cloneNode(true);
        summaryItem.classList.remove("excursions__item--prototype");
        const sumNameEl = summaryItem.querySelector(".summary__name");
        const sumTotalPriceEl = summaryItem.querySelector(".summary__total-price");
        const sumRemoveBtnEl = summaryItem.querySelector(".summary__btn-remove");
        const adultQuantityEl = summaryItem.querySelector(".quantity--adult");
        const childQuantityEl = summaryItem.querySelector(".quantity--child");
        const priceAdultEl = summaryItem.querySelector(".price--adult");
        const priceChildEl = summaryItem.querySelector(".price--child");

        summaryItem.dataset.id = element.id;
        sumNameEl.textContent = element.title;
        adultQuantityEl.textContent = element.quantityAdult;
        childQuantityEl.textContent = element.quantityChild;
        priceAdultEl.textContent = element.priceAdult;
        priceChildEl.textContent = element.priceChild;


        return summaryItem

    }

}

const client = new Client(excursionsAPI);
client.load();
client.addExcursionsToSummary();