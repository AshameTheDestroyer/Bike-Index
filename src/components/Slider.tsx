import React from "react";
import styled from "styled-components";

const Container = styled.div`
    --item-padding: 4rem;
    --padding: 1rem;

    display: grid;
    gap: 2rem;

    -ms-overflow-style: none;
    scrollbar-width: none;

    mask-image: linear-gradient(var(--mask-angle),
            transparent 0%,
            black var(--item-padding),
            black calc(100% - var(--item-padding)),
            transparent 100%);

    &[data-direction=horizontal] {
        --mask-angle: 90deg;

        grid-auto-flow: column;

        padding-block: var(--padding);

        scroll-snap-type: x mandatory;

        overflow-y: hidden;
        overflow-x: auto;

        &>* {

            &:first-child {
                margin-inline-start: var(--item-padding);
            }

            &:last-child {
                margin-inline-end: var(--item-padding);
            }
        }
    }

    &[data-direction=vertical] {
        --mask-angle: 0deg;

        padding-inline: var(--padding);

        scroll-snap-type: y mandatory;

        overflow-y: auto;
        overflow-x: hidden;

        &>* {

            &:first-child {
                margin-block-start: var(--item-padding);
            }

            &:last-child {
                margin-block-end: var(--item-padding);
            }
        }
    }

    &::-webkit-scrollbar {
        display: none;
    }

    &>* {
        white-space: nowrap;
        scroll-snap-align: center;
    }  
`;

type SliderProps = ComponentProps & {
    direction?: "horizontal" | "vertical";
};

export default function Slider(props: SliderProps): React.ReactElement {
    return (
        <Container
            id={props.id}
            className={[
                "slider",
                props.className
            ].toClassName()}

            data-direction={props.direction ?? "horizontal"}

            children={props.children}
        />
    );
}