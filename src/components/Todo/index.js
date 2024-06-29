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
    const statusOptions = ["done", "doing", "not started"];

    const [todoList, setTodoList] = useState([]);
    const [editableId, setEditableId] = useState(null);
    const [editedTask, setEditedTask] = useState("");
    const [editedStatus, setEditedStatus] = useState("");
    const [newTask, setNewTask] = useState("");
    const [newStatus, setNewStatus] = useState(statusOptions[0]); // Default to the first option
    const [newDeadline, setNewDeadline] = useState("");
    const [editedDeadline, setEditedDeadline] = useState("");
    const [collapsed, setCollapsed] = useState(true); // State for sidebar collapse

    // Fetch tasks from database
    useEffect(() => {
        axios.get('https://focusfish-backend.onrender.com/api/getTodoList')
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

        axios.post('https://focusfish-backend.onrender.com/api/addTodoList', { task: newTask, status: newStatus, deadline: newDeadline })
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


        // Updating edited data to the database through updateById API
        axios.post('https://focusfish-backend.onrender.com/api/updateTodoList/' + id, editedData)
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

    // Function to delete task from database
    const deleteTask = (id) => {
        axios.delete('https://focusfish-backend.onrender.com/api/deleteTodoList/' + id)
            .then(result => {
                console.log(result);
                window.location.reload();
            })
            .catch(err => console.log(err));
    };

// Function to toggle task flag status
const toggleFlagged = (id, currentFlagged) => {
    const updatedFlagged = !currentFlagged;
    axios.post(`http://127.0.0.1:8080/api/toggleFlaggedTodo/${id}`, { flagged: updatedFlagged })
        .then(result => {
            console.log(result.data); // Log the response from the server
            // Update todoList to reflect the change
            const updatedTodoList = todoList.map(item => {
                if (item._id === id) {
                    return { ...item, flagged: updatedFlagged };
                }
                return item;
            });
            setTodoList(updatedTodoList);
        })
        .catch(err => {
            console.error('Error toggling flagged status:', err);
            // Handle error here, if needed
        });
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
                        <h2 className="text-left">All Tasks</h2>
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
                                                        <select
                                                            className="form-control"
                                                            value={editedStatus}
                                                            onChange={(e) => setEditedStatus(e.target.value)}
                                                        >
                                                            {statusOptions.map((option) => (
                                                                <option key={option} value={option}>{option}</option>
                                                            ))}
                                                        </select>
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
                                                        <>
                                                            <button className="edit_btn" onClick={() => toggleEditable(data._id)}>
                                                                Edit
                                                            </button>
                                                            <button className="delete_btn" onClick={() => deleteTask(data._id)}>
                                                                Delete
                                                            </button>
                                                            <button className={`flag_btn ${data.flagged ? 'flagged' : ''}`} onClick={() => toggleFlagged(data._id, data.flagged)}>
                                                                {data.flagged ? '📌' : 'Flag'}
                                                            </button>
                                                        </>
                                                    )}
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
                    <center>
                    <div className="col-md-5">
                        <h2 className="text-center">Add a new task</h2>
                        <form className="bg-light">
                            <div className="mb-3">
                                <label id="task_label">Task</label>
                                <input
                                    className="input"
                                    type="text"
                                    id="task_input"
                                    placeholder="What next!?"
                                    onChange={(e) => setNewTask(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label id="status_label">Status</label>
                                <select
                                    className="input"
                                    id="status_input"
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                >
                                    {statusOptions.map((option) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label id="deadline_label">Deadline</label>
                                <input
                                    className="input"
                                    id="deadline_input"
                                    type="datetime-local"
                                    onChange={(e) => setNewDeadline(e.target.value)}
                                />
                            </div>
                            <button onClick={addTask} className="btn btn-success btn-sm">
                                Add Task
                            </button>
                        </form>
                    </div>
                    </center>
                </div>
            </div>
        </div>
    );
}

export default Todo;
