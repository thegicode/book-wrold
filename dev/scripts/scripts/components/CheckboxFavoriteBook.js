import { addFavoriteBook, removeFavoriteBook, isFavoriteBook, } from "../modules/model";
import { updateFavoriteBooksSize } from "../modules/events";
export default class CheckboxFavoriteBook extends HTMLElement {
    constructor() {
        super();
        this.inputElement = null;
        this.isbn = null;
    }
    connectedCallback() {
        var _a;
        const isbnElement = this.closest("[data-isbn]");
        if (isbnElement) {
            this.isbn = isbnElement.dataset.isbn;
        }
        this.render();
        (_a = this.inputElement) === null || _a === void 0 ? void 0 : _a.addEventListener("change", this.onChange.bind(this));
    }
    disconnectedCallback() {
        var _a;
        (_a = this.inputElement) === null || _a === void 0 ? void 0 : _a.removeEventListener("change", this.onChange);
    }
    render() {
        const isbn = this.isbn || "";
        const checked = isFavoriteBook(isbn) ? "checked" : "";
        this.innerHTML = `<label>
            <input type="checkbox" name="favorite" ${checked}>
            <span>관심책</span>
        </label>`;
        this.inputElement = this.querySelector("input");
    }
    onChange() {
        const ISBN = this.isbn || "";
        if (!ISBN || !this.inputElement)
            return;
        if (this.inputElement.checked) {
            addFavoriteBook(ISBN);
        }
        else {
            removeFavoriteBook(ISBN);
        }
        // CustomEventEmitter.dispatch('favorite-books-changed')
        updateFavoriteBooksSize();
    }
}
//# sourceMappingURL=CheckboxFavoriteBook.js.map