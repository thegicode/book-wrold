"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setApiRoutes = void 0;
const apiHandlers_1 = require("./apiHandlers");
const setApiRoutes = (app) => {
    app.get("/search-naver-book", apiHandlers_1.searchNaverBook);
    app.get("/library-search", apiHandlers_1.librarySearch);
    app.get("/book-exist", apiHandlers_1.bookExist);
    app.get("/usage-analysis-list", apiHandlers_1.usageAnalysisList);
    app.get("/library-search-by-book", apiHandlers_1.librarySearchByBook);
    app.get("/popular-book", apiHandlers_1.loanItemSrch);
};
exports.setApiRoutes = setApiRoutes;
