import React from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import { api } from '../../../api'
import { useGuildTextChannels } from '../../../hooks/useGuildTextChannels'
import Input from '../../../components/Input'
import { Controller, useForm } from 'react-hook-form'
import Button from '../../../components/Button'
import CreatableInput from '../../../components/CreatableInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { blacklistEditSchema } from '../../../../../src/web/validation/blacklists'
import { toast } from 'react-toastify'
import Select from 'react-select'
import Modal from '../../../components/Modal'

const fetcher = (url: string) =>
    api
        .get(url)
        .then((x) => x.data)
        .catch(() => null)

const BlackListEdit: React.FC = () => {
    const { blacklistId, id } = useParams<'blacklistId' | 'id'>()

    const { data, mutate } = useSWR(`/guilds/${id}/blacklists/${blacklistId}`, fetcher, { suspense: true })

    if (!data) {
        return <Navigate to=".." />
    }

    const channels = useGuildTextChannels()

    const navigate = useNavigate()

    type Option = { value: string; label: string }

    const options: Option[] = channels.map((x) => ({ value: x.id, label: x.name }))

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<{ name: string; channels: string[]; words: string[] }>({ defaultValues: data, resolver: zodResolver(blacklistEditSchema) })

    const [editing, setEditing] = React.useState(false)

    const [deleteDialog, setDeleteDialog] = React.useState(false)
    const [deleting, setDeleting] = React.useState(false)

    const onSubmit = handleSubmit((value) => {
        if (editing) return
        setEditing(true)
        toast
            .promise(
                (async () => {
                    await api.put(`/guilds/${id}/blacklists/${blacklistId}`, value)
                })(),
                {
                    pending: '저장 중...',
                    error: '저장 실패',
                    success: '저장 성공',
                }
            )
            .finally(async () => {
                await mutate()
                setEditing(false)
            })
    })

    return (
        <form style={{ padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: 10, maxWidth: '512px', marginLeft: 'auto', marginRight: 'auto' }} onSubmit={onSubmit}>
            <Modal
                width="400px"
                open={deleteDialog}
                title="규칙 삭제하기"
                footer={
                    <>
                        <Button onClick={() => setDeleteDialog(false)}>취소하기</Button>
                        <Button
                            color="#ED4245"
                            onClick={() => {
                                toast
                                    .promise(api.delete(`/guilds/${id}/blacklists/${blacklistId}`), {
                                        pending: '삭제 중...',
                                        error: '삭제 실패',
                                        success: '삭제 성공',
                                    })
                                    .then(() => {
                                        navigate('..')
                                    })
                                    .catch(() => {
                                        setDeleting(false)
                                    })
                            }}
                        >
                            삭제하기
                        </Button>
                    </>
                }
            >
                이 규칙을 삭제할까요? 삭제하면 복구 불가능합니다.
            </Modal>
            <div style={{ fontSize: 24, marginBottom: 10, display: 'flex', alignItems: 'center' }}>
                <div style={{ flexGrow: 1 }}>검열 규칙 수정</div>
                <Button
                    color="#ED4245"
                    onClick={() => {
                        setDeleteDialog(true)
                    }}
                >
                    삭제
                </Button>
            </div>
            <Input error={errors.name?.message} column label="규칙 이름" {...register('name')} />
            <Input
                label="검열 단어"
                column
                control={
                    <Controller
                        control={control}
                        name="words"
                        render={({ field: { onChange, value, ref } }) => <CreatableInput ref={ref} value={value} onChange={(value) => onChange(value)} />}
                    />
                }
            />
            <Input
                label="채널"
                column
                control={
                    <Controller
                        render={({ field: { onChange, value, ref } }) => (
                            <Select
                                isMulti
                                options={options}
                                onChange={(data) => {
                                    onChange(data.map((x) => x.value))
                                }}
                                ref={ref}
                                value={options.filter((x) => value.includes(x.value))}
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
                                    multiValue: (styles) => ({
                                        ...styles,
                                        background: '#36393f',
                                    }),
                                    multiValueLabel: (styles) => ({
                                        ...styles,
                                        color: '#fff',
                                    }),
                                    container: (styles) => ({
                                        ...styles,
                                        width: '100%',
                                    }),
                                }}
                            />
                        )}
                        name="channels"
                        control={control}
                    />
                }
            />
            <Button as="button" type="submit">
                수정
            </Button>
        </form>
    )
}

export default BlackListEdit
