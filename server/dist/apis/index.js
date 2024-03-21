"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveRegistrationKey = exports.fetchBookUsageAnalysis = exports.fetchLibrariesByCriteria = exports.fetchLibrariesByBookISBN = exports.fetchPopularBooksByCriteria = exports.fetchMonthlyKeywords = exports.fetchBookAvailability = exports.fetchKyoboBookInfo = exports.fetchBooksFromNaver = void 0;
const naverApi_1 = require("./naverApi");
Object.defineProperty(exports, "fetchBooksFromNaver", { enumerable: true, get: function () { return naverApi_1.fetchBooksFromNaver; } });
const kyoboApi_1 = require("./kyoboApi");
Object.defineProperty(exports, "fetchKyoboBookInfo", { enumerable: true, get: function () { return kyoboApi_1.fetchKyoboBookInfo; } });
const libraryApi_1 = require("./libraryApi");
Object.defineProperty(exports, "fetchBookAvailability", { enumerable: true, get: function () { return libraryApi_1.fetchBookAvailability; } });
Object.defineProperty(exports, "fetchMonthlyKeywords", { enumerable: true, get: function () { return libraryApi_1.fetchMonthlyKeywords; } });
Object.defineProperty(exports, "fetchPopularBooksByCriteria", { enumerable: true, get: function () { return libraryApi_1.fetchPopularBooksByCriteria; } });
Object.defineProperty(exports, "fetchLibrariesByBookISBN", { enumerable: true, get: function () { return libraryApi_1.fetchLibrariesByBookISBN; } });
Object.defineProperty(exports, "fetchLibrariesByCriteria", { enumerable: true, get: function () { return libraryApi_1.fetchLibrariesByCriteria; } });
Object.defineProperty(exports, "fetchBookUsageAnalysis", { enumerable: true, get: function () { return libraryApi_1.fetchBookUsageAnalysis; } });
const keyManager_1 = require("./keyManager");
Object.defineProperty(exports, "saveRegistrationKey", { enumerable: true, get: function () { return keyManager_1.saveRegistrationKey; } });