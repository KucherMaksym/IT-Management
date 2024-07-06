import React, {useState} from 'react';
import Modal from "../../components/Modal/Modal";
import axios from "axios";
import {useSelector} from "react-redux";


const MyComponent = () => {

    const { user, loading, isAuthenticated, company} = useSelector(state => state.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [companyName, setCompanyName] = useState("")


    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };


    const createNewCompany = (event) => {
        event.preventDefault();
        const newCompany = {
            name: companyName,
            admin: user._id
        }
        axios.post("http://localhost:8000/api/companies/newCompany", newCompany).then((response) => {
            window.location.reload();
        })
    }


    return (
        <section className={`w-full flex flex-col items-center`}>
            { !loading && <div className={`content`}>
                {!company.company && !company.loading &&
                    <div>
                        <h1 className={` mt-10 text-4xl`}>Welcome to DoIT</h1>
                        <p>Manage your company very simple</p>
                    </div>
                }
                {!company.company && !company.loading && user && isAuthenticated && <div className={`mt-20 flex justify-center items-center container`}>
                    <div className={`w-6/12`}>
                        <h2 className={`text-2xl`}>I am a new employee</h2>
                        <button className={`text-blue-700`} onClick={() => {
                            navigator.clipboard.writeText(user._id)
                        }}>Copy my ID
                        </button>
                        <p className={`text-xs`}>*Send this ID to an admin or manager of company</p>
                    </div>

                    <div className={`w-6/12`}>
                        <h2 className={`text-2xl`}>I want to create a new company</h2>
                        <button className={`text-blue-700`} onClick={openModal}>Start creating</button>
                        {isModalOpen && (
                            <Modal onClose={closeModal}>
                                <form className={`flex flex-col items-center`} onSubmit={createNewCompany}>
                                    <label className={`mt-5 text-2xl`}>Company name</label>
                                    <input className={`text-lg mt-3 outline-0 border-b border-b-blue-400`} type="text" value={companyName} onChange={(event) => setCompanyName(event.target.value)} />
                                    <button type={"submit"} className={`rounded bg-blue-500 text-white mt-4 p-1`}>Submit</button>
                                </form>
                            </Modal>
                        )}
                    </div>
                </div>}

                {company.company && user && <div>

                    <h1>Welcome to {company.company.name}</h1>

                </div>}
            </div> }

        </section>
    );
};

export default MyComponent;
