import React from 'react'
import { api } from '../../../api'
import useSWR from 'swr'
import { useCurrentGuild } from '../../../hooks/useCurrentGuild'
import Modal from '../../../components/Modal'
import Button from '../../../components/Button'
import { SubmitHandler, useForm } from 'react-hook-form'
import Input from '../../../components/Input'
import { useNavigate } from 'react-router-dom'

const fetcher = (url: string) => api.get(url).then((r) => r.data)

type CreateInputs = {
    name: string
}

const Blacklists: React.FC = () => {
    const guild = useCurrentGuild()

    const [showModal, setShowModal] = React.useState(false)

    const { data } = useSWR(`/guilds/${guild.id}/blacklists`, fetcher, {
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
        </div>
    )
}

export default Blacklists
