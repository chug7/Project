import axios from 'axios'
//we're adding a global header with axios we're not making a request here

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token
  } else {
    delete axios.defaults.headers.common['x-auth-token']
  }
}
export default setAuthToken
