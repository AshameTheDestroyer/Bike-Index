import React from "react";
import styled from "styled-components";
import { LazyLoadImage } from "react-lazy-load-image-component";

import Heading from "./Headings";

import location_icon from "../assets/icons/location_icon.svg";
import no_image_icon from "../assets/icons/no_image_icon.svg";

const Card = styled.div`
    --padding: 1.5rem;
    
    width: calc(var(--theft-case-card-width) - var(--padding) * 2);
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
    display: flex;
    place-content: center;
    place-items: center;

    margin: calc(var(--padding) * -1);
    margin-bottom: var(--padding);

    overflow: hidden;
    
    &>img {
        width: 100%;
        height: 100%;

        background-color: var(--main-colour);

        object-fit: cover;
        object-position: center;
        filter: invert();
    }

    &[data-no-image-icon=true] {
        background-color: var(--main-colour);

        &>img{
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

    &>h1 {
        --line-count: 1;

        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: var(--line-count);
        line-clamp: var(--line-count); 
        -webkit-box-orient: vertical;  
    }
`;

const IconParagraph = styled.p`
    display: flex;
    place-content: start;
    place-items: start;
    gap: 1ch;

    overflow: hidden;

    &>img {
        width: 2rem;
        height: 2rem;
    }

    &>span {
        --line-count: 1;

        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: var(--line-count);
        line-clamp: var(--line-count); 
        -webkit-box-orient: vertical;  
    }
`;

const Description = styled.p`
    --line-count: 4;

    flex-grow: 1;

    color: var(--half-transparent);
    
    overflow: hidden;
    word-break: break-all;
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

const Status = styled.span`
    font-weight: bold;
    text-shadow: var(--text-shadow);

    &[data-status=stolen] {
        color: red;
    }

    &[data-status=found] {
        color: lime;
    }

    &[data-status=impounded] {
        color: gold;
    }
`;

type TheftCaseCardProps = TheftCase;

export default function TheftCaseCard(props: TheftCaseCardProps): React.ReactElement {
    return (
        <Card className="theft-case-card">
            <Figure data-no-image-icon={props.image == null}> {
                props.image != null ?
                    <LazyLoadImage src={props.image} alt="Bike theft case reported image" effect="blur" /> :
                    <img src={no_image_icon} alt="No image icon." />
            } </Figure>
            <Main>
                <Heading title={props.title} $size={3}>{props.title}</Heading>
                <IconParagraph title={props.location ?? "Unlocated"}>
                    <img src={location_icon} alt="location_icon" />
                    <span>{props.location ?? "Unlocated"}</span>
                </IconParagraph>
                <Description>{props.description?.length ?? 0 > 0 ? props.description : "No description provided."}</Description>
            </Main>
            <Footer>
                <p>
                    <span>Stolen since</span>
                    <span>{props.stealingDate?.toLocaleString() ?? "No date"}</span>
                </p>
                <p>
                    <span>Status</span>
                    <Status data-status={props.status}>{props.status.toTitleCase()}</Status>
                </p>
            </Footer>
        </Card>
    );
}