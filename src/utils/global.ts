export const setGlobal = (key: string, value: any) => {
    ;(global as any)[key] = value
}
