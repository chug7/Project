import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import './App.css'
//Redux
import { Provider } from 'react-redux'
import store from './store'
import Alert from './components/layout/Alert'

const App = () => (
  //changed "function App()" into an arrow function
  <Provider store={store}>
    <BrowserRouter>
      <Navbar />
      <section className="container">
        <Alert />
        <Routes>
          <Route exact path="/" element={<Landing />} />
        </Routes>
        <Routes>
          <Route exact path="register" element={<Register />} />
          <Route exact path="login" element={<Login />} />
        </Routes>
      </section>
    </BrowserRouter>
  </Provider>
)

export default App
