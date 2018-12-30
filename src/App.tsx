import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import PomoStore from './stores/pomoStore';
import MainPage from './pages/mainPage';
import { Provider } from 'mobx-react';
import AppStateStore from './stores/appStateStore';
import { Layout } from './pages/layout';

// const {Provider, Consumer} = React.createContext<PomoStore>(new PomoStore())

class App extends Component {
  render() {
    return (
      <Provider store={new PomoStore} appState={new AppStateStore} >
        <Layout />
      </Provider>

    );
  }
}

export default App;
