import React, { useEffect, useRef, useState } from "react";

import Button from "./Button";

import drop_down_icon from "../assets/icons/drop_down_icon.svg";
import styled from "styled-components";

const Container = styled.div`
    --offset: 0.5rem;

    position: relative;

    &>button {
        display: flex;
        place-content: center start;
        place-items: center start;
        gap: 2rem;

        &>img {
            transition: transform 250ms;

            width: 2rem;
            height: 2rem;
        }
    }

    .drop-down-wrapper {
        position: absolute;
        top: calc(100% + var(--offset));
        left: 0.5rem;
        right: 0.5rem;

        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 0fr;

        border-radius: 1rem;

        overflow: hidden;

        transition: grid-template-rows 250ms, box-shadow 250ms;

        z-index: 1;

        .drop-down-container {
            display: flex;
            flex-direction: column;

            height: 100%;

            overflow: hidden;

            &>* {
                padding: 1rem;

                border-radius: 0;
            }
        }
    }

    &[data-is-open=true] {

        &[data-has-custom-icon=false]>button>img {
            transform: rotate(180deg);
        }

        .drop-down-wrapper {
            grid-template-rows: 1fr;
            
            box-shadow: var(--box-shadow);
        }
    }
`;

type DropDownProps = ComponentProps & {
    text: string;
    src?: string;
    alt?: string;
};

export default function DropDown(props: DropDownProps): React.ReactElement {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropDownElementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function CloseDropDown(e: MouseEvent): void {
            if (!isOpen) { return; }

            const clickedElement = (e.target as HTMLElement).closest(".drop-down");
            if (clickedElement == dropDownElementRef.current) { return; }

            setIsOpen(false);
            e.preventDefault();
        }

        document.addEventListener("click", CloseDropDown);

        return () => {
            document.removeEventListener("click", CloseDropDown);
        };
    }, [isOpen]);

    return (
        <Container
            id={props.id}
            ref={dropDownElementRef}
            className={[
                "drop-down",
                props.className,
            ].toClassName()}

            data-is-open={isOpen}
            data-has-custom-icon={props.src != null}
        >
            <Button onClick={_e => setIsOpen(previousValue => !previousValue)}>
                <img src={props.src ?? drop_down_icon} alt={props.alt ?? "Drop down icon."} />
                <p>{props.text}</p>
            </Button>

            <div className="drop-down-wrapper">
                <div className="drop-down-container" children={props.children} onClick={_e => setIsOpen(false)} />
            </div>
        </Container>
    );
}