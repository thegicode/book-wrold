import { STORAGE_NAME } from "./constants";
import Publisher from "../utils/Publisher";
import FavoriteModel from "./FavoriteModel";
import LibraryModel from "./LibraryModel";
import RegionModel from "./RegionModel";
const cloneDeep = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};
const initialState = {
    favorites: {},
    sortedFavoriteKeys: [],
    libraries: {},
    regions: {},
};
class BookModel {
    constructor() {
        this.bookStateUpdatePublisher = new Publisher();
        const state = this.loadStorage() || cloneDeep(initialState);
        const { favorites, sortedFavoriteKeys, libraries, regions } = state;
        this.favoriteModel = new FavoriteModel(favorites, sortedFavoriteKeys);
        this.libraryModel = new LibraryModel(libraries);
        this.regionModel = new RegionModel(regions);
    }
    // localStorage 관련
    loadStorage() {
        const storageData = localStorage.getItem(STORAGE_NAME);
        return storageData ? JSON.parse(storageData) : null;
    }
    setStorage(newState) {
        try {
            localStorage.setItem(STORAGE_NAME, JSON.stringify(newState));
        }
        catch (error) {
            console.error(error);
        }
    }
    // state 관련
    get state() {
        return this.loadStorage();
    }
    set state(newState) {
        this.setStorage(newState);
        const { favorites, sortedFavoriteKeys, libraries, regions } = newState;
        this.favoriteModel.favorites = favorites;
        this.favoriteModel.sortedKeys = sortedFavoriteKeys;
        this.libraryModel.libraries = libraries;
        this.regionModel.regions = regions;
        this.bookStateUpdatePublisher.notify();
    }
    resetState() {
        this.state = initialState;
    }
    // favorites 관련 메서드
    getFavorites() {
        return this.favoriteModel.favorites;
    }
    getSortedFavoriteKeys() {
        return this.favoriteModel.sortedKeys;
    }
    setFavorites() {
        const newState = this.state;
        newState.favorites = this.getFavorites();
        newState.sortedFavoriteKeys = this.getSortedFavoriteKeys();
        this.setStorage(newState);
    }
    addfavorite(name) {
        this.favoriteModel.add(name);
        this.favoriteModel.addSortedKeys(name);
        this.setFavorites();
    }
    renameFavorite(prevName, newName) {
        this.favoriteModel.rename(prevName, newName);
        this.setFavorites();
    }
    renameSortedFavoriteKey(prevName, newName) {
        this.favoriteModel.renameSortedKeys(prevName, newName);
        this.setFavorites();
    }
    deleteFavorite(name) {
        this.favoriteModel.delete(name);
        this.setFavorites();
    }
    deleteSortedFavoriteKey(name) {
        const index = this.favoriteModel.deleteSortedKeys(name);
        this.setFavorites();
        return index;
    }
    hasFavorite(name) {
        return this.favoriteModel.has(name);
    }
    changeFavorite(draggedKey, targetKey) {
        this.favoriteModel.change(draggedKey, targetKey);
        this.setFavorites();
    }
    addFavoriteBook(name, isbn) {
        this.favoriteModel.addBook(name, isbn);
        this.setFavorites();
    }
    hasFavoriteBook(name, isbn) {
        return this.favoriteModel.hasBook(name, isbn);
    }
    removeFavoriteBook(name, isbn) {
        this.favoriteModel.removeBook(name, isbn);
        this.setFavorites();
    }
    // Library 관련 메서드
    getLibraries() {
        return this.libraryModel.libraries;
    }
    setLibraries() {
        const newState = this.state;
        newState.libraries = this.getLibraries();
        this.setStorage(newState);
    }
    addLibraries(code, name) {
        this.libraryModel.add(code, name);
        this.setLibraries();
    }
    removeLibraries(code) {
        this.libraryModel.remove(code);
        this.setLibraries();
    }
    hasLibrary(code) {
        return this.libraryModel.has(code);
    }
    // Region 관련 메서드
    getRegions() {
        return this.regionModel.regions;
    }
    setRegions() {
        const newState = this.state;
        newState.regions = this.getRegions();
        this.setStorage(newState);
    }
    addRegion(name) {
        this.regionModel.add(name);
        this.setRegions();
    }
    removeRegion(name) {
        this.regionModel.remove(name);
        this.setRegions();
    }
    addDetailRegion(regionName, detailName, detailCode) {
        this.regionModel.addDetail(regionName, detailName, detailCode);
        this.setRegions();
    }
    removeDetailRegion(regionName, detailName) {
        this.regionModel.removeDetail(regionName, detailName);
        this.setRegions();
    }
    // subscribe
    subscribeToBookStateUpdate(subscriber) {
        this.bookStateUpdatePublisher.subscribe(subscriber);
    }
    unsubscribeToBookStateUpdate(subscriber) {
        this.bookStateUpdatePublisher.unsubscribe(subscriber);
    }
    subscribeToFavoritesUpdate(subscriber) {
        this.favoriteModel.subscribeFavoritesUpdate(subscriber);
    }
    unsubscribeToFavoritesUpdate(subscriber) {
        this.favoriteModel.unsubscribeFavoritesUpdate(subscriber);
    }
    subscribeBookUpdate(subscriber) {
        this.favoriteModel.subscribeBookUpdate(subscriber);
    }
    unsubscribeBookUpdate(subscriber) {
        this.favoriteModel.unsubscribeBookUpdate(subscriber);
    }
    subscribeToRegionUpdate(subscriber) {
        this.regionModel.subscribeToUpdatePublisher(subscriber);
    }
    unsubscribeToRegionUpdate(subscriber) {
        this.regionModel.unsubscribeToUpdatePublisher(subscriber);
    }
    subscribeToDetailRegionUpdate(subscriber) {
        this.regionModel.subscribeToDetailUpdatePublisher(subscriber);
    }
    unsubscribeToDetailRegionUpdate(subscriber) {
        this.regionModel.unsubscribeToDetailUpdatePublisher(subscriber);
    }
}
const bookModel = new BookModel();
export default bookModel;
//# sourceMappingURL=index.js.map