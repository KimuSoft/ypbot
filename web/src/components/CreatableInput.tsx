import React, { Component, KeyboardEventHandler } from 'react'

import CreatableSelect from 'react-select/creatable'
import { ActionMeta, OnChangeValue } from 'react-select'

const components = {
    DropdownIndicator: null,
}

interface Option {
    readonly label: string
    readonly value: string
}

const createOption = (label: string) => ({
    label,
    value: label,
})

interface State {
    readonly inputValue: string
}

export default class CreatableInputOnly extends Component<{ onChange?: (data: string[]) => void; value: string[] } & React.RefAttributes<any>, State> {
    state: State = {
        inputValue: '',
    }
    handleChange = (value: OnChangeValue<Option, true>, actionMeta: ActionMeta<Option>) => {
        this.props.onChange(value.map((x) => x.value))
    }
    handleInputChange = (inputValue: string) => {
        this.setState({ inputValue })
    }
    handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
        const { inputValue } = this.state
        const value = this.props.value
        if (!inputValue) return
        switch (event.key) {
            case 'Enter':
            case 'Tab':
                this.setState({
                    inputValue: '',
                })

                const set = new Set([...value, createOption(inputValue).value])

                this.props.onChange(Array.from(set))
                event.preventDefault()
        }
    }
    render() {
        const { inputValue } = this.state
        return (
            <CreatableSelect
                components={components}
                inputValue={inputValue}
                isClearable
                isMulti
                menuIsOpen={false}
                onChange={this.handleChange}
                onInputChange={this.handleInputChange}
                onKeyDown={this.handleKeyDown}
                placeholder="Type something and press enter..."
                value={this.props.value.map((x) => ({ label: x, value: x }))}
                styles={{
                    control: (styles) => ({
                        ...styles,
                        background: '#202225',
                    }),
                    input: (styles) => ({
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
        )
    }
}
