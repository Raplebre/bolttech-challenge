import { Component } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { login } from '../services/AuthService'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import { Link, Route, Navigate } from 'react-router-dom'
import NavbarComponent from './Navbar';
import { parseJwt } from '../utils/JwtDecoder';
import { getProjectsByUser, createProject, patchProject, removeProject } from '../services/ProjectService';
import ListComponent from './List';
import ListGroup from 'react-bootstrap/ListGroup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'


export class ProjectListComponent extends Component {
    constructor() {
        super()
        this.state = {
            loggedIn: true,
            idUser: null,
            projectList: [],
            newProjectName: "",
            isEditing: false,
            editingId: null
        }

        this.handleValueChange = this.handleValueChange.bind(this)
    }

    handleValueChange(ev) {
        let target = ev.target
        let val = target.value
        let key = target.name

        this.setState({
            [key]: val
        })
    }

    getUserProjects = async (idUser) => {
        // let { idUser } = this.state
        let response = await getProjectsByUser(idUser)
        if (response.status === 200) {
            this.setState({ projectList: response.data })
            console.log(this.state)
        }
        else if (response.status === 404) {
            console.log('no projects')
            this.setState({ projectList: [] })
        }
        else {
            this.emitToast("error", "Internal Server Error getting projects")
        }
        console.log(response)
    }

    emitToast = (type, text) => {
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

    checkAuth() {
        let token = localStorage.getItem("token")
        setTimeout(() => {
            if (!token) {
                this.setState({ loggedIn: false })
            }
            else {
                let parsedToken = parseJwt(token)
                let tokenExpiry = parsedToken.exp
                let curTimestamp = Math.floor(new Date().getTime() / 1000)
                if (tokenExpiry < curTimestamp) {
                    this.setState({ loggedIn: false })
                }
                else {
                    this.setState({ idUser: parsedToken._id })
                    this.getUserProjects(parsedToken._id)
                }
            }
        }, 250)
    }

    createNewProject = async() => {
        let { newProjectName, idUser } = this.state
        console.log(newProjectName.trim())
        if (newProjectName && newProjectName.trim().length > 0) {
            await createProject({name: newProjectName, idUser }).then((res) => {
                if (res.status === 201) {
                    this.getUserProjects(idUser)
                    this.emitToast("success", "Project created successfully")
                    this.cancelUpdate()
                }
                else {
                    this.emitToast("error", "Internal Server Error trying to create project")
                }
            })
        }
        else {
            this.emitToast("warning", "Input the project's name")
        }
    }

    updateProject = async () => {
        let { editingId, newProjectName, idUser } = this.state
        if (newProjectName && newProjectName.trim().length > 0) {
            await patchProject(editingId, {name: newProjectName }).then((res) => {
                if (res.status === 200) {
                    this.getUserProjects(idUser)
                    this.emitToast("success", "Project updated successfully")
                    this.cancelUpdate()
                }
                else {
                    this.emitToast("error", "Internal Server Error trying to update project")
                    this.cancelUpdate()
                }
            })
        }
        else {
            this.emitToast("warning", "Input the project's name")
        }
    }

    cancelUpdate = () => {
        this.setState({editingId: 0, newProjectName: "", isEditing: false})
    }

    editProject = (e, project) => {
        e.preventDefault()
        this.setState({editingId: project.idProject, newProjectName: project.name, isEditing: true})
    }

    deleteProject = async(e,id) => {
        e.preventDefault()
        let { idUser } = this.state
        await removeProject(id).then(res => {
            if (res.status === 200) {
                this.emitToast("success", "Project deleted successfully")
                this.getUserProjects(idUser)
            }
            else {
                this.emitToast("error", "There was an error while trying to delete the project")
            }
        })
    }

    handleValueChange(ev) {
        let target = ev.target
        let val = target.value
        let key = target.name

        this.setState({
            [key]: val
        })
    }

    async componentDidMount() {
        this.checkAuth()
    }

    render() {
        const { loggedIn } = this.state
        const { projectList } = this.state
        const { isEditing } = this.state
        return (
            <>
                <NavbarComponent />
                <div className="centerNoHeight">
                    <div className='row'>
                        <div style={{ paddingLeft: "3em", paddingRight: "3em", paddingTop: "1em", paddingBottom: "2em", border: "1px solid #c4c4c4", borderRadius: "20px" }}>
                            <div>
                                <h3>Projects List</h3>
                                <hr></hr>
                            </div>
                            <ListGroup>
                                {projectList.length ? projectList.map((item, i) => {
                                    console.log(item);
                                    return <Link style={{textDecoration: "none"}} to={`/project?idProject=${item.idProject}`}><ListGroup.Item key={i}>{item.name}<span style={{float: "right"}}><FontAwesomeIcon onClick={(event) => this.editProject(event, item)} style={{ cursor: "pointer", color: "#1a95ff" }} icon={faEdit} /> <FontAwesomeIcon onClick={(event) => this.deleteProject(event, item.idProject)} style={{ cursor: "pointer", color: "#fb4848" }} icon={faTrash} /></span></ListGroup.Item></Link>
                                }) : <span>No projects have been created yet.</span>}
                            </ListGroup>
                            <hr></hr>
                            <div>
                                <input type="text" name="newProjectName" value={this.state.newProjectName} onChange={this.handleValueChange} placeholder='Project name' className='form-control'/>
                                {!isEditing ? <Button onClick={() => this.createNewProject()} style={{width:"100%", marginTop: "5px"}}>Create Project</Button>
                                : <Button onClick={() => this.updateProject()} style={{width:"100%", marginTop: "5px"}}>Update Project</Button>}
                                {isEditing && <Button variant="danger" onClick={() => this.cancelUpdate()} style={{ width: "100%", marginTop: "5px" }}>Cancel</Button>}
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
            </>
        )
    }
}