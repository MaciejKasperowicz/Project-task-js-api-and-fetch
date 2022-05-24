import './../css/admin.css';

import ExcursionsAPI from './ExcursionsAPI';
// console.log('admin');
const excursionsAPI = new ExcursionsAPI();
// excursionsAPI.loadData()
//     .then(data => console.log(data))

class Admin {
    constructor(api) {
        this.apiService = api;
        this.excursionsItemPrototype = document.querySelector(".excursions__item--prototype");
        // this.excursionsItemPrototype = this._findElement(".excursions__item--prototype");
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
            console.log(element)
            const excursion = this._createExcursion(element);
            excursionsUl.appendChild(excursion)
        })

    }
    // _createExcursion(data, excursionsUl) {
    _createExcursion(element) {
        // data.forEach(element => {
        const excursionsItem = this.excursionsItemPrototype.cloneNode(true);
        console.log(excursionsItem)
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
    // }

    _findElement(selector) {
        // return document.querySelector(".excursions");
        return document.querySelector(selector);
    }

    _clearElement(element) {
        element.innerHTML = "";
        // element.appendChild(this.excursionsItemPrototype);
    }


    add() {
        const addingForm = this._findElement(".form--adding-form");

        addingForm.addEventListener("submit", e => {
            e.preventDefault();
            const { name, description, priceAdult, priceChild } = e.target.elements;
            const data = {
                title: name.value, description: description.value, priceAdult: priceAdult.value, priceChild: priceChild.value
            }
            this.apiService.addData(data)
                .catch(err => console.error(err))
                .finally(() => this.load());
        })
    }

    remove() {
        const excursionsUl = this._findElement(".excursions");
        excursionsUl.addEventListener("click", (e) => {
            e.preventDefault();
            const targetEl = e.target;
            const isRemoveBtn = this._isElementType(targetEl, "remove");
            if (isRemoveBtn) {
                const id = this._getItemFromRoot(targetEl);
                this.apiService.removeData(id)
                    .catch(err => console.error(err))
                    .finally(() => this.load());
            }
        });
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

    update() {
        const excursionsUl = this._findElement(".excursions");
        excursionsUl.addEventListener("click", (e) => {
            e.preventDefault();
            const targetEl = e.target;
            const isUpdateBtn = this._isElementType(targetEl, "update");

            if (isUpdateBtn) {
                // if (this._isElementType(targetEl, "update")) {

                const isEditable = this._isItemEditable(targetEl);
                // console.log(isEditable)
                if (isEditable) {
                    // if (this._isItemEditable(targetEl)) {
                    const id = this._getItemFromRoot(targetEl);
                    const data = this._createDataToUpdate(targetEl);

                    this.apiService.updateData(id, data)
                        .catch(err => console.error(err))
                        .finally(() => {
                            targetEl.value = "edytuj";
                            this._setItemEditable(targetEl, false);
                            // this.load();
                        })

                } else {
                    targetEl.value = "zapisz";
                    this._setItemEditable(targetEl, true);

                }
            }
        })
    }

    _isItemEditable(targetEl) {
        const fieldsToEdit = this._getFieldsToEdit(targetEl);

        const isEditable = Object.keys(fieldsToEdit).every(field => {
            return fieldsToEdit[field].isContentEditable;
        });
        return isEditable;
    }

    _getFieldsToEdit(targetEl) {
        const rootItem = this._findItemRoot(targetEl);
        const fieldsToEdit = {
            itemTitle: rootItem.querySelector(".excursions__title"),
            itemDescription: rootItem.querySelector(".excursions__description"),
            itemPriceAdult: rootItem.querySelector(".excursion__price-adult"),
            itemPriceChild: rootItem.querySelector(".excursion__price-child")
        }

        return fieldsToEdit
    }

    _setItemEditable(targetEl, value) {
        const fieldsToEdit = this._getFieldsToEdit(targetEl);
        Object.keys(fieldsToEdit).forEach(field => {
            // field.contentEditable = value;
            fieldsToEdit[field].contentEditable = value;
            // console.log(fieldsToEdit[field])
        });
    }

    _createDataToUpdate(targetEl) {
        const fieldsToEdit = this._getFieldsToEdit(targetEl);
        const data = Object.keys(fieldsToEdit).map(field => {
            return fieldsToEdit[field].textContent
        });
        const [title, description, priceAdult, priceChild] = data;

        return {
            title, description, priceAdult, priceChild
        }
    }

}

const admin = new Admin(excursionsAPI);
admin.load();
admin.add();
admin.remove();
admin.update();