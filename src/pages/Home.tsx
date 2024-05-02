import React from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";

import Page from "../components/Page";
import Heading from "../components/Headings";
import LinkButton from "../components/LinkButton";
import MessageContainer from "../components/MessageContainer";
import TheftCaseDisplayer from "../components/TheftCaseDisplayer";

import logo from "../assets/icons/logo.svg";
import banner from "../assets/images/banner.jpg";
import forbidden_icon from "../assets/icons/forbidden_icon.svg";

const Header = styled.header`
    --inner-padding: 2rem;
    
    display: flex;
    place-content: center start;
    place-items: center start;
    gap: 2rem;

    margin: calc(var(--padding) * -1);
    margin-bottom: var(--padding);
    padding: var(--inner-padding);

    color: var(--background-colour);
    background-color: var(--main-colour);

    overflow: hidden;

    background:
        linear-gradient(135deg, var(--main-lighter-colour) 25%, transparent 25%) -40px 0/ 80px 80px,
        linear-gradient(225deg, var(--main-darker-colour) 25%, transparent 25%) -40px 0/ 80px 80px,
        linear-gradient(315deg, var(--main-lighter-colour) 25%, transparent 25%) 0px 0/ 80px 80px,
        linear-gradient(45deg, var(--main-darker-colour) 25%, var(--main-colour) 25%) 0px 0/ 80px 80px;

    &>h1 {
        margin-right: auto;
    }
`;

const Logo = styled.img`
    width: 8rem;
    aspect-ratio: 1;

    border-radius: 100%;
`;

const Banner = styled.figure`
    position: relative;
    transform: scale(1.5);
    
    margin: calc(var(--inner-padding) * -1);

    img {
        width: max(30vw, 30rem);
        height: 15rem;

        mask-image: linear-gradient(to right, transparent, white 30%);

        object-fit: cover;
        object-position: 50% 30%;
    }
`;

export default function Home(): React.ReactElement {
    const [searchParams, _setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page") ?? 1);
    const RESULTS_PER_PAGE = 10;

    return (
        <Page id="home-page">
            <Header>
                <Logo id="logo" src={logo} alt="The logo of the website." />
                <Heading $size={1}>Bike Index</Heading>
                <Banner>
                    <LazyLoadImage
                        id="banner"

                        src={banner}
                        effect="blur"
                        alt="The website's banner; someone's riding a bike."
                    />
                </Banner>
            </Header>
            {
                page <= 0 ?
                    <MessageContainer
                        src={forbidden_icon}
                        alt="Forbidden icon."
                        message="Wrong page!"
                    >
                        <LinkButton $link="./">Go back</LinkButton>
                    </MessageContainer> :
                    <TheftCaseDisplayer page={page} resultsPerPage={RESULTS_PER_PAGE} />
            }
        </Page>
    );
}