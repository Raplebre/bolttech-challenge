import { Component, useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import { Navigate, useSearchParams } from 'react-router-dom'
import NavbarComponent from './Navbar';
import { parseJwt } from '../utils/JwtDecoder';
import { getTasksByProject, createTask, removeTask, patchTask } from '../services/TaskService';
import { getProjectById } from '../services/ProjectService';
import ListGroup from 'react-bootstrap/ListGroup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import Badge from 'react-bootstrap/Badge';
import ReactTooltip from 'react-tooltip';

const TaskListComponent = () => {
    const [loggedIn, setLoggedIn] = useState(true)
    const [idProject, setIdProject] = useState(0)
    const [taskList, setTaskList] = useState([])
    const [toDoList, setToDoList] = useState([])
    const [doneList, setDoneList] = useState([])
    const [taskDescription, setTaskDescription] = useState("")
    const [finishDate, setFinishDate] = useState(new Date())
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState(0)
    const [navBack, setNavBack] = useState(false)
    const [showTooltip, setShowTooltip] = useState(false)
    const [projectName, setProjectName] = useState("")

    let [searchParams, setSearchParams] = useSearchParams()

    const handleValueChange = (ev) => {
        let target = ev.target
        let val = target.value

        setTaskDescription(val)
    }

    const handleDateChange = (ev) => {
        let target = ev.target
        let val = target.value

        setFinishDate(val)
    }

    const getProjectTasks = async (id) => {
        let response = await getTasksByProject(id)
        if (response.status === 200) {
            setTaskList(response.data)
            let data = response.data
            let toDo = data.filter(x => {
                return x.status === 0
            })
            let done = data.filter(x => {
                return x.status === 1
            })
            setToDoList(toDo)
            setDoneList(done)
            console.log(toDo)
        }
        else if (response.status === 404) {
            console.log('no tasks')
            setTaskList([])
            setToDoList([])
            setDoneList([])
        }
        else {
            emitToast("error", "Internal Server Error getting tasks")
        }
        console.log(response)
    }

    const emitToast = (type, text) => {
        if (type === "error") {
            toast.error(text)
        }
        else if (type === "success") {
            toast.success(text)
        }
        else if (type === "info") {
            toast.info(text)
        }
        else if (type === "warning") {
            toast.warning(text)
        }
    }

    const getCurProject = async (id) => {
        await getProjectById(id).then((res) => {
            if (res.status === 200) {
                console.log(res)
                let data = res.data
                console.log(data.name)
                setProjectName(data.name)
            }
        })
    }

    const checkAuth = () => {
        let token = localStorage.getItem("token")
        if (!token) {
            setLoggedIn(false)
        }
        else {
            let parsedToken = parseJwt(token)
            let tokenExpiry = parsedToken.exp
            let curTimestamp = Math.floor(new Date().getTime() / 1000)
            if (tokenExpiry < curTimestamp) {
                setLoggedIn(false)
            }
            else {

                let id = searchParams.get("idProject")
                getCurProject(id)
                getProjectTasks(id)
            }
        }
    }

    const createNewTask = async () => {
        if (taskDescription && taskDescription.trim().length > 0 && finishDate) {
            await createTask({ description: taskDescription, idProject, finishDate }).then((res) => {
                if (res.status === 201) {
                    getProjectTasks(idProject)
                    emitToast("success", "Task created successfully")
                    cancelUpdate()
                }
                else {
                    emitToast("error", "Internal Server Error trying to create task")
                }
            })
        }
        else {
            emitToast("warning", "Neither value can be null")
        }
    }

    const setAsDone = async (id) => {
        await patchTask(id, { status: 1 }).then((res) => {
            if (res.status === 200) {
                getProjectTasks(idProject)
            }
            else {
                emitToast("error", "There was an error while trying to update the task")
            }
        })
    }

    const updateTask = async () => {
        if (taskDescription && taskDescription.trim().length > 0 && finishDate) {
            await patchTask(editingId, { description: taskDescription, finishDate }).then((res) => {
                if (res.status === 200) {
                    emitToast("success", "Task updated successfully")
                    getProjectTasks(idProject)
                    cancelUpdate()
                }
                else {
                    emitToast("error", "There was an error while trying to update the task")
                    cancelUpdate()
                }
            })
        }
        else {
            emitToast("warning", "Neither value can be null")
        }
    }

    const deleteTask = async (id) => {
        await removeTask(id).then((res) => {
            if (res.status === 200) {
                emitToast("success", "Task deleted successfully")
                getProjectTasks(idProject)
            }
            else {
                emitToast("error", "There was an error while trying to delete the task")
            }
        })
    }

    const editTask = (task) => {
        setEditingId(task.idTask)
        setTaskDescription(task.description)
        console.log(task.finish_date)
        let date = new Date(task.finish_date)
        date.setHours(date.getHours() + 3)
        date = date.toISOString().split('T')[0]
        console.log(date)
        setFinishDate(date)
        setIsEditing(true)
    }

    const cancelUpdate = () => {
        setEditingId(0)
        setTaskDescription("")
        setFinishDate(new Date())
        setIsEditing(false)
    }

    useEffect(() => {
        let id = searchParams.get("idProject")
        setIdProject(id)
        checkAuth()
    }, [])

    return (
        <>
            <NavbarComponent />
            <div className="centerNoHeight">
                <div className='row'>
                    <div style={{ paddingLeft: "3em", paddingRight: "3em", paddingTop: "1em", paddingBottom: "2em", border: "1px solid #c4c4c4", borderRadius: "20px" }}>
                        <div>
                            <h3>{projectName}</h3>
                            <hr></hr>
                        </div>
                        <h5>To Do</h5>
                        <ListGroup>
                            {toDoList.length ? toDoList.map((item, i) => {
                                let date = new Date(item.finish_date)
                                date.setHours(date.getHours() + 3)
                                date = date.toISOString().split('T')[0]
                                return <><ListGroup.Item data-tip={date} onMouseEnter={() => setShowTooltip(true)}
                                onMouseLeave={() => {
                                  setShowTooltip(false);
                                  setTimeout(() => setShowTooltip(true), 50);
                                }} key={i}>{item.description}<span style={{ float: "right" }}><FontAwesomeIcon onClick={() => setAsDone(item.idTask)} style={{ cursor: "pointer", color: "#26ef09" }} icon={faCheckCircle} /> <FontAwesomeIcon onClick={() => editTask(item)} style={{ cursor: "pointer", color: "#1a95ff" }} icon={faEdit} /> <FontAwesomeIcon onClick={() => deleteTask(item.idTask)} style={{ cursor: "pointer", color: "#fb4848" }} icon={faTrash} /></span></ListGroup.Item>{showTooltip && <ReactTooltip effect="solid" />}</>
                            }) : <span>There are no tasks to be done.</span>}
                        </ListGroup>
                        <br></br>
                        <h5>Done</h5>
                        <ListGroup>
                            {doneList.length ? doneList.map((item, i) => {
                                let date = new Date(item.finish_date)
                                date.setHours(date.getHours() + 3)
                                date = date.toISOString().split('T')[0]
                                return <><ListGroup.Item data-tip={date} onMouseEnter={() => setShowTooltip(true)}
                                onMouseLeave={() => {
                                  setShowTooltip(false);
                                  setTimeout(() => setShowTooltip(true), 50);
                                }} key={i}>{item.description}<span style={{ float: "right" }}><Badge bg="primary">Done</Badge></span></ListGroup.Item>{showTooltip && <ReactTooltip effect='solid'/>}</>
                            }) : <span>No tasks have been marked as done yet.</span>}
                        </ListGroup>
                        <hr></hr>
                        <div>
                            <input type="text" name="taskDescription" value={taskDescription} onChange={handleValueChange} placeholder='Task name' className='form-control' />
                            <input type="date" name="finishDate" value={finishDate} onChange={handleDateChange} placeholder='Finish date' className='form-control' />
                            {!isEditing ?
                                <Button onClick={() => createNewTask()} style={{ width: "100%", marginTop: "5px" }}>Create Task</Button>
                                : <Button onClick={() => updateTask()} style={{ width: "100%", marginTop: "5px" }}>Update Task</Button>}

                            {!isEditing ?
                                <Button variant="success" onClick={() => setNavBack(true)} style={{ width: "100%", marginTop: "5px" }}>Go back</Button>
                                : <Button variant="danger" onClick={() => cancelUpdate()} style={{ width: "100%", marginTop: "5px" }}>Cancel</Button>}
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme='colored'
            />
            
            {!loggedIn && <Navigate to="/login" replace={true} />}
            {navBack && <Navigate to="/" replace={true} />}
        </>
    )
}

export default TaskListComponent;