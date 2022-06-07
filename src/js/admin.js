import Common from "./common";

export default class Admin extends Common {
    constructor(api) {
        super(api)
    }

    addExcursions() {
        const addingForm = this.findElement(".form--adding-form");
        addingForm.addEventListener("submit", e => {
            e.preventDefault();
            const { name, description, priceAdult, priceChild } = e.target.elements;

            const data = {
                title: name.value, description: description.value, priceAdult: priceAdult.value, priceChild: priceChild.value
            }
            this.apiService.addData(data, this.excursionsDB)
                .catch(err => console.error(err))
                .then(() => this.clearInputs([...e.target.elements]))
                .finally(() => this.loadExcursions());
        })
    }

    removeExcursions() {
        const excursionsUl = this.findElement(".excursions");
        excursionsUl.addEventListener("click", (e) => {
            e.preventDefault();
            const targetEl = e.target;
            const isRemoveBtn = this.isElementType(targetEl, "remove");
            if (isRemoveBtn) {
                const id = this.getItemFromRoot(targetEl);
                this.apiService.removeData(this.excursionsDB, id)
                    .catch(err => console.error(err))
                    .finally(() => this.loadExcursions());
            }
        });
    }


    updateExcursions() {
        const excursionsUl = this.findElement(".excursions");
        excursionsUl.addEventListener("click", (e) => {
            e.preventDefault();
            const targetEl = e.target;
            const isUpdateBtn = this.isElementType(targetEl, "update");

            if (isUpdateBtn) {

                const isEditable = this._isItemEditable(targetEl);
                if (isEditable) {
                    const id = this.getItemFromRoot(targetEl);
                    const data = this._createDataToUpdate(targetEl);

                    this.apiService.updateData(id, data, this.excursionsDB)
                        .catch(err => console.error(err))
                        .finally(() => {
                            targetEl.value = "edytuj";
                            this._setItemEditable(targetEl, false);
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
        const rootItem = this.findItemRoot(targetEl);
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
            fieldsToEdit[field].contentEditable = value;
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

