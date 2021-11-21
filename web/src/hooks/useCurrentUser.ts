import { useRecoilValue } from 'recoil'
import { userState } from '../state'

export const useCurrentUser = () => {
    return useRecoilValue(userState)
}
