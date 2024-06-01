import './App.css';
import LoginPage from "./pages/Login/LoginPage";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import ProfilePage from "./pages/Profile/ProfilePage";
import Header from "./components/Header/Header";
import NewCompany from "./components/Modal/Modal";
import { UserProvider } from "./UserProvider";
import EmployeesPage from "./pages/EmployeesPage/EmployeesPage";
import AdminRoute from "./components/Routes/AdminRoute";
import UserRouter from "./components/Routes/UserRouter";
import NotFound from "./pages/NotFound/NotFound";
import NewTask from "./pages/NewTask/NewTask";
import TaskList from "./pages/Tasks/TaskList/TaskList";
import TaskPage from "./pages/Tasks/TaskPage/TaskPage";


function App() {
    return (
        <div className="App flex flex-col items-center">
            <UserProvider>
                <Header />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />

                    <Route path="/profile" element={<UserRouter />}>
                        <Route path="" element={<ProfilePage />} />
                        <Route path="messages" element={<p>messages</p>} />
                        <Route path="tasks" element={<TaskList />} />
                        <Route path="tasks/:taskId" element={<TaskPage />} />
                        <Route path="stars" element={<p>Stars</p>} />
                    </Route>

                    <Route path="/newCompany" element={<NewCompany />} />

                    <Route path="/company" element={<AdminRoute />}>
                        <Route path="employees" element={<EmployeesPage />} />
                        <Route path={"newTask/:id"} element={<NewTask />} />
                    </Route>

                    <Route path="/*" element={<NotFound />} />
                </Routes>
            </UserProvider>
        </div>
    );
}

export default App;
