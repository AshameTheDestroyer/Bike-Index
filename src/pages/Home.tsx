import React from "react";
import styled from "styled-components";

import Page from "../components/Page";
import Heading from "../components/Headings";
import TheftCaseDisplayer from "../components/TheftCaseDisplayer";

import logo from "../svgs/logo.svg";

const Header = styled.header`
    display: flex;
    place-content: center start;
    place-items: center start;
    gap: 2rem;

    margin: calc(var(--padding) * -1);
    margin-bottom: var(--padding);
    padding: 2rem;

    color: var(--background-colour);
    background-color: var(--main-colour);
`;

const Logo = styled.img`
    width: 8rem;
    aspect-ratio: 1;

    border-radius: 100%;
`;

export default function Home(): React.ReactElement {
    return (
        <Page id="home-page">
            <Header>
                <Logo src={logo} alt="The logo of the website." />
                <Heading $size={1}>Bike Index</Heading>
            </Header>
            <TheftCaseDisplayer
                theftCases={new Array(10).fill(null)}
            />
        </Page>
    );
}