import React from "react";
import styled from "styled-components";

import Heading from "./Headings";

import location_icon from "../svgs/location_icon.svg";

const Card = styled.div`
    --padding: 1.5rem;
    
    max-width: 25rem;
    aspect-ratio: 5 / 8;
    
    display: grid;
    grid-template-rows: 1fr 1fr auto;
    
    padding: var(--padding);
    
    border-radius: 10px;
    background-color: var(--background-colour);
    box-shadow: 0px 3px 3px 3px var(--half-transparent);
    
    transition: transform 250ms;
    
    overflow: hidden;

    &:hover {
        transform: scale(1.02);
    }
`;

const Figure = styled.figure`
    position: relative;
    
    margin: calc(var(--padding) * -1);
    margin-bottom: var(--padding);
    
    &>img {
        position: absolute;
        inset: 0;

        background-color: var(--main-colour);
    }
`;

const Main = styled.main`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const IconParagraph = styled.p`
    display: flex;
    gap: 1rem;
`;

const Description = styled.p`
    --line-count: 4;
    
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: var(--line-count);
    line-clamp: var(--line-count); 
    -webkit-box-orient: vertical;  
`;


const Footer = styled.footer`
    display: grid;
    grid-auto-flow: column;

    padding: 1rem;
    margin: calc(var(--padding) * -1);
    margin-top: var(--padding);

    color: var(--background-colour);
    background-color: var(--main-colour);

    &>p {
        display: flex;
        flex-direction: column;
        place-content: center;
        place-items: center;
    }
`;

type TheftCaseCardProps = TheftCase;

export default function TheftCaseCard(_props: TheftCaseCardProps): React.ReactElement {
    return (
        <Card className="theft-case-card">
            <Figure>
                <img src="" alt="Bike theft case reported image" />
            </Figure>
            <Main>
                <Heading $size={3}>Case Title</Heading>
                <IconParagraph>
                    <img src={location_icon} />
                    <span>Location</span>
                </IconParagraph>
                <Description>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit nulla doloribus voluptates iusto, consectetur doloremque vero nisi aspernatur eius rem? A esse corporis accusamus nulla rem mollitia porro consectetur harum.</Description>
            </Main>
            <Footer>
                <p>
                    <span>Theft since</span>
                    <span>1/1/2024</span>
                </p>
                <p>
                    <span>Reported at</span>
                    <span>1/1/2024</span>
                </p>
            </Footer>
        </Card>
    );
}