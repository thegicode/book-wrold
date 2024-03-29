import bookModel from "../../model";
import { cloneTemplate } from "../../utils/helpers";
import FavoriteItem from "./FavoriteItem";

export default class Favorite extends HTMLElement {
    private currentCategory: string | null;
    private listElement: HTMLElement | null;
    private itemTemplate: HTMLTemplateElement;
    private messageTemplate: HTMLTemplateElement;

    constructor() {
        super();

        this.currentCategory = new URLSearchParams(location.search).get(
            "category"
        );
        this.listElement = this.querySelector(".favorite-books");
        this.itemTemplate = document.querySelector(
            "#tp-favorite-item"
        ) as HTMLTemplateElement;
        this.messageTemplate = document.querySelector(
            "#tp-message"
        ) as HTMLTemplateElement;

        // this.subscribeCategoryChange = this.subscribeCategoryChange.bind(this);
    }

    connectedCallback() {
        const isbnsOfCategory = this.getIsbnsOfCategory();
        if (isbnsOfCategory) this.render(isbnsOfCategory);

        // bookModel.subscribeFavoriteCategoriesUpdate(
        //     this
        //         .subscribeCategoryChange as TSubscriberCallback<IFavoritesUpdateProps>
        // );
    }

    disconnectedCallback() {
        //
    }

    private getIsbnsOfCategory(): string[] | undefined {
        const categoryKeys = bookModel.sortedFavoriteKeys;
        if (categoryKeys.length === 0) {
            this.renderMessage("관심 카테고리를 등록해주세요.");
            return;
        }

        const isbnsOfCategory =
            bookModel.favorites[this.currentCategory || categoryKeys[0]];
        if (isbnsOfCategory.length === 0) {
            this.renderMessage("등록된 관심책이 없습니다.");
            return;
        }

        return isbnsOfCategory;
    }

    private render(isbnsOfCategory: string[]) {
        if (!this.listElement) return;
        const fragment = new DocumentFragment();
        isbnsOfCategory
            .map((isbn) => this.createItem(isbn))
            .forEach((element) => fragment.appendChild(element));

        this.listElement.innerHTML = "";
        this.listElement.appendChild(fragment);
    }

    private createItem(isbn: string) {
        const favoriteItem = new FavoriteItem(isbn);
        favoriteItem.appendChild(this.itemTemplate.content.cloneNode(true));
        favoriteItem.dataset.isbn = isbn;
        return favoriteItem;
    }

    private renderMessage(message: string) {
        if (!this.messageTemplate || !this.listElement) return;

        const messageElement = cloneTemplate(this.messageTemplate);
        messageElement.textContent = message;
        this.listElement.appendChild(messageElement);
    }

    // private subscribeCategoryChange({ type, payload }: IFavoritesUpdateProps) {
    //     switch (type) {
    //         case "rename":
    //             console.log("reanme");
    //             break;
    //     }
    // }
}
