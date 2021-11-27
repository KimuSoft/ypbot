import React from 'react'
import styled from 'styled-components'

const Button = styled.div<{ color?: string }>`
    font-size: 16px;
    padding: 10px 20px;
    min-width: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${({ color = '#5865F2' }) => color};
    outline: none;
    border: none;
    color: #fff;
    cursor: pointer;
    user-select: none;
    transition: filter 0.2s ease;
    &:hover {
        filter: brightness(0.8);
    }
    &:active {
        filter: brightness(0.6);
    }
`

export default Button
