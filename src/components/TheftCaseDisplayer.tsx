import React, { useEffect, useState } from "react";
import styled from "styled-components";
import useFetch from "react-fetch-hook";

import Button from "./Button";
import SearchInput from "./SearchInput";
import TheftCaseCard from "./TheftCaseCard";

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
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(20rem, 30rem));
    place-content: center;
    place-items: center;
    gap: 4rem;
`;

const Footer = styled.footer`
    display: flex;
    place-content: center;
    place-items: center;
    gap: 2rem;
`;

export default function TheftCaseDisplayer(): React.ReactElement {
    const [searchTerm, setSearchTerm] = useState("");
    const { isLoading, data, error } = useFetch(`https://bikeindex.org:443/api/v3/search?page=1&per_page=10&location=IP&distance=10&stolenness=stolen&query=${searchTerm}`, {
        depends: [searchTerm],
        formatter: (response) => response.json(),
    });
    if (data) console.log(data);


    const theftCases = data == null ? [] :
        (data.bikes as Array<Record<string, any>>).map<TheftCase>(datum => ({
            id: datum.id,
            title: datum.title,
            status: datum.status,
            foundDate: new Date(),
            image: datum.large_img,
            location: datum.location_found,
            description: datum.description,
            stealingDate: new Date(Number(datum.date_stolen)),
            extraInformation: {
                serial: datum.serial,
                frameModel: datum.frame_model,
                frameColours: datum.frame_colors,
                Manufacturer: datum.manufacturer_name,
            },
        }));

    const dataIsLoaded = !isLoading && !error;
    const dataIsEmpty = theftCases.length == 0;

    useEffect(() => {
        FetchData();
    }, []);

    function OnInputSearch(e: React.FormEvent<HTMLInputElement>): void {
        setSearchTerm((e.target as HTMLInputElement).value);
    }

    function FetchData() {
        setSearchTerm(previousValue => previousValue + " ");
        setTimeout(() => {
            setSearchTerm(previousValue => previousValue.slice(0, -1));
        }, 1);
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

            {(() => {
                if (isLoading) { return <LoadingMessage />; }
                if (error) { return <ErrorMessage TryAgainCallback={FetchData} />; }
                if (dataIsEmpty) { return <EmptyMessage />; }

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
                    <Button $isRounded $width={2}>{"<"}</Button>
                    <Button $isRounded $width={2}>1</Button>
                    <Button $isRounded $width={2}>2</Button>
                    <Button $isRounded $width={2}>3</Button>
                    <Button $isRounded $width={2}>4</Button>
                    ...
                    <Button $isRounded $width={2}>100</Button>
                    <Button $isRounded $width={2}>{">"}</Button>
                </Footer>
            }
        </Main>
    );
}

function LoadingMessage(): React.ReactElement {
    return (
        <MessageContainer>
            <img src={spinner_icon} alt="Spinner icon." />
            <p>Wait for a second...</p>
        </MessageContainer>
    );
}

type ErrorMessageProps = {
    TryAgainCallback: () => void;
};

function ErrorMessage(props: ErrorMessageProps): React.ReactElement {
    return (
        <MessageContainer>
            <img src={error_icon} alt="Error icon." />
            <p>An error occurred...</p>
            <Button onClick={props.TryAgainCallback}>Try Again</Button>
        </MessageContainer>
    );
}

function EmptyMessage(): React.ReactElement {
    return (
        <MessageContainer>
            <img src={empty_icon} alt="Empty icon." />
            <p>No results were found</p>
        </MessageContainer>
    );
}