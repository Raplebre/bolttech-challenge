const axios = require('axios')

export async function login(form) {
    try {
        return await axios.post(process.env.REACT_APP_SERVER_URL+'login', form)
    }
    catch (e) {
        console.log(e)
        return e.response
    }
}

export async function signup(form) {
    try {
        return await axios.post(process.env.REACT_APP_SERVER_URL+'signup', form)
    }
    catch (e) {
        console.log(e)
        return e.response
    }
}