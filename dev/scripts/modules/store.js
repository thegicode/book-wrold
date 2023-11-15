const cloneDeep = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};
const STORAGE_NAME = "BookWorld";
const initialState = {
    libraries: {},
    regions: {},
    category: {},
    categorySort: [],
};
const store = {
    state: initialState,
    listeners: [],
    subscribe(listener) {
        this.listeners.push(listener);
    },
    unsubscribe(callback) {
        this.listeners = this.listeners.filter((subscriber) => subscriber !== callback);
    },
    notify() {
        this.listeners.forEach((listener) => listener());
    },
    getState() {
        try {
            const storageData = localStorage.getItem(STORAGE_NAME);
            const state = storageData === null ? this.state : JSON.parse(storageData);
            return cloneDeep(state);
        }
        catch (error) {
            console.error(error);
            throw new Error("Failed to get state from localStorage.");
        }
    },
    setState(newState) {
        try {
            localStorage.setItem(STORAGE_NAME, JSON.stringify(newState));
        }
        catch (error) {
            console.error(error);
        }
    },
    resetState() {
        this.setState(initialState);
    },
    get category() {
        return cloneDeep(this.state.category);
    },
    set category(newCategory) {
        this.state.category = newCategory;
        console.log("store favorites: ", this.state.category);
    },
    get libraries() {
        return cloneDeep(this.state.libraries);
    },
    set libraries(newLibries) {
        this.state.libraries = newLibries;
    },
    get regions() {
        return cloneDeep(this.state.regions);
    },
    set regions(newRegions) {
        this.state.regions = newRegions;
    },
    addCategory(name) {
        const newFavorites = this.category;
        newFavorites[name] = [];
        this.category = newFavorites;
    },
    hasCategory(name) {
        return name in this.category;
    },
    renameCategory(prevName, newName) {
        const newFavorites = this.category;
        newFavorites[prevName] = newFavorites[newName];
        delete newFavorites[prevName];
        this.category = newFavorites;
    },
    deleteCategory(name) {
        const newFavorites = this.category;
        delete newFavorites[name];
        this.category = newFavorites;
    },
    addLibrary(code, name) {
        const newLibries = this.libraries;
        newLibries[code] = name;
        this.libraries = newLibries;
    },
    removeLibrary(code) {
        const newLibries = this.libraries;
        delete newLibries[code];
        this.libraries = newLibries;
    },
    addRegion(name) {
        const newRegion = this.regions;
        newRegion[name] = {};
    },
};
export default store;
//# sourceMappingURL=store.js.map