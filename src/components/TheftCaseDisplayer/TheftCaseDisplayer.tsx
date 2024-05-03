import axios from "axios";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "@react-hooks-hub/use-debounce";
import React, { createContext, useEffect, useRef, useState } from "react";

import TheftCaseDisplayerHeader from "./TheftCaseDisplayerHeader";
import TheftCaseDisplayerFooter from "./TheftCaseDisplayerFooter";
import TheftCaseDisplayerContent from "./TheftCaseDisplayerContent";
import { GetTheftCaseURL, GetTotalCountURL } from "../../functions/Repository";

const Main = styled.main`
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    gap: 4rem;
`;

export type TheftCaseDisplayerContextType = {
    page: number;
    searchTerm?: string;
    resultsPerPage: number;
    stolenness?: Stolenness;

    theftCaseState?: FetchState<{ bikes: Array<Record<string, any>>; }>;
    totalCountState?: FetchState<{ stolen: number; non: number; }>;

    error?: boolean;
    isLoading?: boolean;

    totalBikeCount?: number;
    stolenBikeCount?: number;
    nonStolenBikeCount?: number;

    totalPageCount?: number;
    lastResultIndex?: number;
    firstResultIndex?: number;

    dataIsEmpty?: boolean;
    dataIsLoaded?: boolean;
    theftCases?: Array<TheftCase>;

    searchInputReference: React.MutableRefObject<HTMLDivElement>;

    UpdatePage(page: number): void;
    UpdateStolenness(stolenness: Stolenness): void;
    OnInputSearch(e: React.FormEvent<HTMLInputElement>): void;
    FetchData(type?: "theft-case" | "total-count" | "both"): void;
};

export const TheftCaseDisplayerContext = createContext<TheftCaseDisplayerContextType>(null);

type TheftCaseDisplayerProps = {
    page: number;
    resultsPerPage: number;
};

export default function TheftCaseDisplayer(props: TheftCaseDisplayerProps): React.ReactElement {
    const [searchParams, setSearchParams] = useSearchParams();
    const searchInputReference = useRef<HTMLDivElement>(null);
    const OnInputSearchDebounced = useDebounce(OnInputSearch, 400);
    const [state, setState] = useState<TheftCaseDisplayerContextType>({
        page: props.page,
        resultsPerPage: props.resultsPerPage,

        searchInputReference,

        FetchData,
        UpdatePage,
        UpdateStolenness,
        OnInputSearch: OnInputSearchDebounced,
    });

    useEffect(() => {
        setState(previousState => ({
            ...previousState,
            page: props.page,
            resultsPerPage: props.resultsPerPage,
        }));
    }, [props.page, props.resultsPerPage]);

    useEffect(() => {
        const searchTerm = searchParams.get("query") ?? "";
        const stolenness = searchParams.get("stolenness") as Stolenness ?? "all";

        setState(previousValue => ({
            ...previousValue,
            searchTerm,
            stolenness,
            theftCaseState: {
                ...previousValue.theftCaseState,
                url: GetTheftCaseURL({
                    searchTerm,
                    stolenness,
                    page: props.page,
                    resultsPerPage: props.resultsPerPage,
                }),
            },
            totalCountState: {
                ...previousValue.totalCountState,
                url: GetTotalCountURL({
                    searchTerm,
                    stolenness,
                }),
            },
        }));
    }, [searchParams]);

    useEffect(() => {
        const stolenBikeCount = state.totalCountState?.data != null ?
            state.totalCountState.data["stolen"] : -1;
        const nonStolenBikeCount = state.totalCountState?.data != null ?
            state.totalCountState.data["non"] : -1;
        const totalBikeCount = stolenBikeCount + nonStolenBikeCount;
        const totalPageCount = Math.ceil((() => {
            switch (state.stolenness) {
                case "all": return totalBikeCount;
                case "stolen": return stolenBikeCount;
                case "non": return nonStolenBikeCount;
            }
        })() / props.resultsPerPage);

        const theftCases = state.theftCaseState?.data == null ? [] :
            state.theftCaseState.data.bikes.map(datum => ({
                ...(datum as TheftCase),
                image: datum["large_img"],
                location: datum["location_found"],
                stealingDate: datum["date_stolen"] != null ? new Date(Number(datum["date_stolen"])) : null,
                extraInformation: {
                    serial: datum["serial"],
                    frameModel: datum["frame_model"],
                    frameColours: datum["frame_colors"],
                    Manufacturer: datum["manufacturer_name"],
                },
            }));

        setState(previousValue => ({
            ...previousValue,
            error: state.theftCaseState?.error || state.totalCountState?.error,
            isLoading: state.theftCaseState?.isLoading || state.totalCountState?.isLoading,

            totalBikeCount,
            stolenBikeCount,
            nonStolenBikeCount,

            totalPageCount,
            firstResultIndex: (props.page - 1) * props.resultsPerPage + 1,
            lastResultIndex: Math.min(props.page * props.resultsPerPage, totalBikeCount),

            theftCases,
            dataIsEmpty: theftCases.length == 0,
            dataIsLoaded: state.theftCaseState?.data != null && state.totalCountState?.data != null,
        }));
    }, [state.theftCaseState, state.totalCountState]);

    useEffect(() => {
        FetchData();
        searchInputReference.current.querySelector("input").value = state.searchTerm;
    }, [state.searchTerm, state.stolenness, props.page]);

    useEffect(() => {
        if (state.dataIsLoaded && !state.dataIsEmpty) {
            const paginationButton =
                document.querySelector(`.pagination-button[data-pagination-index="${props.page}"]`) as HTMLElement;
            paginationButton?.focus();
        }
    }, [state.dataIsLoaded, state.dataIsEmpty]);

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

        const url = type == "theft-case" ? state.theftCaseState?.url : state.totalCountState?.url;
        const setterCallback = ((data: {
            data: any;
            error: boolean;
            isLoading: boolean;
        }) => {
            switch (type) {
                case "theft-case":
                    setState(previousValue => ({
                        ...previousValue,
                        theftCaseState: {
                            ...previousValue.theftCaseState,
                            ...data,
                        },
                    }));
                    break;
                case "total-count":
                    setState(previousValue => ({
                        ...previousValue,
                        totalCountState: {
                            ...previousValue.totalCountState,
                            ...data,
                        },
                    }));
                    break;
            }
        });

        setterCallback({
            data: null,
            error: false,
            isLoading: true,
        });

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

    function UpdateStolenness(stolenness: Stolenness) {
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
        <TheftCaseDisplayerContext.Provider value={state}>
            <Main>
                <TheftCaseDisplayerHeader />
                <TheftCaseDisplayerContent />
                <TheftCaseDisplayerFooter />
            </Main>
        </TheftCaseDisplayerContext.Provider>
    );
}