import React from "react";
import styled from "styled-components";

import search_icon from "../assets/icons/search_icon.svg";

const Field = styled.div`
    display: flex;
    place-content: center;
    place-items: center;
    gap: 1rem;

    padding: 1rem;

    border-radius: 10px;
    color: var(--background-colour);
    background-color: var(--main-colour);
    box-shadow: var(--box-shadow);

    &>button {
        height: 2.5rem;
        aspect-ratio: 1;

        cursor: pointer;

        &>img {
            width: 100%;
            filter: invert();
        }
    }
`;

const Input = styled.input.attrs({
    type: "search",
    placeholder: "Search for bikes...",
})`

    &::-webkit-search-cancel-button {
        display: none;
    }

    &::placeholder {
        color: var(--half-white-transparent);
    }
`;

type SearchInputProps = React.HtmlHTMLAttributes<HTMLInputElement> & {
    value?: string;
    $onButtonClick?: React.HtmlHTMLAttributes<HTMLButtonElement>["onClick"];
};

export default function SearchInput(props: SearchInputProps): React.ReactElement {
    return (
        <Field>
            <Input {...props} value={props.value} />
            <button onClick={props.$onButtonClick}>
                <img src={search_icon} alt="Search icon." />
            </button>
        </Field>
    );
}