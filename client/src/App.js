import React, { Fragment } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import './App.css'

const App = () => (
  //changed "function App()" into an arrow function
  <BrowserRouter>
    <Fragment>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Landing />} />
      </Routes>
      <section className="container">
        <Routes>
          <Route exact path="/register.html" element={<Register />} />
          <Route exact path="/login.html" element={<Login />} />
        </Routes>
      </section>
    </Fragment>
  </BrowserRouter>
)

export default App
