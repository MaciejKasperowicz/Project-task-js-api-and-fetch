export default class Common {
    constructor(api) {
        this.apiService = api;
        this.excursionsItemPrototype = document.querySelector(".excursions__item--prototype");
        this.excursionsDB = "excursions"
    }

    loadExcursions() {
        this.apiService.loadData(this.excursionsDB)
            .then(data => this.insertExcursions(data))
            .catch(err => console.error(err));
    }
    insertExcursions(data) {
        const excursionsUl = this.findElement(".panel__excursions");

        this.clearElement(excursionsUl);
        data.forEach(element => {
            const excursion = this.createExcursion(element);
            excursionsUl.appendChild(excursion)
        })
    }
    createExcursion(element) {
        const excursionsItem = this.excursionsItemPrototype.cloneNode(true);
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
    findElement(selector, from = document) {
        return from.querySelector(selector);
    }
    clearElement(element) {
        element.innerHTML = "";
    }
    isElementType(element, className) {
        return element.classList.value.includes(className)
    }
    findItemRoot(targetElement) {
        return targetElement.parentElement.parentElement.parentElement
    }
    getItemFromRoot(targetElement) {
        return this.findItemRoot(targetElement).dataset.id
    }
    clearInputs(inputs) {
        inputs.map(input => {
            if (input.type !== "submit") input.value = ""
        })
    }

}