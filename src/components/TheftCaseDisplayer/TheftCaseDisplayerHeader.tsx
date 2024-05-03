import { useContext } from "react";
import styled from "styled-components";

import Button from "../Button";
import DropDown from "../DropDown";
import SearchInput from "../SearchInput";
import { TheftCaseDisplayerContext } from "./TheftCaseDisplayer";

import filter_icon from "../../assets/icons/filter_icon.svg";

const Header = styled.header`
    display: flex;
    flex-wrap: wrap;
    place-content: center stretch;
    place-items: center stretch;
    gap: 2rem;

    &>div {
        display: flex;
        flex-wrap: wrap;
        place-content: center;
        place-items: center;
        gap: 2rem;

        margin-left: auto;
    }
`;

const FilterButton = styled(DropDown)`
    display: flex;
    place-content: center;
    place-items: center;
    gap: 1rem;

    img {
        width: 2.5rem;

        transition: filter 250ms;
    }

    &:is(:hover, :focus):not(:has(.drop-down-wrapper:hover)) img {
        filter: invert();
    }

    .drop-down-wrapper {
        padding: 0;
        
        background-color: var(--main-colour);

        transition: grid-template-rows 250ms, box-shadow 250ms, padding 250ms;

        .drop-down-container {
            border-radius: inherit;

            button {
                place-content: center start;
                place-items: center start;
            }
        }
    }

    &[data-is-open=true] {

        .drop-down-wrapper {
            padding: 3px;
        }
    }
`;

export default function TheftCaseDisplayerHeader(): React.ReactElement {
    const context = useContext(TheftCaseDisplayerContext);

    return (
        <Header>
            {
                context.isLoading ? <p> {
                    context.theftCaseState?.isLoading ?
                        "Waiting for results to compute..." :
                        "Now computing results..."
                } </p> : context.dataIsEmpty ? <></> :
                    <p>
                        Showing results from&nbsp;
                        <strong>{context.firstResultIndex?.toNth()}</strong>&nbsp;
                        to&nbsp;
                        <strong>{context.lastResultIndex?.toNth()}</strong>&nbsp;
                        case, with&nbsp;
                        <strong>{context.stolenBikeCount}</strong>&nbsp;
                        stolen, and&nbsp;
                        <strong>{context.nonStolenBikeCount}</strong>&nbsp;
                        non-stolen,&nbsp;
                        (<strong>{context.totalBikeCount}</strong> in total)
                    </p>
            }
            <div>
                <SearchInput
                    $ref={context.searchInputReference}
                    $onButtonClick={_e => context.FetchData()}
                    onChange={context.OnInputSearch}
                />
                <FilterButton text="Filter by" src={filter_icon} alt="Filter icon.">
                    <Button $isPrimary={context.stolenness == "all"} onClick={_e => context.UpdateStolenness("all")}>All</Button>
                    <Button $isPrimary={context.stolenness == "stolen"} onClick={_e => context.UpdateStolenness("stolen")}>Stolen</Button>
                    <Button $isPrimary={context.stolenness == "non"} onClick={_e => context.UpdateStolenness("non")}>Non-Stolen</Button>
                </FilterButton>
            </div>
        </Header>
    );
}