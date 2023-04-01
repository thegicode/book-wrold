import { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, ".env.key") });
const { LIBRARY_KEY, NAVER_CLIENT_ID, NAVER_SECRET_KEY } = process.env;

const fetchData = async (url: string, headers?: Record<string, string>) => {
    const response = await fetch(url, { headers });
    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    return await response.json();
};

// NAVER ; 키워드 검색
export async function searchNaverBook(req: Request, res: Response) {
    const { keyword, display, start } = req.query;
    const queryParams = new URLSearchParams({
        query: keyword as string,
        display: display as string,
        start: start as string,
    });
    const headers = {
        "X-Naver-Client-Id": NAVER_CLIENT_ID as string,
        "X-Naver-Client-Secret": NAVER_SECRET_KEY as string,
    };
    const url = `https://openapi.naver.com/v1/search/book.json?${queryParams}`;
    try {
        const data = await fetchData(url, headers);
        const { total, start, display, items } = data;
        res.send({ total, start, display, items });
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to get books from Naver");
    }
}

/** 도서관 정보나루 */
const buildLibraryApiUrl = (
    apiPath: string,
    params: Record<string, string>
) => {
    const queryParams = new URLSearchParams({
        ...params,
        authKey: LIBRARY_KEY as string,
        format: "json",
    });
    return `http://data4library.kr/api/${apiPath}?${queryParams}`;
};

// 정보공개 도서관 조회
export async function librarySearch(req: Request, res: Response) {
    const { dtl_region, page, pageSize } = req.query;
    const url = buildLibraryApiUrl("libSrch", {
        dtl_region: dtl_region as string,
        pageNo: page as string,
        pageSize: pageSize as string,
    });
    try {
        const data = await fetchData(url);
        const { pageNo, pageSize, numFound, resultNum, libs } = data.response;
        const formattedData = {
            pageNo,
            pageSize,
            numFound,
            resultNum,
            libraries: libs.map((item: { lib: string }) => item.lib),
        };
        res.send(formattedData);
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to get library search data");
    }
}

// 지정 도서관, 책 소장 & 대출 가능 여부
export async function bookExist(req: Request, res: Response) {
    const { isbn13, libCode } = req.query;
    const url = buildLibraryApiUrl("bookExist", {
        isbn13: isbn13 as string,
        libCode: libCode as string,
    });
    try {
        const data = await fetchData(url);
        const result = data.response?.result;
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to check book exist data");
    }
}

// 도서별 이용 분석
export async function usageAnalysisList(req: Request, res: Response) {
    const { isbn13 } = req.query;
    const url = buildLibraryApiUrl("usageAnalysisList", {
        isbn13: isbn13 as string,
        loaninfoYN: "Y" as string,
    });
    try {
        const data = await fetchData(url);
        const { book, loanHistory, loanGrps, keywords, recBooks, coLoanBooks } =
            data.response;

        const loanHistoryItems = loanHistory.map(
            (item: { loan: string }) => item.loan
        );
        const loanGrpsItems = loanGrps.map(
            (item: { loanGrp: string }) => item.loanGrp
        );
        const keywordsItems = keywords.map(
            (item: { keyword: string }) => item.keyword
        );
        const recBooksItems = recBooks.map(
            (item: { book: string }) => item.book
        );
        const coLoanBooksItems = coLoanBooks.map(
            (item: { book: string }) => item.book
        );

        res.send({
            book,
            loanHistory: loanHistoryItems,
            loanGrps: loanGrpsItems,
            keywords: keywordsItems,
            recBooks: recBooksItems,
            coLoanBooks: coLoanBooksItems,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to get usage analysis list data");
    }
}

// 도서 소장 도서관 조회
export async function librarySearchByBook(req: Request, res: Response) {
    const { isbn, region, dtl_region } = req.query;
    const url = buildLibraryApiUrl("libSrchByBook", {
        isbn: isbn as string,
        region: region as string,
        dtl_region: dtl_region as string,
    });
    try {
        const data = await fetchData(url, { method: "GET" });
        const { pageNo, pageSize, numFound, resultNum, libs } = data.response;
        res.send({
            pageNo,
            pageSize,
            numFound,
            resultNum,
            libraries: libs.map((item: { lib: string }) => item.lib),
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to get library data");
    }
}

// export function searchNaverBook(arg0: string, searchNaverBook: any) {
//     throw new Error("Function not implemented.");
// }

// export function librarySearch(arg0: string, librarySearch: any) {
//     throw new Error("Function not implemented.");
// }

// export function bookExist(arg0: string, bookExist: any) {
//     throw new Error("Function not implemented.");
// }

// export function usageAnalysisList(arg0: string, usageAnalysisList: any) {
//     throw new Error("Function not implemented.");
// }

// export function librarySearchByBook(arg0: string, librarySearchByBook: any) {
//     throw new Error("Function not implemented.");
// }

// export function searchNaverBook(arg0: string, searchNaverBook: any) {
//     throw new Error("Function not implemented.");
// }
// 111007 고덕도서관

// 도서관별 장서/대출 데이터 조회
// app.get('/library-itemSrch', function(req, res) {
//     const { libCode, keyword } = req.query

//     // console.log(keyword, libCode)

//     const lib = `libCode=${libCode}`
//     const keywordStr = `keyword=${encodeURIComponent(keyword)}`

//     const url = `${host}/srchBooks?${authKey}&keyword=%EC%97%AD%EC%82%AC&pageNo=1&pageSize=10&format=json`
//     // console.log(url)

//     axios.get(url)
//         .then( response => {
//             res.send(response.data.response.docs)
//         })
//         .catch(error => {
//             console.error(error)
//         })
// });

// 도서 상세 조회
// app.get('/srchDtlList', function(req, res) {
//     const { isbn13 } = req.query

//     const url = `${host}/srchDtlList?${authKey}&isbn13=${isbn13}&loaninfoYN=Y&format=json`
//     // console.log(url)

//     axios.get(url)
//         .then( response => {
//             const { detail, loanInfo, request} = response.data.response
//             const data = {
//                 detail: detail[0].book,
//                 loanInfo,
//                 loanInfoYN: request.loaninfoYN
//             }
//             res.send(data)
//         })
//         .catch(error => {
//             console.error(error)
//         })
// });

// app.get('/b', function(req, res) {
//     const { isbn13, libCode } = req.query
//     const isbn = `isbn13=${isbn13}`
//     const lib = `libCode=${libCode}`

//     const url1 = `${host}/srchDtlList?${authKey}&${isbn}&&${foramt}`
//     const url2 = `${host}/bookExist?${authKey}&${isbn}&${lib}&${foramt}`

//     const requestOne = axios.get(url1)
//     const requestTwo = axios.get(url2)

//     axios.all([requestOne, requestTwo]).then(axios.spread((...responses) => {
//         const responseOne = responses[0].data.response.detail[0].book
//         const responseTwo = responses[1].data.response
//         const { libCode } = responseTwo.request
//         res.send({...responseOne, libCode, ...responseTwo.result})
//     })).catch(error => {
//     })
// });
