import React, {useRef, useState} from 'react';
import StaticDatePickerLandscape from "../../../components/Calendar/Calendar";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useMutation, useQuery} from 'react-query';
import axios from "axios";
import {Bounce, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import paperClip from "./../../../components/assets/paperClip.svg"
import Expanded from "../../../components/Expanded/Expanded";
import {customAxios} from "../../../index";

const createNewTask = async (taskData) => {
    const response = await axios.post(`http://localhost:8000/api/tasks/newTask/${taskData.id}`, taskData.formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
    });
    return response.data;
};

const NewTask = () => {

    const name = useRef(null)
    const description = useRef(null)

    const [selectedDay, setSelectedDay] = useState(null);
    const [files, setFiles] = useState([]);

    const {id} = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

   const [createBranch, setCreateBranch] = useState(true);
   const branchName = useRef(null);

    const getCollaborators = async () => {
        const response = await customAxios.get("http://localhost:8000/api/companies/allContributors", {withCredentials: true});
        console.log(response.data)
        return response.data;
    }

    const {data: collaborators, isLoading: collaboratorsIsLoading, isError: collaboratorsIsError} = useQuery("collaborators", getCollaborators, {
        refetchOnWindowFocus: false
    });

    const handleNewDay = (e) => {
        setSelectedDay(e);
    };

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };


    const mutation = useMutation(createNewTask, {
        onSuccess: (data) => {
            toast.success("Task Created", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            const returnTo = searchParams.get('returnTo');
            if (returnTo) {
                navigate(returnTo);
            } else {
                navigate('/');
            }
        },
        onError: (error) => {
            console.error('Error uploading the task:', error);
        }
    });

    const sendNewTask = () => {

        let newTask = {
            name: name.current.value,
            description: description.current.value,
            createBranch: createBranch,
            branchName: branchName.current.value,
        }

        if (!newTask.name || !newTask.description || !selectedDay) {
            return toast.error('Write the name, description and select the deadline of new task', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }
        let createBranchInForm;
        if (collaborators.includes(searchParams.get("username"))) {
            createBranchInForm = createBranch
        } else {
            createBranchInForm = false
        }

        const formData = new FormData();
        formData.append('name', newTask.name);
        formData.append('description', newTask.description);
        formData.append('createBranch', createBranchInForm);
        formData.append('branchName', newTask.branchName);
        formData.append('deadline', selectedDay.format("YYYY-MM-DD"));

        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        mutation.mutate({id, formData});
    };

    return (
        <div className={`container content max-w-screen-xl mt-10 p-10 flex flex-col items-center justify-center`} style={{height: `calc(100vh - 12)`}}>
            <div className={`w-full flex md:flex-row flex-col items-center`}>
                <div className={`w-6/12 flex items-center justify-center`} style={{width: ""}}>
                    <StaticDatePickerLandscape onChange={handleNewDay} value={selectedDay}/>
                </div>
                <div className={`w-full md:w-6/12 flex h-full flex-col items-center`}>
                    <div className={`h-full flex mt-10 w-full justify-end`}>
                        <div className={`relative w-full`}>
                            <div
                                className=" p-2 overflow-hidden rounded-lg border border-gray-300 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                                <label className="sr-only">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="Task name"
                                    ref={name}
                                    className="block w-full border-0 text-lg font-medium placeholder:text-gray-400 outline-0"
                                />
                                <label className="sr-only">
                                    Description
                                </label>
                                <div className={`h-[1px] bg-gray-300 w-full`}></div>
                                <textarea
                                    rows="7"
                                    ref={description}
                                    placeholder="Task description"
                                    className="mt-3 min-h-20 max-h-72 w-full resize-none border-0 text-gray-900 placeholder:text-gray-400 sm:text-sm outline-0"
                                />

                                <div className={`flex justify-between items-center mt-5`}>
                                    <div>
                                        <label htmlFor="input">
                                            <img className={`cursor-pointer`} src={paperClip} width={25} alt=""/>
                                        </label>
                                        <input
                                            type="file"
                                            id="input"
                                            className={`hidden file:border-0 file:rounded-md file:bg-indigo-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white`}
                                            multiple
                                            onChange={handleFileChange}/>
                                    </div>
                                    <button
                                        className={`rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white`}
                                        onClick={sendNewTask}
                                        disabled={mutation.isLoading}>
                                        {mutation.isLoading ? 'Creating...' : 'Create'}
                                    </button>
                                </div>
                                {files.length > 0 &&
                                    <div className={`mt-5`}>
                                        <h5 className={`text-lg font-bold`}>Selected files</h5>
                                        <ul className={`flex flex-col items-start`}>
                                            {Array.from(files).map((file, index) => (
                                                <li className={`overflow-hidden max-w-full text-ellipsis whitespace-nowrap`}
                                                    key={index}>{file.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            { collaborators &&
                <div className={`w-full flex mt-5 ${!collaborators.includes(searchParams.get("username")) ? "opacity-60 pointer-events-none" : "opacity-100"}`}>
                    <div className={`w-full md:w-6/12`}>
                        <Expanded isOpenByDefault={true} title={"GitHub"}>
                            <div className={`flex flex-col justify-start`}>
                                <div className={`flex justify-start`}>
                                    {/*toggle button*/}
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input type="checkbox" onChange={() => setCreateBranch(!createBranch)}
                                               className="sr-only peer " checked={createBranch}/>
                                        <div
                                            className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                    <h3 className={`text-lg ml-5`}>Create a new branch</h3>
                                </div>
                                <input
                                    className={` border border-gray-500 mt-3 w-72 outline-indigo-400 rounded-md p-1 disabled:opacity-50`}
                                    placeholder={"Branch name (task name by default)"} type="text"
                                    disabled={!createBranch} ref={branchName}/>
                            </div>
                        </Expanded>
                    </div>
                </div>
            }

        </div>
    );
};

export default NewTask;
