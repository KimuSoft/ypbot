import React from 'react'
import { Navigate, useParams } from 'react-router-dom'
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

    type Option = { value: string; label: string }

    const options: Option[] = channels.map((x) => ({ value: x.id, label: x.name }))

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<{ name: string; channels: string[]; words: string[] }>({ defaultValues: data, resolver: zodResolver(blacklistEditSchema) })

    const [editing, setEditing] = React.useState(false)

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
        <form style={{ padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: 10 }} onSubmit={onSubmit}>
            <div style={{ fontSize: 24, marginBottom: 10 }}>검열 트리거 수정</div>
            <Input error={errors.name?.message} column label="트리거 이름" {...register('name')} />
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
