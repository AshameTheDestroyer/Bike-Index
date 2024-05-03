export function GetTheftCaseURL(args: {
    page: number;
    searchTerm: string;
    stolenness: Stolenness;
    resultsPerPage: number;
}) {
    return "https://bikeindex.org:443/api/v3/search?" + new URLSearchParams({
        location: "IP",
        distance: "10",
        query: args.searchTerm,
        stolenness: args.stolenness,
        page: args.page.toString(),
        per_page: args.resultsPerPage.toString(),
    });
}

export function GetTotalCountURL(args: {
    searchTerm: string;
    stolenness: Stolenness;
}) {
    return "https://bikeindex.org:443/api/v3/search/count?" + new URLSearchParams({
        location: "IP",
        distance: "10",
        query: args.searchTerm,
        stolenness: args.stolenness,
    });
}