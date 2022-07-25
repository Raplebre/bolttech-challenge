import { Component } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { signup } from '../services/AuthService'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import { Navigate, Link } from 'react-router-dom'



export class SignupComponent extends Component {
    constructor() {
        super()
        this.state = {
            username: "",
            email: "",
            password: "",
            redirect: false
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

    attemptSignup = async () => {
        let { username, email, password } = this.state
        console.log(email)
        username = username.trim()
        email = email.toLowerCase().trim()
        password = password.trim()
        if ((username && username.length > 0) && (email && email.length > 0) && (password && password.length > 0)) {
            let form = {
                username,
                email,
                password
            }
            let response = await signup(form)
            if (response.status === 200) {
                localStorage.setItem("token", response.data.token)
                localStorage.setItem("username", username)
                setTimeout(() => {
                    this.setState({redirect: true})
                }, 200)
            }
            else if (response.status === 400) {
                this.emitToast("error", response.data.message)
            }
            else {
                this.emitToast("error", "Internal Server Error")
            }
            console.log(response)
        }
        else {
            this.emitToast("error", "All fields are required to create an account.")
        }
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

    render() {
        const { redirect } = this.state
        return (
            <>
                <div className="center">
                    <Form>
                        <h2 style={{textAlign: "center"}}>Signup</h2>
                        <br></br>
                        <div className="form-group">
                            <label>Username</label>
                            <input value={this.state.username} onChange={this.handleValueChange} type="text" name="username" className="form-control" placeholder="Enter username" />
                        </div>
                        <div className="form-group">
                            <label>Email address</label>
                            <input value={this.state.email} onChange={this.handleValueChange} type="email" name="email" className="form-control" placeholder="Enter email" />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input value={this.state.password} onChange={this.handleValueChange} type="password" name="password" className="form-control" placeholder="Password" />
                        </div>
                        <br></br>
                        <Button onClick={() => this.attemptSignup()} variant="primary">Signup</Button>
                        <Link to="/login"><Button style={{float:"right"}} variant="success">Go to Login</Button></Link>
                    </Form>
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
                {redirect && <Navigate to="/" replace={true}/>}
            </>
        )
    }
}