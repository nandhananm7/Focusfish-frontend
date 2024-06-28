import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import './index.css';

function Todo() {
    // Handle user logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        window.location.href = "/login";
    };

    // State variables
    const [todoList, setTodoList] = useState([]);
    const [editableId, setEditableId] = useState(null);
    const [editedTask, setEditedTask] = useState("");
    const [editedStatus, setEditedStatus] = useState("");
    const [newTask, setNewTask] = useState("");
    const [newStatus, setNewStatus] = useState("");
    const [newDeadline, setNewDeadline] = useState("");
    const [editedDeadline, setEditedDeadline] = useState("");
    const [collapsed, setCollapsed] = useState(true); // State for sidebar collapse

    // Fetch tasks from database
    useEffect(() => {
        axios.get('http://localhost:8080/api/getTodoList')
            .then(result => {
                setTodoList(result.data);
            })
            .catch(err => console.log(err));
    }, []);

    // Function to toggle the editable state for a specific row
    const toggleEditable = (id) => {
        const rowData = todoList.find((data) => data._id === id);
        if (rowData) {
            setEditableId(id);
            setEditedTask(rowData.task);
            setEditedStatus(rowData.status);
            setEditedDeadline(rowData.deadline || "");
        } else {
            setEditableId(null);
            setEditedTask("");
            setEditedStatus("");
            setEditedDeadline("");
        }
    };

    // Function to add task to the database
    const addTask = (e) => {
        e.preventDefault();
        if (!newTask || !newStatus || !newDeadline) {
            alert("All fields must be filled out.");
            return;
        }

        axios.post('http://localhost:8080/api/addTodoList', { task: newTask, status: newStatus, deadline: newDeadline })
            .then(res => {
                console.log(res);
                window.location.reload();
            })
            .catch(err => console.log(err));
    };

    // Function to save edited data to the database
    const saveEditedTask = (id) => {
        const editedData = {
            task: editedTask,
            status: editedStatus,
            deadline: editedDeadline,
        };

        if (!editedTask || !editedStatus || !editedDeadline) {
            alert("All fields must be filled out.");
            return;
        }

        axios.post('http://127.0.0.1:8080/api/updateTodoList/' + id, editedData)
            .then(result => {
                console.log(result);
                setEditableId(null);
                setEditedTask("");
                setEditedStatus("");
                setEditedDeadline("");
                window.location.reload();
            })
            .catch(err => console.log(err));
    };

    // Delete task from database
    const deleteTask = (id) => {
        axios.delete('http://127.0.0.1:8080/api/deleteTodoList/' + id)
            .then(result => {
                console.log(result);
                window.location.reload();
            })
            .catch(err => console.log(err));
    };

    // Function to toggle the sidebar's collapsed state
    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className="container">
            <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
                <button className="toggle-btn" onClick={toggleSidebar}>
                    ☰
                </button>
                {!collapsed ? (
                    <div>
                        <Link to="/main">
                            <button className="sidebar_button1">
                                🏠 Back to Dashboard
                            </button>
                        </Link>
                        <button className="sidebar_button2">📌 Important</button>
                        <button className="sidebar_button3">👤 Assigned to me</button>
                    </div>
                ) : (
                    <div>
                        <button className="smallsidebar_button1">
                            🏠
                        </button>
                        <button className="smallsidebar_button2">📌</button>
                        <button className="smallsidebar_button3">👤</button>
                    </div>
                )}
            </div>
            <div className={`main-content ${collapsed ? 'collapsed' : ''}`}>
            <h1> FocusFish <button className="logout_btn" onClick={handleLogout}>Log out</button> </h1>
                <div className="row">
                    <div>
                        <h2 className="text-left">Upcoming Tasks</h2>
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead className="table-primary">
                                    <tr>
                                        <th>Task</th>
                                        <th>Status</th>
                                        <th>Deadline</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                {Array.isArray(todoList) ? (
                                    <tbody>
                                        {todoList.map((data) => (
                                            <tr key={data._id}>
                                                <td>
                                                    {editableId === data._id ? (
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={editedTask}
                                                            onChange={(e) => setEditedTask(e.target.value)}
                                                        />
                                                    ) : (
                                                        data.task
                                                    )}
                                                </td>
                                                <td>
                                                    {editableId === data._id ? (
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={editedStatus}
                                                            onChange={(e) => setEditedStatus(e.target.value)}
                                                        />
                                                    ) : (
                                                        data.status
                                                    )}
                                                </td>
                                                <td>
                                                    {editableId === data._id ? (
                                                        <input
                                                            type="datetime-local"
                                                            className="form-control"
                                                            value={editedDeadline}
                                                            onChange={(e) => setEditedDeadline(e.target.value)}
                                                        />
                                                    ) : (
                                                        data.deadline ? new Date(data.deadline).toLocaleString() : ''
                                                    )}
                                                </td>
                                                <td>
                                                    {editableId === data._id ? (
                                                        <button className="btn btn-success btn-sm" onClick={() => saveEditedTask(data._id)}>
                                                            Save
                                                        </button>
                                                    ) : (
                                                        <button className="edit_btn" onClick={() => toggleEditable(data._id)}>
                                                            Edit
                                                        </button>
                                                    )}
                                                    <button className="delete_btn" onClick={() => deleteTask(data._id)}>
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                ) : (
                                    <tbody>
                                        <tr>
                                            <td colSpan="4">Loading tasks...</td>
                                        </tr>
                                    </tbody>
                                )}
                            </table>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <h2 className="text-center">Add a new task</h2>
                        <form className="bg-light p-4">
                            <div className="mb-3">
                                <label>Task</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Enter Task"
                                    onChange={(e) => setNewTask(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Status</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Enter Status"
                                    onChange={(e) => setNewStatus(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Deadline</label>
                                <input
                                    className="form-control"
                                    type="datetime-local"
                                    onChange={(e) => setNewDeadline(e.target.value)}
                                />
                            </div>
                            <button onClick={addTask} className="btn btn-success btn-sm">
                                Add Task
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Todo;
