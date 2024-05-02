import axios from "axios";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "@react-hooks-hub/use-debounce";

import Slider from "./Slider";
import Button from "./Button";
import DropDown from "./DropDown";
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
        flex-wrap: wrap;
        place-content: center;
        place-items: center;
        gap: 2rem;

        margin-left: auto;
    }
`;

const FilterButton = styled(DropDown)`
    display: flex;
    place-content: center;
    place-items: center;
    gap: 1rem;

    img {
        width: 2.5rem;

        transition: filter 250ms;
    }

    &:is(:hover, :focus):not(:has(.drop-down-wrapper:hover)) img {
        filter: invert();
    }

    .drop-down-wrapper {
        padding: 0;
        
        background-color: var(--main-colour);

        transition: grid-template-rows 250ms, box-shadow 250ms, padding 250ms;

        .drop-down-container {
            border-radius: inherit;

            button {
                place-content: center start;
                place-items: center start;
            }
        }
    }

    &[data-is-open=true] {

        .drop-down-wrapper {
            padding: 3px;
        }
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
    grid-template-columns: auto auto 1fr auto auto;
    place-self: center;
    grid-auto-flow: column;
    place-content: center stretch;
    place-items: center stretch;
    gap: 2rem;

    &>[data-is-hidden=true] {
        visibility: hidden;
    }
`;

type TheftCaseDisplayerProps = {
    page: number;
    resultsPerPage: number;
};

export default function TheftCaseDisplayer(props: TheftCaseDisplayerProps): React.ReactElement {
    const [searchParams, setSearchParams] = useSearchParams();
    const searchTerm = searchParams.get("query") ?? "";
    const stolenness = searchParams.get("stolenness") as "all" | "stolen" | "non" ?? "all";

    const OnInputSearchDebounced = useDebounce(OnInputSearch, 400);

    const theftCaseURL = "https://bikeindex.org:443/api/v3/search?" + new URLSearchParams({
        location: "IP",
        distance: "10",
        query: searchTerm,
        stolenness: stolenness,
        page: props.page.toString(),
        per_page: props.resultsPerPage.toString(),
    });

    const totalCountURL = "https://bikeindex.org:443/api/v3/search/count?" + new URLSearchParams({
        location: "IP",
        distance: "10",
        query: searchTerm,
        stolenness: stolenness,
    });

    const [{
        data: theftCaseData,
        error: errorOnTheftCases,
        isLoading: isLoadingTheftCases,
    }, setTheftCaseDataStatus] = useState({
        data: null,
        error: false,
        isLoading: false,
    });

    const [{
        data: totalCountData,
        error: errorOnTotalCount,
        isLoading: isLoadingTotalCount,
    }, setTotalCountDataStatus] = useState({
        data: null,
        error: false,
        isLoading: false,
    });

    const isLoading = isLoadingTheftCases || isLoadingTotalCount;
    const error = errorOnTheftCases || errorOnTotalCount;

    const stolenBikeCount: number = totalCountData != null ? totalCountData["stolen"] : -1;
    const nonStolenBikeCount: number = totalCountData != null ? totalCountData["non"] : -1;
    const totalBikeCount = stolenBikeCount + nonStolenBikeCount;

    const firstResultIndex = (props.page - 1) * props.resultsPerPage + 1;
    const lastResultIndex = Math.min(props.page * props.resultsPerPage, totalBikeCount);

    const totalPageCount = Math.ceil((() => {
        switch (stolenness) {
            case "all": return totalBikeCount;
            case "stolen": return stolenBikeCount;
            case "non": return nonStolenBikeCount;
        }
    })() / props.resultsPerPage);

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
    }, [searchTerm, props.page, stolenness]);

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

    function FetchData(type: "theft-case" | "total-count" | "both" = "both") {
        if (type == "both") {
            FetchData("theft-case");
            FetchData("total-count");
            return;
        }

        const url = type == "theft-case" ? theftCaseURL : totalCountURL;
        const setterCallback = ((data: {
            data: any;
            error: boolean;
            isLoading: boolean;
        }) => {
            switch (type) {
                case "theft-case":
                    setTheftCaseDataStatus({ ...data });
                    break;
                case "total-count":
                    setTotalCountDataStatus({ ...data });
                    break;
            }
        });

        setterCallback({
            data: null,
            error: false,
            isLoading: true,
        });

        console.log(url);

        axios.get(url)
            .then(result => setterCallback({
                data: result.data,
                error: false,
                isLoading: false,
            }))
            .catch(_error => setterCallback({
                data: null,
                error: true,
                isLoading: false,
            }));
    }

    function UpdateStolenness(stolenness: string) {
        setSearchParams(previousValue => {
            previousValue.delete("page");
            previousValue.set("stolenness", stolenness);
            return previousValue;
        });
    }

    function UpdatePage(page: number) {
        setSearchParams(previousValue => {
            previousValue.set("page", page.toString());
            return previousValue;
        });
    }

    return (
        <Main>
            <HeaderContent
                isLoading={isLoading}
                dataIsEmpty={dataIsEmpty}
                totalBikeCount={totalBikeCount}
                lastResultIndex={lastResultIndex}
                stolenBikeCount={stolenBikeCount}
                firstResultIndex={firstResultIndex}
                isLoadingTheftCases={isLoadingTheftCases}
                nonStolenBikeCount={nonStolenBikeCount}

                FetchData={FetchData}
                UpdateStolenness={UpdateStolenness}
                OnInputSearch={OnInputSearchDebounced}
            />

            <MainContent
                error={error}
                isLoading={isLoading}
                theftCases={theftCases}
                dataIsEmpty={dataIsEmpty}

                FetchData={FetchData}
            />

            <FooterContent
                page={props.page}
                searchTerm={searchTerm}
                dataIsEmpty={dataIsEmpty}
                dataIsLoaded={dataIsLoaded}
                totalPageCount={totalPageCount}

                UpdatePage={UpdatePage}
            />

        </Main>
    );
}

type HeaderContentProps = {
    isLoading: boolean;
    dataIsEmpty: boolean;
    totalBikeCount: number;
    lastResultIndex: number;
    stolenBikeCount: number;
    firstResultIndex: number;
    nonStolenBikeCount: number;
    isLoadingTheftCases: boolean;

    UpdateStolenness: (stolenness: string) => void;
    OnInputSearch: (e: React.FormEvent<HTMLInputElement>) => void;
    FetchData: (type?: "theft-case" | "total-count" | "both") => void;
};

function HeaderContent(props: HeaderContentProps): React.ReactElement {
    return (
        <Header>
            {
                props.isLoading ? <p> {
                    props.isLoadingTheftCases ?
                        "Waiting for results to compute..." :
                        "Now computing results..."
                } </p> : props.dataIsEmpty ? <></> :
                    <p>
                        Showing results from&nbsp;
                        <strong>{props.firstResultIndex.toNth()}</strong>&nbsp;
                        to&nbsp;
                        <strong>{props.lastResultIndex.toNth()}</strong>&nbsp;
                        case, with&nbsp;
                        <strong>{props.stolenBikeCount}</strong>&nbsp;
                        stolen, and&nbsp;
                        <strong>{props.nonStolenBikeCount}</strong>&nbsp;
                        non-stolen,&nbsp;
                        (<strong>{props.totalBikeCount}</strong> in total)
                    </p>
            }
            <div>
                <SearchInput
                    $onButtonClick={_e => props.FetchData()}
                    onChange={props.OnInputSearch}
                />
                <FilterButton text="Filter by" src={filter_icon} alt="Filter icon.">
                    <Button onClick={_e => props.UpdateStolenness("all")}>All</Button>
                    <Button onClick={_e => props.UpdateStolenness("stolen")}>Stolen</Button>
                    <Button onClick={_e => props.UpdateStolenness("non")}>Non-Stolen</Button>
                </FilterButton>
            </div>
        </Header>
    );
}

type MainContentProps = {
    error: boolean;
    isLoading: boolean;
    dataIsEmpty: boolean;
    theftCases: Array<TheftCase>;

    FetchData: (type?: "theft-case" | "total-count" | "both") => void;
};

function MainContent(props: MainContentProps): React.ReactElement {
    if (props.isLoading) {
        return (
            <MessageContainer
                src={spinner_icon}
                alt="Spinner icon."
                message="Wait for a second..."
            />
        );
    }

    if (props.error) {
        return (
            <MessageContainer
                src={error_icon}
                alt="Error icon."
                message="An error occurred..."
            >
                <Button onClick={_e => props.FetchData()}>Try Again</Button>
            </MessageContainer>
        );
    }

    if (props.dataIsEmpty) {
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
            props.theftCases.map(theftCase =>
                <TheftCaseCard key={theftCase.id} {...theftCase} />
            )
        } </Content>
    );
}

type FooterContentProps = {
    page: number;
    searchTerm: string;
    dataIsEmpty: boolean;
    dataIsLoaded: boolean;
    totalPageCount: number;

    UpdatePage: (page: number) => void;
};

function FooterContent(props: FooterContentProps): React.ReactElement {
    if (!props.dataIsLoaded || props.dataIsEmpty) {
        return <></>;
    }

    function NavigationButton(props_: React.HTMLAttributes<HTMLButtonElement> & {
        text: string;
        page: number;
        basePage?: number;
        isOpened?: boolean;
    }) {
        return (
            <Button
                $width={2}
                $isRounded
                $isPrimary={props_.isOpened}
                data-is-hidden={props.page == props_.basePage}
                data-pagination-index={props_.basePage == null ? props_.page : null}

                onClick={_e => props.UpdatePage(props_.page)}
            >
                {props_.text}
            </Button>
        );
    }

    return (
        <Footer>
            <NavigationButton text="<<" basePage={1} page={1} />
            <NavigationButton text="<" basePage={1} page={props.page - 1} />
            <Slider> {
                new Array(props.totalPageCount)
                    .fill(null)
                    .map((_, i) =>
                        <NavigationButton
                            key={i}
                            className={`pagination-button`}

                            page={i + 1}
                            isOpened={props.page == i + 1}

                            text={(i + 1).toString()}
                        />
                    )
            } </Slider>
            <NavigationButton text=">" basePage={props.totalPageCount} page={props.page + 1} />
            <NavigationButton text=">>" basePage={props.totalPageCount} page={props.totalPageCount} />
        </Footer>
    );
}