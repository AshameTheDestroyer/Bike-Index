import styled from "styled-components";
import useFetch from "react-fetch-hook";
import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "@react-hooks-hub/use-debounce";

import Slider from "./Slider";
import Button from "./Button";
import LinkButton from "./LinkButton";
import SearchInput from "./SearchInput";
import TheftCaseCard from "./TheftCaseCard";
import MessageContainer from "./MessageContainer";

import empty_icon from "../assets/icons/empty_icon.svg";
import error_icon from "../assets/icons/error_icon.svg";
import filter_icon from "../assets/icons/filter_icon.svg";
import spinner_icon from "../assets/icons/spinner_icon.svg";

const Main = styled.main`
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    gap: 4rem;
`;

const Header = styled.header`
    display: flex;
    flex-wrap: wrap;
    place-content: center stretch;
    place-items: center stretch;
    gap: 2rem;

    &>div {
        display: flex;
        place-content: center;
        place-items: center;
        gap: 2rem;

        margin-left: auto;
    }
`;

const FilterButton = styled(Button)`
    display: flex;
    place-content: center;
    place-items: center;
    gap: 1rem;

    &>img {
        width: 2.5rem;

        transition: filter 250ms;
    }

    &:is(:hover, :focus-visible)>img {
        filter: invert();
    }
`;

const Content = styled.main`
    --theft-case-card-width: 30rem;

    display: grid;
    grid-template-columns: repeat(auto-fit, var(--theft-case-card-width));
    place-content: center;
    place-items: center;
    gap: 4rem;
`;

const Footer = styled.footer`
    display: grid;
    grid-template-columns: auto auto auto;
    grid-auto-flow: column;
    place-content: center stretch;
    place-items: center stretch;
    gap: 2rem;
`;

type TheftCaseDisplayerProps = {
    page: number;
    resultsPerPage: number;
};

