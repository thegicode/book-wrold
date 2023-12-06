var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import BookItem from "./BookItem";
import { Observer, CustomFetch } from "../../utils/index";
import { URL } from "../../utils/constants";
export default class BookList extends HTMLElement {
    constructor() {
        super();
        this.paginationElement = this.querySelector(".paging-info");
        this.bookContainer = this.querySelector(".books");
        this.loadingComponent =
            this.querySelector("loading-component");
        this.retrieveBooks = this.retrieveBooks.bind(this);
        this.initializeSearchPage = this.initializeSearchPage.bind(this);
    }
    connectedCallback() {
        this.setupObserver();
        // CustomEventEmitter.add(
        //     SEARCH_PAGE_INIT,
        //     this.initializeSearchPage as EventListener
        // );
    }
    disconnectedCallback() {
        var _a;
        (_a = this.observer) === null || _a === void 0 ? void 0 : _a.disconnect();
        // CustomEventEmitter.remove(
        //     SEARCH_PAGE_INIT,
        //     this.initializeSearchPage as EventListener
        // );
    }
    initializeSearchPage(keyword, sortValue) {
        this.keyword = keyword;
        this.sortingOrder = sortValue;
        this.itemCount = 0;
        // renderBooks: onSubmit으로 들어온 경우와 브라우저
        // showDefaultMessage: keyword 없을 때 기본 화면 노출, 브라우저
        this.keyword ? this.renderBooks() : this.showDefaultMessage();
    }
    // initializeSearchPage(
    //     event: ICustomEvent<{
    //         keyword: string;
    //         sort: string;
    //     }>
    // ) {
    //     const { keyword, sort } = event.detail;
    //     this.keyword = keyword;
    //     this.sortingOrder = sort;
    //     this.itemCount = 0;
    //     // renderBooks: onSubmit으로 들어온 경우와 브라우저
    //     // showDefaultMessage: keyword 없을 때 기본 화면 노출, 브라우저
    //     this.keyword ? this.renderBooks() : this.showDefaultMessage();
    // }
    setupObserver() {
        const target = this.querySelector(".observe");
        this.observer = new Observer(target, this.retrieveBooks);
    }
    renderBooks() {
        this.bookContainer.innerHTML = "";
        this.retrieveBooks();
    }
    showDefaultMessage() {
        this.paginationElement.hidden = true;
        this.renderMessage("message");
    }
    retrieveBooks() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.keyword || !this.sortingOrder)
                return;
            (_a = this.loadingComponent) === null || _a === void 0 ? void 0 : _a.show();
            const encodedKeyword = encodeURIComponent(this.keyword);
            const searchUrl = `${URL.search}?keyword=${encodedKeyword}&display=${10}&start=${this.itemCount + 1}&sort=${this.sortingOrder}`;
            // console.log("fetch-search: ", searchUrl);
            try {
                const data = yield CustomFetch.fetch(searchUrl);
                this.renderBookList(data);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(`Error fetching books: ${error.message}`);
                }
                else {
                    console.error("An unexpected error occurred");
                }
            }
            (_b = this.loadingComponent) === null || _b === void 0 ? void 0 : _b.hide();
        });
    }
    renderBookList({ total, display, items, }) {
        var _a;
        if (total === 0) {
            this.renderMessage("notFound");
            return;
        }
        this.itemCount += display;
        this.refreshPagingData(total, display);
        this.appendBookItems(items);
        this.paginationElement.hidden = false;
        if (total !== this.itemCount)
            (_a = this.observer) === null || _a === void 0 ? void 0 : _a.observe();
    }
    refreshPagingData(total, display) {
        const obj = {
            keyword: `${this.keyword}`,
            length: `${this.itemCount.toLocaleString()}`,
            total: `${total.toLocaleString()}`,
            display: `${display}개씩`,
        };
        for (const [key, value] of Object.entries(obj)) {
            const element = this.paginationElement.querySelector(`.__${key}`);
            element.textContent = value;
        }
    }
    appendBookItems(items) {
        const fragment = new DocumentFragment();
        const template = document.querySelector("#tp-book-item");
        items.forEach((data, index) => {
            const bookItem = new BookItem(data);
            const cloned = template.content.cloneNode(true);
            bookItem.appendChild(cloned);
            bookItem.dataset.index = (this.itemCount + index).toString();
            fragment.appendChild(bookItem);
        });
        this.bookContainer.appendChild(fragment);
    }
    renderMessage(type) {
        const messageTemplate = document.querySelector(`#tp-${type}`);
        if (!messageTemplate)
            return;
        this.bookContainer.innerHTML = "";
        this.bookContainer.appendChild(messageTemplate.content.cloneNode(true));
    }
}
// this.observer = new IntersectionObserver( changes => {
//     changes.forEach( change => {
//         if (change.isIntersecting) {
//             this.observer.unobserve(change.target)
//             this.retrieveBooks()
//         }
//     })
// })
//# sourceMappingURL=BookList.js.map