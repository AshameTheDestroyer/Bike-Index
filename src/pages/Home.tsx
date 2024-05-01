import React from "react";
import styled from "styled-components";
import "react-lazy-load-image-component/src/effects/blur.css";
import { LazyLoadImage } from "react-lazy-load-image-component";

import Page from "../components/Page";
import Heading from "../components/Headings";
import TheftCaseDisplayer from "../components/TheftCaseDisplayer";

import logo from "../assets/icons/logo.svg";
import banner from "../assets/images/banner.jpg";

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
            <TheftCaseDisplayer />
        </Page>
    );
}