export default function TheftCaseDisplayer(props: TheftCaseDisplayerProps): React.ReactElement {
    const [searchParams, setSearchParams] = useSearchParams();
    const searchTerm = searchParams.get("query") ?? "";

    const OnInputSearchDebounced = useDebounce(OnInputSearch, 400);

    const theftCaseURL = "https://bikeindex.org:443/api/v3/search?" + new URLSearchParams({
        location: "IP",
        distance: "10",
        query: searchTerm,
        stolenness: "stolen",
        page: props.page.toString(),
        per_page: props.resultsPerPage.toString(),
    });

    const totalCountURL = "https://bikeindex.org:443/api/v3/search/count?" + new URLSearchParams({
        location: "IP",
        distance: "10",
        query: searchTerm,
        stolenness: "stolen",
    });

    const {
        isLoading: isLoadingTheftCases,
        data: theftCaseData,
        error: errorOnTheftCases,
    } = useFetch(theftCaseURL, {
        depends: [searchTerm],
        formatter: (response) => response.json(),
    });

    const {
        isLoading: isLoadingTotalCount,
        data: totalCountData,
        error: errorOnTotalCount,
    } = useFetch(totalCountURL, {
        depends: [searchTerm],
        formatter: (response) => response.json(),
    });

    console.log(theftCaseData, totalCountData);

    const isLoading = isLoadingTheftCases || isLoadingTotalCount;
    const error = errorOnTheftCases || errorOnTotalCount;

    const stolenBikeCount: number = totalCountData != null ? totalCountData["stolen"] : -1;
    const nonStolenBikeCount: number = totalCountData != null ? totalCountData["non"] : -1;
    const totalBikeCount = stolenBikeCount + nonStolenBikeCount;

    const firstResultIndex = (props.page - 1) * props.resultsPerPage + 1;
    const lastResultIndex = Math.min(props.page * props.resultsPerPage, totalBikeCount);

    const totalPageCount = Math.ceil(totalBikeCount / props.resultsPerPage);

    const theftCases = theftCaseData == null ? [] :
        (theftCaseData.bikes as Array<Record<string, any>>).map<TheftCase>(datum => ({
            id: datum["id"],
            title: datum["title"],
            status: datum["status"],
            image: datum["large_img"],
            location: datum["location_found"],
            description: datum["description"],
            stealingDate: datum["date_stolen"] != null ? new Date(Number(datum["date_stolen"])) : null,
            extraInformation: {
                serial: datum["serial"],
                frameModel: datum["frame_model"],
                frameColours: datum["frame_colors"],
                Manufacturer: datum["manufacturer_name"],
            },
        }));

    const dataIsLoaded = !isLoading && !error;
    const dataIsEmpty = theftCases.length == 0;

    useEffect(() => {
        FetchData();
    }, [props.page]);

    useEffect(() => {
        if (dataIsLoaded && !dataIsEmpty) {
            const paginationButton =
                document.querySelector(`.pagination-button[data-pagination-index="${props.page}"]`) as HTMLElement;
            paginationButton?.focus();
        }
    }, [dataIsLoaded, dataIsEmpty]);

    function OnInputSearch(e: React.FormEvent<HTMLInputElement>): void {
        setSearchParams(previousValue => {
            previousValue.delete("page");
            previousValue.set("query", (e.target as HTMLInputElement).value);
            return previousValue;
        });
    }

    function FetchData() {
        setSearchParams(previousValue => {
            previousValue.set("query", searchTerm + "_");
            return previousValue;
        });

        setTimeout(() => {

            setSearchParams(previousValue => {
                previousValue.set("query", searchTerm.slice(0, -1));
                return previousValue;
            });
        }, 1);
    }

    return (
        <Main>
            <Header>
                {
                    isLoading ?
                        <p> {
                            isLoadingTheftCases ?
                                "Waiting for results to compute..." :
                                "Now computing results..."
                        } </p> :
                        dataIsEmpty ? <></> :
                            <p>
                                Showing results from&nbsp;
                                <strong>{firstResultIndex.toNth()}</strong>&nbsp;
                                to&nbsp;
                                <strong>{lastResultIndex.toNth()}</strong>&nbsp;
                                case, with&nbsp;
                                <strong>{stolenBikeCount}</strong>&nbsp;
                                stolen, and&nbsp;
                                <strong>{nonStolenBikeCount}</strong>&nbsp;
                                non-stolen,&nbsp;
                                (<strong>{totalBikeCount}</strong> in total)
                            </p>
                }
                <div>
                    <SearchInput
                        $onButtonClick={FetchData}
                        onChange={OnInputSearchDebounced}
                    />
                    <FilterButton>
                        <img src={filter_icon} alt="Filter icon." />
                        <span>Filter by</span>
                    </FilterButton>
                </div>
            </Header>

            {(() => {
                if (isLoading) {
                    return (
                        <MessageContainer
                            src={spinner_icon}
                            alt="Spinner icon."
                            message="Wait for a second..."
                        />
                    );
                } else if (error) {
                    return (
                        <MessageContainer
                            src={error_icon}
                            alt="Error icon."
                            message="An error occurred..."
                        >
                            <Button onClick={FetchData}>Try Again</Button>
                        </MessageContainer>
                    );
                } else if (dataIsEmpty) {
                    return (
                        <MessageContainer
                            src={empty_icon}
                            alt="Empty icon."
                            message="No results were found"
                        />
                    );
                }

                return (
                    <Content> {
                        theftCases.map(theftCase =>
                            <TheftCaseCard key={theftCase?.id ?? 0} {...theftCase} />
                        )
                    } </Content>
                );
            })()}

            {
                dataIsLoaded && !dataIsEmpty &&
                <Footer>
                    {
                        props.page > 1 &&
                        <>
                            <LinkButton $isRounded $width={2} $link={`./?page=${1}&query=${searchTerm}`}>{"<<"}</LinkButton>
                            <LinkButton $isRounded $width={2} $link={`./?page=${props.page - 1}&query=${searchTerm}`}>{"<"}</LinkButton>
                        </>
                    }
                    <Slider> {
                        new Array(totalPageCount)
                            .fill(null)
                            .map((_, i) =>
                                <LinkButton
                                    key={i}
                                    data-pagination-index={i + 1}
                                    className={`pagination-button`}

                                    $width={2}
                                    $isRounded
                                    $isPrimary={props.page == i + 1}
                                    $link={`./?page=${i + 1}&query=${searchTerm}`}

                                    children={i + 1}
                                />
                            )
                    } </Slider>
                    {
                        props.page < totalPageCount &&
                        <>
                            <LinkButton $isRounded $width={2} $link={`./?page=${props.page + 1}&query=${searchTerm}`}>{">"}</LinkButton>
                            <LinkButton $isRounded $width={2} $link={`./?page=${totalPageCount}&query=${searchTerm}`}>{">>"}</LinkButton>
                        </>
                    }
                </Footer>
            }
        </Main>
    );
}