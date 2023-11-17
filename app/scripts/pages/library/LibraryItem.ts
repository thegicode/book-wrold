import bookStore from "../../modules/BookStore";

export default class LibraryItem extends HTMLElement {
    protected checkbox: HTMLInputElement | null = null;
    private libCode = "";
    private libName = "";

    constructor() {
        super();
        this.onChange = this.onChange.bind(this);
    }

    connectedCallback() {
        this.checkbox =
            this.querySelector<HTMLInputElement>("[name=myLibrary]");

        this.render();
        this.checkbox?.addEventListener("click", this.onChange);
    }

    disconnectedCallback() {
        this.checkbox?.removeEventListener("click", this.onChange);
    }

    protected render(): void {
        if (this.dataset.object === undefined || !this.checkbox) return;

        const data = JSON.parse(this.dataset.object) as ILibrary;
        const { libCode, libName } = data;

        Object.entries(data).forEach(([key, value]) => {
            const element = this.querySelector(`.${key}`);
            if (element) {
                element.innerHTML = value;
            }
        });

        const hoempageLink = this.querySelector<HTMLLinkElement>(".homepage");
        if (hoempageLink) hoempageLink.href = data.homepage;

        this.libCode = libCode;
        this.libName = libName;

        if (this.checkbox)
            this.checkbox.checked = bookStore.hasLibrary(this.libCode);
    }

    protected onChange(event: MouseEvent): void {
        const target = event.target as HTMLInputElement;
        if (!target) return;
        if (target.checked) {
            bookStore.addLibrary(this.libCode, this.libName);
        } else {
            bookStore.removeLibrary(this.libCode);
        }
    }
}
