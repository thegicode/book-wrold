var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CustomEventEmitter, CustomFetch } from "../../utils/index";
import { cloneTemplate } from "../../utils/helpers";
import bookStore from "../../modules/BookStore";
const FETCH_REGION_DATA_EVENT = "fetch-region-data";
const SET_FAVORITE_REGIONS_EVENT = "set-favorite-regions";
const REGION_JSON_URL = "../../../assets/json/region.json";
const REGION_TEMPLATE_NAME = "#tp-region";
export default class SetRegion extends HTMLElement {
    constructor() {
        super();
        this.regionData = null;
    }
    connectedCallback() {
        this.initializeRegionDataAndRender();
    }
    initializeRegionDataAndRender() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.regionData = yield this.fetchRegionData(REGION_JSON_URL);
                this.renderRegion();
                this.addCheckboxChangeListeners();
                CustomEventEmitter.dispatch(FETCH_REGION_DATA_EVENT, {
                    regionData: this.regionData,
                });
            }
            catch (error) {
                console.error(error);
                throw new Error("Fail to get region data.");
            }
        });
    }
    fetchRegionData(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield CustomFetch.fetch(url));
        });
    }
    renderRegion() {
        const templateElement = document.querySelector(REGION_TEMPLATE_NAME);
        const regionElementsFragment = this.createRegionElementsFragment(templateElement);
        const container = this.querySelector(".regions");
        container.appendChild(regionElementsFragment);
    }
    createRegionElementsFragment(template) {
        if (!this.regionData) {
            throw new Error("regionData is null.");
        }
        const fragment = new DocumentFragment();
        const regionData = this.regionData["region"];
        const favoriteRegions = Object.keys(bookStore.regions);
        for (const [key, value] of Object.entries(regionData)) {
            const regionElement = this.createRegionElement(template, key, value, favoriteRegions);
            fragment.appendChild(regionElement);
        }
        return fragment;
    }
    createRegionElement(template, key, value, favoriteRegions) {
        const regionElement = cloneTemplate(template);
        const checkbox = regionElement.querySelector("input");
        checkbox.value = value;
        checkbox.checked = favoriteRegions.includes(key);
        const spanElement = regionElement.querySelector("span");
        if (spanElement)
            spanElement.textContent = key;
        return regionElement;
    }
    addCheckboxChangeListeners() {
        const checkboxes = this.querySelectorAll("[name=region]");
        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener("change", this.createCheckboxChangeListener(checkbox));
        });
    }
    createCheckboxChangeListener(checkbox) {
        return () => {
            const spanElement = checkbox.nextElementSibling;
            if (!spanElement || typeof spanElement.textContent !== "string") {
                throw new Error("Invalid checkbox element: No sibling element or missing text content.");
            }
            const key = spanElement.textContent;
            if (checkbox.checked) {
                bookStore.addRegion(key);
            }
            else {
                bookStore.removeRegion(key);
            }
            CustomEventEmitter.dispatch(SET_FAVORITE_REGIONS_EVENT, {});
        };
    }
}
//# sourceMappingURL=SetRegion.js.map