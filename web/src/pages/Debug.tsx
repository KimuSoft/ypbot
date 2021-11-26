import React from 'react'
import { buildTimestamp, dependencyVersions, version } from '../buildInfo'
import dayjs from 'dayjs'
import styled from 'styled-components'

const Container = styled.div`
    max-width: 1100px;
    width: 100%;
    margin: 20px auto;

    th,
    td {
        border: 1px solid #fff;
        padding: 10px;
    }

    table {
        border-collapse: collapse;
    }
`

const Debug: React.FC = () => {
    return (
        <Container>
            <div style={{ fontSize: 30, fontWeight: 800 }}>YpBot {version}</div>
            <div style={{ fontSize: 20, fontWeight: 600, marginTop: 10 }}>{dayjs(buildTimestamp).format('YYYY년 MM월 DD일 HH시 MM분 ss초')}에 빌드되었습니다.</div>
            <div style={{ fontSize: 24, fontWeight: 600, marginTop: 10 }}>MODULES</div>
            <table style={{ border: '1px solid #fff', marginTop: 10 }}>
                <thead>
                    <tr>
                        <th>MODULE</th>
                        <th>VERSION</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(dependencyVersions).map(([name, version]) => (
                        <tr key={name}>
                            <td>{name}</td>
                            <td>{version}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Container>
    )
}

export default Debug
