import React from "react";
import styled from "styled-components";
import { LazyLoadImage } from "react-lazy-load-image-component";

import Heading from "./Headings";

import location_icon from "../assets/icons/location_icon.svg";
import no_image_icon from "../assets/icons/no_image_icon.svg";

const Card = styled.div`
    --padding: 1.5rem;
    
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

    overflow: hidden;
    
    &>img {
        width: 100%;
        position: absolute;
        inset: 0;

        margin: auto;

        background-color: var(--main-colour);

        object-fit: cover;
        object-position: center;

        &[data-no-image-icon] {
            background-color: transparent;
            
            object-fit: contain;
            height: 75%;
        }
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

    color: var(--half-white-transparent);
    
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

export default function TheftCaseCard(props: TheftCaseCardProps): React.ReactElement {
    return (
        <Card className="theft-case-card">
            <Figure> {
                props.image != null ?
                    <LazyLoadImage src={props.image} alt="Bike theft case reported image" /> :
                    <img src={no_image_icon} alt="No image icon." data-no-image-icon />
            } </Figure>
            <Main>
                <Heading $size={3}>{props.title}</Heading>
                <IconParagraph>
                    <img src={location_icon} />
                    <span>{props.location}</span>
                </IconParagraph>
                <Description>{props.location}</Description>
            </Main>
            <Footer>
                <p>
                    <span>Stolen since</span>
                    <span>{props.stealingDate.toDateString()}</span>
                </p>
                <p>
                    <span>Found since</span>
                    <span>{props.foundDate.toDateString()}</span>
                </p>
            </Footer>
        </Card>
    );
}