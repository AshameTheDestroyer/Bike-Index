import React, { useEffect, useState } from "react";
import styled from "styled-components";
import useFetch from "react-fetch-hook";

import Button from "./Button";
import SearchInput from "./SearchInput";
import TheftCaseCard from "./TheftCaseCard";

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

const MessageContainer = styled.section`
    display: flex;
    flex-direction: column;
    place-content: center;
    place-items: center;
    gap: 1rem;
    
    margin: auto;

    &>img {
        width: 5rem;
    }
`;

const Content = styled.main`
    display: flex;
    flex-wrap: wrap;
    place-content: center start;
    place-items: center start;
    gap: 4rem;
`;

const Footer = styled.footer`
    display: flex;
    place-content: center;
    place-items: center;
    gap: 2rem;
`;

type TheftCaseDisplayerProps = {
    theftCases: Array<TheftCase>;
};

export default function TheftCaseDisplayer(props: TheftCaseDisplayerProps): React.ReactElement {
    const [searchTerm, setSearchTerm] = useState("");

    const { isLoading, data, error } = useFetch("https://bikeindex.org:443/api/v3/search?page=1&per_page=10&location=IP&distance=10&stolenness=stolen", {
        depends: [searchTerm],
        formatter: (response) => response.json(),
    });

    function OnInputSearch(e: React.FormEvent<HTMLInputElement>): void {
        setSearchTerm((e.target as HTMLInputElement).value);
    }

    return (
        <Main>
            <Header>
                <p>Total count: 64</p>
                <p>Showing results from 1st to 10th case</p>
                <div>
                    <SearchInput value={searchTerm} onChange={OnInputSearch} />
                    <FilterButton>
                        <img src={filter_icon} alt="Filter icon." />
                        <span>Filter by</span>
                    </FilterButton>
                </div>
            </Header>
            {
                isLoading ?
                    <MessageContainer>
                        <img src={spinner_icon} alt="Spinner icon." />
                        <p>Wait for a second...</p>
                    </MessageContainer> :
                    error ?
                        <MessageContainer>
                            <img src={error_icon} alt="Error icon." />
                            <p>An error occurred...</p>
                            <Button
                                onClick={_e => {
                                    setSearchTerm(previousValue => previousValue + " ");
                                    setTimeout(() => {
                                        setSearchTerm(previousValue => previousValue.slice(0, -1));
                                    }, 1);
                                }}
                            >
                                Try Again
                            </Button>
                        </MessageContainer> :
                        <>
                            <div>{JSON.stringify(data)}</div>
                            <Content> {
                                props.theftCases
                                    .map(theftCase =>
                                        <TheftCaseCard key={theftCase?.id ?? 0} {...theftCase} />
                                    )
                            } </Content>
                            <Footer>
                                <Button $isRounded $width={2}>{"<"}</Button>
                                <Button $isRounded $width={2}>1</Button>
                                <Button $isRounded $width={2}>2</Button>
                                <Button $isRounded $width={2}>3</Button>
                                <Button $isRounded $width={2}>4</Button>
                                ...
                                <Button $isRounded $width={2}>100</Button>
                                <Button $isRounded $width={2}>{">"}</Button>
                            </Footer>
                        </>
            }
        </Main>
    );
}