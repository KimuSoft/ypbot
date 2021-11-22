import React from 'react'
import { Route, Routes } from 'react-router-dom'
import DefaultLayout from './layouts/default'
import GuildList from './pages/GuildList'
import GuildLayout from './layouts/guild'
import Dashboard from './pages/Guild/Dashboard'
import Blacklists from './pages/Guild/Blacklists/list'

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/servers/:id/*" element={<GuildLayout />}>
                <Route path="" element={<Dashboard />} />
                <Route path="blacklists" element={<Blacklists />} />
            </Route>
            <Route path="*" element={<DefaultLayout />}>
                <Route path="servers" element={<GuildList />} />
                <Route path="*" element={<div>Not Found</div>} />
            </Route>
        </Routes>
    )
}

export default App
