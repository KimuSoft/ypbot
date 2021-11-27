import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './global.scss'
import Root from './App'
import { RecoilRoot } from 'recoil'
import Loader from './components/Loader'
import { BrowserRouter } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { ToastContainer, Bounce } from 'react-toastify'

library.add(fas, fab, far)

ReactDOM.render(
    <RecoilRoot>
        <ToastContainer
            transition={Bounce}
            theme="colored"
            style={{
                zIndex: 999999,
            }}
        />
        <BrowserRouter>
            <React.Suspense fallback={<Loader />}>
                <Root />
            </React.Suspense>
        </BrowserRouter>
    </RecoilRoot>,
    document.getElementById('root')
)
