import { useContext } from "react";
import styled from "styled-components";

import Button from "../Button";
import TheftCaseCard from "../TheftCaseCard";
import MessageContainer from "../MessageContainer";
import { TheftCaseDisplayerContext } from "./TheftCaseDisplayer";

import empty_icon from "../../assets/icons/empty_icon.svg";
import error_icon from "../../assets/icons/error_icon.svg";
import spinner_icon from "../../assets/icons/spinner_icon.svg";

const Content = styled.main`
    --theft-case-card-width: 30rem;

    display: grid;
    grid-template-columns: repeat(auto-fit, var(--theft-case-card-width));
    place-content: center;
    place-items: center;
    gap: 4rem;
`;

export default function TheftCaseDisplayerContent(): React.ReactElement {
    const context = useContext(TheftCaseDisplayerContext);

    if (context.isLoading) {
        return (
            <MessageContainer
                src={spinner_icon}
                alt="Spinner icon."
                message="Wait for a second..."
            />
        );
    }

    if (context.error) {
        return (
            <MessageContainer
                src={error_icon}
                alt="Error icon."
                message="An error occurred..."
            >
                <Button onClick={_e => context.FetchData()}>Try Again</Button>
            </MessageContainer>
        );
    }

    if (context.dataIsEmpty) {
        return (
            <MessageContainer
                src={empty_icon}
                alt="Empty icon."
                message="No results were found"
            />
        );
    }

    return (
        <Content> {
            context.theftCases?.map(theftCase =>
                <TheftCaseCard key={theftCase.id} {...theftCase} />
            )
        } </Content>
    );
}