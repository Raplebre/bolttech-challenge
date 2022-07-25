import { Component } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { login } from '../services/AuthService'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import { Navigate, Link } from 'react-router-dom'
import { parseJwt } from '../utils/JwtDecoder';



export class LoginComponent extends Component {
    constructor() {
        super()
        this.state = {
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

    attemptLogin = async () => {
        let { email, password } = this.state
        console.log(email)
        email = email.toLowerCase().trim()
        password = password.trim()
        if ((email && email.length > 0) && (password && password.length > 0)) {
            let form = {
                email,
                password
            }
            let response = await login(form)
            if (response.status === 200) {
                localStorage.setItem("token", response.data.token)
                let parsedToken = parseJwt(response.data.token)
                console.log(parsedToken)
                localStorage.setItem("username", parsedToken.username)
                setTimeout(() => {
                    this.setState({redirect: true})
                }, 200)
            }
            else if (response.status === 404) {
                this.emitToast("error", "Email and password combination not found.")
            }
            else {
                this.emitToast("error", "Internal Server Error")
            }
            console.log(response)
        }
        else {
            this.emitToast("error", "Introduce both email and password.")
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
                    <h2 style={{textAlign: "center"}}>Login</h2>
                    <br></br>
                        <div className="form-group">
                            <label>Email address</label>
                            <input value={this.state.email} onChange={this.handleValueChange} type="email" name="email" className="form-control" placeholder="Enter email" />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input value={this.state.password} onChange={this.handleValueChange} type="password" name="password" className="form-control" placeholder="Password" />
                        </div>
                        <br></br>
                        <Button onClick={() => this.attemptLogin()} variant="primary">Login</Button>
                        <Link to="/signup"><Button style={{float:"right"}} variant="success">Go to Signup</Button></Link>
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