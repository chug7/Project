import React, { Fragment } from 'react'
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'

const App = () => (
  //changed "function App()" into an arrow function

  <Fragment>
    <Navbar /> <Landing />
  </Fragment>
)

export default App
