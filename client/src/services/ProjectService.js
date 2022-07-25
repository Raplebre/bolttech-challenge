const axios = require('axios')

export async function getProjectsByUser(id) {
    try {
        let token = localStorage.getItem("token")
        const config = {
            headers: { Authorization: `Bearer ${token}`}
        }
        return await axios.get(process.env.REACT_APP_SERVER_URL+'projectsUser/'+id, config)
    }
    catch (e) {
        console.log(e)
        return e.response
    }
}

export async function getProjectById(id) {
    try {
        let token = localStorage.getItem("token")
        const config = {
            headers: { Authorization: `Bearer ${token}`}
        }
        return await axios.get(process.env.REACT_APP_SERVER_URL+'project/'+id, config)
    }
    catch (e) {
        console.log(e)
        return e.response
    }
}

export async function createProject(form) {
    try {
        let token = localStorage.getItem("token")
        const config = {
            headers: { Authorization: `Bearer ${token}`}
        }
        return await axios.post(process.env.REACT_APP_SERVER_URL+'project', form, config)
    }
    catch (e) {
        console.log(e)
        return e.response
    }
}

export async function patchProject(id, form) {
    try {
        let token = localStorage.getItem("token")
        const config = {
            headers: { Authorization: `Bearer ${token}`}
        }
        return await axios.patch(process.env.REACT_APP_SERVER_URL+'project/'+id, form, config)
    }
    catch (e) {
        console.log(e)
        return e.response
    }
}

export async function removeProject(id) {
    try {
        let token = localStorage.getItem("token")
        const config = {
            headers: { Authorization: `Bearer ${token}`}
        }
        return await axios.delete(process.env.REACT_APP_SERVER_URL+'project/'+id, config)
    }
    catch (e) {
        console.log(e)
        return e.response
    }
}