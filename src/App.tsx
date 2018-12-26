import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import PomoStore from './stores/pomoStore';
import MainPage from './pages/mainPage';
import { Provider } from 'mobx-react';

// const {Provider, Consumer} = React.createContext<PomoStore>(new PomoStore())

class App extends Component {
  render() {
    return (
      <Provider store={new PomoStore} >
      
        <MainPage />
      </Provider>

    );
  }
}

// export const PomoProvider = Provider

// export const PomoConsumer = Consumer

export default App;
