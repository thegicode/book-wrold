// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../type.d.ts" />

import { readHtmlFile } from "../../helpers";

import Book from "../../../scripts/pages/book/Book";
import CustomFetch from "../../../scripts/utils/CustomFetch";

jest.mock("../../../scripts/utils/CustomFetch");

class BookForTesting extends Book {
    async testFetchUsageAnalysisList(isbn: string) {
        await this.fetchUsageAnalysisList(isbn);
    }
    setData(data: IUsageAnalysisListData) {
        this.data = data;
    }
    getLoadingElement() {
        return this.loadingElement;
    }
    testRender() {
        this.render();
    }
}

describe("Book", () => {
    let bookUnderTest: BookForTesting;
    let originalLocation: Location;
    const mockedCustomFetch = CustomFetch as jest.Mocked<typeof CustomFetch>;
    const mockIsbn = "1234567890123";
    const mockData = {
        book: {
            bookname:
                "어떻게 민주주의는 무너지는가 :우리가 놓치는 민주주의 위기 신호",
            authors: "스티븐 레비츠키,박세연 옮김",
            publisher: "어크로스",
            bookImageURL:
                "http://image.aladin.co.kr/product/16234/14/cover/k782534278_1.jpg",
            description:
                "2016년 미국 대선, 트럼프의 당선 충격 속 100만 명이 주목한 화제작! 우리는 흔히 트럼프 같은 독재적 인물이 민주주의를 무너뜨린다고 생각한다. 그러나 이 책은 오히려 민주적인 룰 안에서 움직이는 정당과 정치인들이 민주주의를 서서히 망가뜨린다고 말한다. 권위 있는 하버드대 정치학자 두 사람이 15년간 전 세계 수십 개국의 지난 100년 역사에서 찾아낸 민주주의 붕괴 패턴은 그 주장을 뒷받침한다. 뉴욕타임스, 아마존 베스트셀러. 뉴스위크 2018 올해의 책.",
            publication_year: "2018",
            isbn13: "9791160560589",
            vol: "",
            class_no: "340.22",
            class_nm: "사회과학 > 정치학 > 정치학",
            loanCnt: "6095",
        },
        keywords: [
            {
                word: "민주주의",
            },
        ],
        recBooks: [
            {
                bookname:
                    "위험한 민주주의 :새로운 위기, 무엇이 민주주의를 파괴하는가",
                isbn13: "9791162335475",
            },
        ],
    };

    beforeEach(() => {
        originalLocation = window.location;
        Object.defineProperty(window, "location", {
            value: { ...originalLocation, search: `?isbn=${mockIsbn}` },
            writable: true,
        });

        if (!customElements.get("app-book")) {
            customElements.define("app-book", BookForTesting);
        }

        bookUnderTest = new BookForTesting();

        const bookHtml = readHtmlFile("../../markup/book.html");

        bookUnderTest.innerHTML = bookHtml;

        document.body.appendChild(bookUnderTest);
    });

    afterEach(() => {
        if (document.body.contains(bookUnderTest)) {
            document.body.removeChild(bookUnderTest);
        }
        window.location = originalLocation;
        jest.clearAllMocks();
    });

    test("fetchUsageAnalysisList fetches data and renders it correctly", async () => {
        (CustomFetch.fetch as jest.Mock).mockResolvedValueOnce(mockData);

        await bookUnderTest.testFetchUsageAnalysisList(mockIsbn);
        expect(bookUnderTest.getLoadingElement()).toBeNull();
    });

    test("fetchUsageAnalysisList handles fetch error correctly", async () => {
        const mockError = new Error("Fail to get usage analysis list.");
        mockedCustomFetch.fetch.mockRejectedValue(
            new Error("Some fetch error")
        );

        const consoleErrorSpy = jest.spyOn(console, "error");
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        consoleErrorSpy.mockImplementation(() => {});

        try {
            await bookUnderTest.testFetchUsageAnalysisList(mockIsbn);
        } catch (error) {
            expect(mockedCustomFetch.fetch).toHaveBeenCalled();
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                new Error("Some fetch error")
            );
            expect(error).toEqual(mockError);
        } finally {
            consoleErrorSpy.mockRestore();
        }
    });
});
