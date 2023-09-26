import { CustomEventEmitter, CustomFetch } from "../../utils";
import { getCurrentDates } from "../../utils/utils";

export default class Popular extends HTMLElement {
    itemTemplate: HTMLTemplateElement | null;
    body: HTMLHtmlElement | null;
    list: HTMLElement | null;
    loading: HTMLElement | null;
    params: IPopularFetchParams | null;

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

        CustomEventEmitter.add(
            "requestPopular",
            this.onRequestPopular as EventListener
        );

        CustomEventEmitter.add(
            "clickPageNav",
            this.onClickPageNav as EventListener
        );
    }

    disconnectedCallback() {
        CustomEventEmitter.remove(
            "requestPopular",
            this.onRequestPopular as EventListener
        );
        CustomEventEmitter.remove(
            "clickPageNav",
            this.onClickPageNav as EventListener
        );
    }

    async fetch(params: IPopularFetchParams): Promise<void> {
        if (this.body && this.list) {
            this.body.dataset.loading = "true";
            this.list.innerHTML = "";
        }

        const searchParams = new URLSearchParams(
            Object.entries(params)
                .filter(([, value]) => value !== undefined)
                .map(([key, value]) => [key, String(value)])
        );

        const url = `/popular-book?${searchParams}`;

        try {
            const data = await CustomFetch.fetch<IPopularBookResponse>(url);
            this.render(data);

            if (params.pageNo === "1") {
                CustomEventEmitter.dispatch("renderPageNav", {
                    pageSize: params.pageSize,
                });
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Fail to get library search by book.`);
        }
    }

    render({ data, resultNum }: IPopularBookResponse) {
        if (!this.list) return;

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

    createItem(item: IPopularBook) {
        const {
            // addition_symbol,
            authors,
            bookDtlUrl,
            bookImageURL,
            bookname,
            class_nm,
            // class_no,
            isbn13,
            loan_count,
            no,
            publication_year,
            publisher,
            ranking,
            // vol,
        } = item;

        const cloned = this.itemTemplate?.content.firstElementChild?.cloneNode(
            true
        ) as HTMLElement;
        if (!cloned) return null;

        const bookNameEl = cloned.querySelector(".bookname") as HTMLElement;
        const rankingEl = cloned.querySelector(".ranking") as HTMLElement;
        const authorsEl = cloned.querySelector(".authors") as HTMLElement;
        const publicationYeaEl = cloned.querySelector(
            ".publication_year"
        ) as HTMLElement;
        const publisherEl = cloned.querySelector(".publisher") as HTMLElement;
        const classEl = cloned.querySelector(".class_nm") as HTMLElement;
        const isbnEl = cloned.querySelector(".isbn13") as HTMLElement;
        const loanCountEl = cloned.querySelector(".loan_count") as HTMLElement;
        const bookDtlUrlEl = cloned.querySelector(
            ".bookDtlUrl"
        ) as HTMLLinkElement;
        const imageEl = cloned.querySelector(".bookImage") as HTMLImageElement;

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

    onRequestPopular(event: ICustomEvent<{ params: IPopularFetchParams }>) {
        const { params } = event.detail;
        this.params = params;
        this.fetch(params);
    }

    onClickPageNav(event: ICustomEvent<{ pageIndex: number }>) {
        const { pageIndex } = event.detail;

        if (this.params) {
            this.params.pageNo = pageIndex.toString();
            this.fetch(this.params);
        }
    }
}
