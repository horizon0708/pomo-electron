import React from 'react'
import { Router, Route, PomoPage } from '../components/router';
import ProjectPage from './projectPage';
import SettingsPage from './settingsPage';
import Menu from '../components/menu';
import PomoTimer from '../components/pomoTimer';
import TagsPage from './tagsPage';

export const Layout = ({ }) => {
    return <div>
        <PomoTimer />
        <Menu />
        <TagsPage />
        <Router>
            <Route route={PomoPage.project}><ProjectPage /></Route>
            <Route route={PomoPage.options}><SettingsPage /></Route>
        </Router>
    </div>
}