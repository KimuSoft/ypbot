import React from 'react'
import { api } from '../../../api'
import useSWR from 'swr'
import { useCurrentGuild } from '../../../hooks/useCurrentGuild'
import Modal from '../../../components/Modal'
import Button from '../../../components/Button'
import { SubmitHandler, useForm } from 'react-hook-form'
import Input from '../../../components/Input'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import type { BlackList } from '@prisma/client'

const fetcher = (url: string) => api.get(url).then((r) => r.data)

type CreateInputs = {
    name: string
}

const ListItemContainer = styled.div`
    padding: 20px;
    background: #202225;
    overflow: hidden;
    height: 100px;
    display: flex;
    flex-direction: column;
`

const ListItemWord = styled.div`
    background: rgba(255, 255, 255, 0.2);
    padding: 5px;
`

const ListItem: React.FC<{ item: BlackList }> = ({ item }) => {
    return (
        <ListItemContainer>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{item.name}</div>
            <div style={{ flexGrow: 1 }} />
            <div style={{ display: 'flex', gap: 5, whiteSpace: 'nowrap', overflow: 'hidden' }}>
                {item.words.map((x, i) => (
                    <ListItemWord key={i}>{x}</ListItemWord>
                ))}
                {!item.words.length && <ListItemWord>키워드 없음</ListItemWord>}
            </div>
        </ListItemContainer>
    )
}

const List = styled.div`
    display: grid;
    gap: 10px;
    margin-top: 20px;
    @media (min-width: 769px) and (max-width: 1024px) {
        grid-template-columns: 1fr 1fr;
    }
    @media (min-width: 1025px) {
        grid-template-columns: 1fr 1fr 1fr;
    }
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`

const Blacklists: React.FC = () => {
    const guild = useCurrentGuild()

    const [showModal, setShowModal] = React.useState(false)

    const { data } = useSWR<BlackList[]>(`/guilds/${guild.id}/blacklists`, fetcher, {
        suspense: true,
    })

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<CreateInputs>()

    const [submit, setSubmit] = React.useState(false)

    const navigate = useNavigate()

    const onSubmit: SubmitHandler<CreateInputs> = async (data) => {
        if (submit) return
        setSubmit(true)
        try {
            const { data: resData } = await api.post(`/guilds/${guild.id}/blacklists`, data)
            navigate(`/servers/${guild.id}/blacklists/${resData.id}`)
        } catch (e) {
            console.error(e)
            setSubmit(false)
        }
    }

    console.log(data)

    return (
        <div style={{ maxWidth: 900, marginLeft: 'auto', marginRight: 'auto', width: '100%', marginTop: 20 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal
                    width="400px"
                    title="검열 트리거 추가하기"
                    open={showModal}
                    footer={
                        <>
                            <Button onClick={() => setShowModal(false)} color="#ED4245">
                                취소
                            </Button>
                            <Button as="button" type="submit">
                                추가하기
                            </Button>
                        </>
                    }
                >
                    <Input
                        label="트리거 이름"
                        {...register('name', {
                            required: {
                                value: true,
                                message: '필수 필드입니다.',
                            },
                        })}
                        error={errors.name?.message}
                    />
                </Modal>
            </form>
            <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flexGrow: 1 }} />
                <Button onClick={() => setShowModal(true)}>추가하기</Button>
            </div>
            <List>
                {data.map((x, i) => {
                    return <ListItem key={i} item={x} />
                })}
            </List>
        </div>
    )
}

export default Blacklists
