import React from "react";
import styled from "styled-components";

import Button from "./Button";
import TheftCaseCard from "./TheftCaseCard";

const Main = styled.main`
    display: flex;
    flex-direction: column;
    gap: 4rem;
`;

const Header = styled.header`
    display: flex;
    gap: 2rem;

    &>button {
        margin-left: auto;
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
    return (
        <Main>
            <Header>
                <p>Total count: 64</p>
                <p>Showing results from 1st to 10th case</p>
                <Button>Filter by</Button>
            </Header>
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
        </Main>
    );
}