import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { LoginComponent } from './components/Login'
import { SignupComponent } from './components/Signup';
import 'bootstrap/dist/css/bootstrap.min.css';  
import { ProjectListComponent } from './components/ProjectList';
import TaskListComponent from './components/TaskList';

class App extends Component {
  constructor() {
    super()
    this.state = {
      redirect: false
    }
  }

  componentDidMount() {
    let token = localStorage.getItem("token")
    console.log(token)
    if (!token) {
      this.setState({redirect: true})
    }
  }

  requireAuth() {

  }

  render() {
    const { redirect } = this.state
    return (
      <>  
        <Router>
          <Routes>
            <Route exact path="/" element={<ProjectListComponent/>}/>
            <Route exact path="/login" element={<LoginComponent/>}/>
            <Route exact path="/project" element={<TaskListComponent/>}/>
            <Route element={<SignupComponent/>} exact path="/signup"/>
          </Routes>
        </Router>
      </>
    )
  }
}

export default App;
