"use strict";
(() => {
  // src/script/components/BookDescription.js
  var BookDescription = class extends HTMLElement {
    constructor() {
      super();
      this.el = null;
      this.button = null;
    }
    set data(value) {
      this.render(value);
    }
    connectedCallback() {
      this.render(this.data);
    }
    disconnectedCallback() {
      if (this.button)
        this.button.removeEventListener("click", this.onClickButton.bind(this));
    }
    render(value) {
      const template = `
            <p class="description" data-ellipsis="true">${value}</p>
            <button type="button" class="more-description-button">\uC124\uBA85 \uB354\uBCF4\uAE30</button>`;
      this.innerHTML = template;
      this.el = this.querySelector(".description");
      this.button = this.querySelector(".more-description-button");
      if (this.button)
        this.button.addEventListener("click", this.onClickButton.bind(this));
    }
    // isEllipsisActive(el) {
    //     return (el.offsetHeight < el.scrollHeight);
    // }
    onClickButton() {
      if (!this.el)
        return;
      switch (this.el.dataset.ellipsis) {
        case "true":
          this.el.dataset.ellipsis = "false";
          if (this.button)
            this.button.textContent = "\uC124\uBA85 \uC811\uAE30";
          break;
        case "false":
          this.el.dataset.ellipsis = "true";
          if (this.button)
            this.button.textContent = "\uC124\uBA85 \uB354\uBCF4\uAE30";
          break;
        default:
          console.log("\uC124\uBA85 \uB354\uBCF4\uAE30 \uBC84\uD2BC \uC2E4\uD589");
      }
    }
  };

  // src/script/utils/CustomEventEmitter.js
  var CustomEventEmitter = class {
    constructor() {
      this._bus = document.createElement("div");
    }
    add(event, callback) {
      this._bus.addEventListener(event, callback);
    }
    remove(event, callback) {
      this._bus.removeEventListener(event, callback);
    }
    dispatch(event, detail = {}) {
      this._bus.dispatchEvent(new CustomEvent(event, { detail }));
    }
  };
  var CustomEventEmitter_default = new CustomEventEmitter();

  // src/script/utils/CustomFetch.js
  var __awaiter = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var CustomFetch = class {
    constructor(baseOptions = {}) {
      this.defaultOptions = Object.assign({ method: "GET", headers: {
        "Content-Type": "application/json"
        // 'Authorization': `Bearer ${getToken()}`
      } }, baseOptions);
    }
    fetch(url, options) {
      return __awaiter(this, void 0, void 0, function* () {
        const finalOptions = Object.assign(Object.assign(Object.assign({}, this.defaultOptions), options), { timeout: 5e3 });
        try {
          const response = yield fetch(url, finalOptions);
          if (!response.ok) {
            throw new Error(`Http error! status: ${response.status}, message: ${response.statusText}`);
          }
          const data = yield response.json();
          return data;
        } catch (error) {
          console.error(`Error fetching data: ${error}`);
          throw new Error(`Error fetching data: ${error}`);
        }
      });
    }
  };
  var CustomFetch_default = new CustomFetch();

  // src/script/components/LibraryBookExist.js
  var __awaiter2 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var LibraryBookExist = class extends HTMLElement {
    constructor() {
      super();
      this.container = this.querySelector(".library-list");
      this.itemTemplate = "";
    }
    connectedCallback() {
      this.itemTemplate = this.template();
    }
    onLibraryBookExist(button, isbn13, library) {
      return __awaiter2(this, void 0, void 0, function* () {
        const entries = Object.entries(library);
        this.loading(entries.length);
        if (button) {
          button.disabled = true;
        }
        const promises = entries.map(([libCode, libName], index) => __awaiter2(this, void 0, void 0, function* () {
          try {
            const data = yield CustomFetch_default.fetch(`/book-exist?isbn13=${isbn13}&libCode=${libCode}`);
            this.renderBookExist(data, libName, index);
          } catch (error) {
            console.error(error);
            throw new Error(`Fail to get usage analysis list.`);
          }
        }));
        try {
          yield Promise.all(promises);
          this.removeLoading();
        } catch (error) {
          console.error("Failed to fetch data for some libraries");
        }
      });
    }
    renderBookExist(data, libName, index) {
      const { hasBook, loanAvailable } = data;
      const _hasBook = hasBook === "Y" ? "\uC18C\uC7A5, " : "\uBBF8\uC18C\uC7A5";
      let _loanAvailable = "";
      if (hasBook === "Y") {
        _loanAvailable = loanAvailable === "Y" ? "\uB300\uCD9C\uAC00\uB2A5" : "\uB300\uCD9C\uBD88\uAC00";
      }
      const el = this.querySelectorAll(".library-item")[index];
      const elName = el.querySelector(".name");
      if (elName) {
        elName.textContent = `\u263C ${libName} : `;
      }
      const elHasBook = el.querySelector(".hasBook");
      if (elHasBook) {
        elHasBook.textContent = _hasBook;
      }
      const elLoanAvailable = el.querySelector(".loanAvailable");
      if (elLoanAvailable) {
        elLoanAvailable.textContent = _loanAvailable;
      }
    }
    loading(size) {
      let tp = "";
      while (size > 0) {
        tp += this.itemTemplate;
        size--;
      }
      this.container.innerHTML = tp;
    }
    removeLoading() {
      const loadingItems = this.querySelectorAll(".library-item[data-loading=true]");
      loadingItems.forEach((el) => {
        delete el.dataset.loading;
      });
    }
    template() {
      return `<li class="library-item" data-loading="true">
            <span class="name"></span>
            <span class="hasBook"></span>
            <span class="loanAvailable"></span>
        </li>`;
    }
  };

  // src/script/modules/model.js
  var cloneDeep = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };
  var initialState = {
    favoriteBooks: [],
    libraries: {},
    regions: {}
  };
  var storageKey = "BookWorld";
  var setState = (newState) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(newState));
    } catch (error) {
      console.error(error);
    }
  };
  var getState = () => {
    try {
      const storedState = localStorage.getItem(storageKey);
      if (storedState == null) {
        setState(initialState);
        return initialState;
      }
      return cloneDeep(JSON.parse(storedState));
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get state from localStrage.");
    }
  };
  var state = getState();
  var addFavoriteBook = (isbn) => {
    state.favoriteBooks.push(isbn);
    setState(state);
  };
  var removeFavoriteBook = (isbn) => {
    const index = state.favoriteBooks.indexOf(isbn);
    if (index !== -1) {
      state.favoriteBooks.splice(index, 1);
      setState(state);
    }
  };
  var isFavoriteBook = (isbn) => {
    return state.favoriteBooks.includes(isbn);
  };

  // src/script/components/NavGnb.js
  var NavGnb = class extends HTMLElement {
    constructor() {
      super();
      this.favoriteBooksSize = this.getFavoriteBooksSize();
    }
    connectedCallback() {
      this.render();
      this.setSelectedMenu();
    }
    disconnectedCallback() {
    }
    getFavoriteBooksSize() {
      return getState().favoriteBooks.length;
    }
    render() {
      this.innerHTML = `
            <nav class="gnb">
                <a class="gnb-item" href="./search">\uCC45 \uAC80\uC0C9</a>
                <a class="gnb-item" href="./favorite">\uB098\uC758 \uCC45 (<span class="size">${this.favoriteBooksSize}</span>)</a>
                <a class="gnb-item" href="./library">\uB3C4\uC11C\uAD00 \uC870\uD68C</a>
                <a class="gnb-item" href="./setting">\uC124\uC815</a>
            </nav>`;
    }
    setSelectedMenu() {
      const PATHS = ["/search", "/favorite", "/library", "/setting"];
      const idx = PATHS.indexOf(document.location.pathname);
      if (idx >= 0)
        this.querySelectorAll("a")[idx].ariaSelected = "true";
    }
  };

  // src/script/modules/events.js
  var updateFavoriteBooksSize = (size = getState().favoriteBooks.length) => {
    const navElement = document.querySelector("nav-gnb");
    navElement.querySelector(".size").textContent = String(size);
  };

  // src/script/components/CheckboxFavoriteBook.js
  var CheckboxFavoriteBook = class extends HTMLElement {
    constructor() {
      super();
      this.inputElement = null;
      this.isbn = null;
    }
    connectedCallback() {
      var _a;
      const isbnElement = this.closest("[data-isbn]");
      this.isbn = isbnElement.dataset.isbn;
      this.render();
      (_a = this.inputElement) === null || _a === void 0 ? void 0 : _a.addEventListener("change", this.onChange.bind(this));
    }
    disconnectedCallback() {
      var _a;
      (_a = this.inputElement) === null || _a === void 0 ? void 0 : _a.addEventListener("change", this.onChange);
    }
    render() {
      const isbn = this.isbn || "";
      const checked = isFavoriteBook(isbn) ? "checked" : "";
      this.innerHTML = `<label>
            <input type="checkbox" name="favorite" ${checked}>
            <span>\uAD00\uC2EC\uCC45</span>
        </label>`;
      this.inputElement = this.querySelector("input");
    }
    onChange() {
      var _a;
      const ISBN = this.isbn || "";
      if ((_a = this.inputElement) === null || _a === void 0 ? void 0 : _a.checked) {
        addFavoriteBook(ISBN);
      } else {
        removeFavoriteBook(ISBN);
      }
      updateFavoriteBooksSize();
    }
  };

  // src/script/components/BookImage.js
  var BookImage = class extends HTMLElement {
    constructor() {
      super();
    }
    // 즐겨찾기, 상세
    set data(objectData) {
      this.dataset.object = JSON.stringify(objectData);
      const imgElement = this.querySelector("img");
      if (imgElement && imgElement.getAttribute("src") === "") {
        this.render();
      }
    }
    connectedCallback() {
      this.render();
    }
    // search : dataset
    render() {
      const data = this.dataset.object ? JSON.parse(this.dataset.object) : null;
      let imageSrc = "";
      let imageAlt = "";
      if (data) {
        const { bookImageURL, bookname } = data;
        imageSrc = bookImageURL;
        imageAlt = bookname;
      }
      this.innerHTML = `
            <div class="book-image">
                <img class="thumb" src="${imageSrc}" alt="${imageAlt}"></img>
            </div>`;
      const imgElement = this.querySelector("img");
      if (imgElement && imgElement.getAttribute("src")) {
        this.handleError(imgElement);
      }
    }
    handleError(imgElement) {
      if (imgElement) {
        imgElement.onerror = () => {
          this.dataset.fail = "true";
          imgElement.remove();
        };
      }
    }
  };

  // src/script/pages/favorite/Favorite.js
  var Favorite = class extends HTMLElement {
    // $countEl
    // $observer
    // set count(value) {
    //     this.setAttribute('count', value)
    // }
    // get count() {
    //     return this.getAttribute('count')
    // }
    get favoriteBooks() {
      return getState().favoriteBooks;
    }
    constructor() {
      super();
      this.$booksEl = this.querySelector(".favorite-books");
    }
    connectedCallback() {
      if (this.favoriteBooks.length === 0) {
        this.renderMessage();
        return;
      }
      this.render();
    }
    disconnectedCallback() {
    }
    // updateFavoriteBooksSize({ detail }) {
    //     this.count = detail.count
    // }
    // updateCount() {
    //     const count = this.count || this.favoriteBooks.length
    //     this.$countEl.textContent = `${count}권`
    // }
    render() {
      const fragment = new DocumentFragment();
      const template = document.querySelector("#tp-favorite-item").content.firstElementChild;
      if (template) {
        this.favoriteBooks.forEach((isbn) => {
          if (typeof isbn !== "string")
            return;
          const el = template.cloneNode(true);
          el.dataset.isbn = isbn;
          fragment.appendChild(el);
        });
      }
      this.$booksEl.appendChild(fragment);
    }
    renderMessage() {
      const template = document.querySelector("#tp-message").content.firstElementChild;
      if (template) {
        const element = template.cloneNode(true);
        element.textContent = "\uAD00\uC2EC\uCC45\uC744 \uB4F1\uB85D\uD574\uC8FC\uC138\uC694.";
        this.$booksEl.appendChild(element);
      }
    }
  };

  // src/script/pages/favorite/FavoriteItem.js
  var __awaiter3 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var FavoriteItem = class extends HTMLElement {
    constructor() {
      super();
      this.libraryButton = this.querySelector(".library-button");
      this.anchorElement = this.querySelector("a");
    }
    connectedCallback() {
      this.loading();
      this.fetchData(this.dataset.isbn);
      this.libraryButton.addEventListener("click", this.onLibrary.bind(this));
      this.anchorElement.addEventListener("click", this.onClick.bind(this));
    }
    disconnectedCallback() {
      this.libraryButton.removeEventListener("click", this.onLibrary);
      this.anchorElement.removeEventListener("click", this.onClick);
    }
    fetchData(isbn) {
      return __awaiter3(this, void 0, void 0, function* () {
        const url = `/usage-analysis-list?isbn13=${isbn}`;
        try {
          const data = yield CustomFetch_default.fetch(url);
          this.render(data);
        } catch (error) {
          this.errorRender();
          console.error(error);
          throw new Error(`Fail to get usage analysis list.`);
        }
      });
    }
    render(data) {
      const {
        book
        // loanHistory,
        // loanGrps,
        // keywords,
        // recBooks,
        // coLoanBooks
      } = data;
      const {
        authors,
        bookImageURL,
        bookname,
        class_nm,
        // class_no,
        description,
        isbn13,
        loanCnt,
        publication_year,
        publisher
        // vol
      } = book;
      this.bookData = data;
      this.querySelector(".bookname").textContent = bookname;
      this.querySelector(".authors").textContent = authors;
      this.querySelector(".class_nm").textContent = class_nm;
      this.querySelector(".isbn13").textContent = isbn13;
      this.querySelector(".loanCnt").textContent = loanCnt.toLocaleString();
      this.querySelector(".publication_year").textContent = publication_year;
      this.querySelector(".publisher").textContent = publisher;
      const descriptionElement = this.querySelector("book-description");
      if (descriptionElement) {
        descriptionElement.data = description;
      }
      const imageElement = this.querySelector("book-image");
      if (imageElement) {
        imageElement.data = {
          bookImageURL,
          bookname
        };
      }
      this.removeLoading();
    }
    errorRender() {
      this.removeLoading();
      this.dataset.fail = "true";
      this.querySelector("h4").textContent = `${this.dataset.isbn}\uC758 \uCC45 \uC815\uBCF4\uB97C \uAC00\uC838\uC62C \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.`;
    }
    onLibrary() {
      const isbn = this.dataset.isbn || "";
      const libraryBookExist = this.querySelector("library-book-exist");
      if (libraryBookExist) {
        libraryBookExist.onLibraryBookExist(this.libraryButton, isbn, state.libraries);
      }
    }
    loading() {
      this.dataset.loading = "true";
    }
    removeLoading() {
      delete this.dataset.loading;
    }
    onClick(event) {
      event.preventDefault();
      location.href = `book?isbn=${this.dataset.isbn}`;
    }
  };

  // src/script/pages/favorite/index.js
  customElements.define("nav-gnb", NavGnb);
  customElements.define("app-favorite", Favorite);
  customElements.define("favorite-item", FavoriteItem);
  customElements.define("book-description", BookDescription);
  customElements.define("library-book-exist", LibraryBookExist);
  customElements.define("checkbox-favorite-book", CheckboxFavoriteBook);
  customElements.define("book-image", BookImage);
})();
//# sourceMappingURL=index.js.map