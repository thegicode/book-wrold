var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CustomEventEmitter, CustomFetch } from "../../utils";
import { getCurrentDates } from "../../utils/utils";
export default class Popular extends HTMLElement {
    constructor() {
        super();
        this.itemTemplate = document.querySelector("#tp-popular-item");
        this.body = this.querySelector(".popular-body");
        this.list = this.querySelector(".popular-list");
        this.loading = document.querySelector(".popular-loading");
        this.onRequestPopular = this.onRequestPopular.bind(this);
        this.onClickPageNav = this.onClickPageNav.bind(this);
        this.params = null;
    }
    connectedCallback() {
        const { currentYear, currentMonth, currentDay } = getCurrentDates();
        const params = {
            startDt: "2023-01-01",
            endDt: `${currentYear}-${currentMonth}-${currentDay}`,
            gender: "",
            age: "",
            region: "",
            addCode: "",
            kdc: "",
            pageNo: "1",
            pageSize: "100",
        };
        this.params = params;
        this.fetch(params);
        CustomEventEmitter.add("requestPopular", this.onRequestPopular);
        CustomEventEmitter.add("clickPageNav", this.onClickPageNav);
    }
    disconnectedCallback() {
        CustomEventEmitter.remove("requestPopular", this.onRequestPopular);
        CustomEventEmitter.remove("clickPageNav", this.onClickPageNav);
    }
    fetch(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.body && this.list) {
                this.body.dataset.loading = "true";
                this.list.innerHTML = "";
            }
            const searchParams = new URLSearchParams(Object.entries(params)
                .filter(([, value]) => value !== undefined)
                .map(([key, value]) => [key, String(value)]));
            const url = `/popular-book?${searchParams}`;
            try {
                const data = yield CustomFetch.fetch(url);
                this.render(data);
                if (params.pageNo === "1") {
                    CustomEventEmitter.dispatch("renderPageNav", {
                        pageSize: params.pageSize,
                    });
                }
            }
            catch (error) {
                console.error(error);
                throw new Error(`Fail to get library search by book.`);
            }
        });
    }
    render({ data, resultNum }) {
        if (!this.list)
            return;
        console.log(resultNum);
        const fragment = new DocumentFragment();
        data.map((item) => {
            const cloned = this.createItem(item);
            cloned && fragment.appendChild(cloned);
        });
        this.list.appendChild(fragment);
        if (this.body) {
            this.body.dataset.loading = "false";
        }
    }
    createItem(item) {
        var _a, _b;
        const { 
        // addition_symbol,
        authors, bookDtlUrl, bookImageURL, bookname, class_nm, 
        // class_no,
        isbn13, loan_count, no, publication_year, publisher, ranking,
        // vol,
         } = item;
        const cloned = (_b = (_a = this.itemTemplate) === null || _a === void 0 ? void 0 : _a.content.firstElementChild) === null || _b === void 0 ? void 0 : _b.cloneNode(true);
        if (!cloned)
            return null;
        const bookNameEl = cloned.querySelector(".bookname");
        const rankingEl = cloned.querySelector(".ranking");
        const authorsEl = cloned.querySelector(".authors");
        const publicationYeaEl = cloned.querySelector(".publication_year");
        const publisherEl = cloned.querySelector(".publisher");
        const classEl = cloned.querySelector(".class_nm");
        const isbnEl = cloned.querySelector(".isbn13");
        const loanCountEl = cloned.querySelector(".loan_count");
        const bookDtlUrlEl = cloned.querySelector(".bookDtlUrl");
        const imageEl = cloned.querySelector(".bookImage");
        cloned.dataset.index = no.toString();
        bookNameEl.textContent = bookname;
        rankingEl.textContent = ranking;
        authorsEl.textContent = authors;
        publicationYeaEl.textContent = publication_year;
        publisherEl.textContent = publisher;
        classEl.textContent = class_nm;
        isbnEl.textContent = isbn13;
        loanCountEl.textContent = loan_count;
        bookDtlUrlEl.href = bookDtlUrl;
        imageEl.src = bookImageURL;
        return cloned;
    }
    onRequestPopular(event) {
        const { params } = event.detail;
        this.params = params;
        this.fetch(params);
    }
    onClickPageNav(event) {
        const { pageIndex } = event.detail;
        if (this.params) {
            this.params.pageNo = pageIndex.toString();
            this.fetch(this.params);
        }
    }
}
//# sourceMappingURL=Popular.js.map