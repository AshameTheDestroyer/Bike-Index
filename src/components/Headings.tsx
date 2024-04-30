import styled from "styled-components";

const Heading = styled.h1<{
    $size: 1 | 2 | 3 | 4 | 5 | 6;
}>`
    font-size: ${props => 800 / 3 - props.$size * 100 / 3}%;
    font-weight: bold;
`;

export default Heading;