const axios = require('axios')

export async function getTasksByProject(id) {
    try {
        let token = localStorage.getItem("token")
        const config = {
            headers: { Authorization: `Bearer ${token}`}
        }
        return await axios.get(process.env.REACT_APP_SERVER_URL+'tasksProject/'+id, config)
    }
    catch (e) {
        console.log(e)
        return e.response
    }
}

export async function createTask(form) {
    try {
        let token = localStorage.getItem("token")
        const config = {
            headers: { Authorization: `Bearer ${token}`}
        }
        return await axios.post(process.env.REACT_APP_SERVER_URL+'task', form, config)
    }
    catch (e) {
        console.log(e)
        return e.response
    }
}

export async function patchTask(id, form) {
    try {
        let token = localStorage.getItem("token")
        const config = {
            headers: { Authorization: `Bearer ${token}`}
        }
        return await axios.patch(process.env.REACT_APP_SERVER_URL+'task/'+id, form, config)
    }
    catch (e) {
        console.log(e)
        return e.response
    }
}

export async function removeTask(id) {
    try {
        let token = localStorage.getItem("token")
        const config = {
            headers: { Authorization: `Bearer ${token}`}
        }
        return await axios.delete(process.env.REACT_APP_SERVER_URL+'task/'+id, config)
    }
    catch (e) {
        console.log(e)
        return e.response
    }
}