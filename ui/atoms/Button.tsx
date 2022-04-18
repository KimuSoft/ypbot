import styled from 'styled-components'

export const Button = styled.button`
    padding: 12px 24px;
    border-radius: 16px;
    transition: all ease 0.2s;
    user-select: none;
    outline: none;

    &:not(:disabled) {
        cursor: pointer;
        &:hover,
        &:focus {
            filter: brightness(0.9);
        }
        &:active {
            filter: brightness(0.8);
        }
    }
`
