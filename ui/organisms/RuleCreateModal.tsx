import React from 'react'
import Modal from './Modal'
import { FaPlus } from 'react-icons/fa'
import { Button } from '../atoms/Button'
import LabelledInput from '../molecules/LabelledInput'
import { Input } from '../atoms/Input'
import { useForm } from 'react-hook-form'
import { ruleCreateSchema } from '../../src/web/validation/rules'
import { zodResolver } from '@hookform/resolvers/zod'

const RuleCreateModal: React.FC = () => {
    const { handleSubmit, reset, formState, register } = useForm({
        resolver: zodResolver(ruleCreateSchema),
    })

    return (
        <Modal
            button={
                <div className="flex min-h-[64px] bg-stone-800 justify-center items-center rounded-[16px] hover:bg-stone-700 transition-all select-none cursor-pointer">
                    <FaPlus size={24} />
                </div>
            }
        >
            <form
                onSubmit={handleSubmit((data) => {
                    console.log(data)
                    reset()
                })}
                className="flex flex-col gap-4 max-w-[320px] w-screen"
            >
                <div className="font-bold text-2xl text-center">규칙 만들기</div>
                <LabelledInput label="이름" error={formState.errors.name?.message}>
                    <Input autoComplete="off" {...register('name')} />
                </LabelledInput>
                <LabelledInput label="설명" error={formState.errors.description?.message}>
                    <Input autoComplete="off" {...register('description')} />
                </LabelledInput>
                <Button className="bg-blue-500">만들기</Button>
            </form>
        </Modal>
    )
}

export default RuleCreateModal
