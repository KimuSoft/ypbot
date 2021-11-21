import React from 'react'
import styled, { keyframes } from 'styled-components'

const Container = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    color: #fff;
    z-index: 99999;
    display: flex;
    justify-content: center;
    align-items: center;
`

const anim = keyframes`
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
`

const Loading = styled.div`
    &,
    &:after {
        border-radius: 50%;
        width: 10em;
        height: 10em;
    }
    & {
        margin: 60px auto;
        font-size: 10px;
        position: relative;
        text-indent: -9999em;
        border-top: 1.1em solid rgba(255, 255, 255, 0.2);
        border-right: 1.1em solid rgba(255, 255, 255, 0.2);
        border-bottom: 1.1em solid rgba(255, 255, 255, 0.2);
        border-left: 1.1em solid #ffffff;
        -webkit-transform: translateZ(0);
        -ms-transform: translateZ(0);
        transform: translateZ(0);
        -webkit-animation: ${anim} 1.1s infinite linear;
        animation: ${anim} 0.25s infinite linear;
    }
`

const Loader: React.FC = () => {
    return (
        <Container>
            <Loading />
        </Container>
    )
}

export default Loader
