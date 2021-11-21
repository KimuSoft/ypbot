import React from 'react'
import styled from 'styled-components'
import { useCurrentGuild } from '../../hooks/useCurrentGuild'
import Select, { components, OptionProps, SingleValueProps, useStateManager } from 'react-select'
import { useGuildList } from '../../hooks/useGuildList'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Container = styled.div`
    background: #202225;
    width: 300px;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    gap: 20px;
`

const CustomOption: React.FC<OptionProps> = ({ children, data, ...rest }) => {
    const d = data as { icon: string; label: string }
    return (
        <components.Option data={data} {...rest}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                    style={{
                        overflow: 'hidden',
                        borderRadius: 50,
                        width: 30,
                        height: 30,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: '#36393f',
                        fontWeight: 600,
                    }}
                >
                    {d.icon ? <img width="100%" height="100%" src={d.icon} alt="" style={{ border: 'none' }} /> : <div>{d.label.slice(0, 1).toUpperCase()}</div>}
                </div>
                <div style={{ flexGrow: 1, width: 0 }}>
                    <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{children}</div>
                </div>
            </div>
        </components.Option>
    )
}

const CustomSingleValue: React.FC<SingleValueProps> = ({ children, data, ...rest }) => {
    const d = data as { icon: string; label: string }
    return (
        <components.SingleValue {...rest} data={data}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                    style={{
                        overflow: 'hidden',
                        borderRadius: 50,
                        width: 30,
                        height: 30,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: '#36393f',
                        fontWeight: 600,
                    }}
                >
                    {d.icon ? <img width="100%" height="100%" src={d.icon} alt="" style={{ border: 'none' }} /> : <div>{d.label.slice(0, 1).toUpperCase()}</div>}
                </div>
                <div style={{ flexGrow: 1, width: 0 }}>
                    <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{children}</div>
                </div>
            </div>
        </components.SingleValue>
    )
}

const BackButton = styled(Link)`
    display: flex;
    gap: 10px;
    opacity: 0.7;
    color: #fff;
    text-decoration: none;
    align-items: center;
    user-select: none;
    transition: opacity 0.2s ease-in-out;
    &:hover {
        opacity: 1;
    }
`

const Sidebar: React.FC = () => {
    const guilds = useGuildList().filter((x) => x.invited)
    const guild = useCurrentGuild()
    const navigate = useNavigate()
    const stateManager = useStateManager({
        onChange: ({ value }) => {
            navigate(`/servers/${value}`)
        },
        isSearchable: false,
    })

    const options = guilds.map((x) => ({
        label: x.name,
        value: x.id,
        icon: x.icon,
    }))

    return (
        <Container>
            <BackButton to="/servers">
                <FontAwesomeIcon icon={['fas', 'arrow-left']} />
                돌아가기
            </BackButton>
            <Select
                components={{
                    Option: CustomOption,
                    SingleValue: CustomSingleValue,
                }}
                styles={{
                    control: (styles) => ({
                        ...styles,
                        background: '#202225',
                    }),
                    menu: (styles) => ({
                        ...styles,
                        background: '#2f3136',
                    }),
                    menuList: (styles) => ({
                        ...styles,
                        background: '#2f3136',
                    }),
                    option: (styles, { isFocused }) => ({
                        ...styles,
                        background: isFocused ? '#202225' : '#2f3136',
                        color: '#fff',
                    }),
                    placeholder: (styles) => ({
                        ...styles,
                        color: '#fff',
                    }),
                    singleValue: (styles) => ({
                        ...styles,
                        color: '#fff',
                    }),
                }}
                {...stateManager}
                options={options}
                value={options.filter((x) => x.value === guild.id)}
            />
        </Container>
    )
}

export default Sidebar
