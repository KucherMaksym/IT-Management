import React from 'react';
import {useQuery, useQueryClient} from "react-query";
import Modal from "../../components/Modal/Modal";
import {useNavigate} from "react-router-dom";
import {customAxios} from "../../index";
import axios from "axios";

const CompanySettings = () => {

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedRepo, setSelectedRepo] = React.useState(null);
    const navigate = useNavigate();

    const fetchAllRepos = async () => {
        const response = await axios.get('http://localhost:8000/api/companies/allMyRepos', {withCredentials: true});
        return response.data;
    }
    const {data, isLoading, isError} = useQuery("repos", fetchAllRepos, {
        refetchOnWindowFocus: false
    });

    const onSelectRepo = (repo) => {
        setIsModalOpen(true);
        setSelectedRepo(repo.full_name);
    }

    const submitRepo = () => {
        setIsModalOpen(false);
        customAxios.patch('http://localhost:8000/api/companies/setMainRepo', {repository: selectedRepo}, ).then(res => {
            navigate("/");
        }).catch(err => {
            console.log(err);
        })
    }

    if (isLoading) return <div>Loading...</div>;

    if (isError) return <div>Error</div>;


    return (
        <div>
            <div className={`flex flex-col`}>
                <p className={`font-bold text-lg`}>Select repository</p>
                {data && data.map((repo, index) => (
                    <button key={index} onClick={() => onSelectRepo(repo)}>{repo.full_name}</button>
                ))}
            </div>

            { isModalOpen &&

                <Modal onClose={() => setIsModalOpen(false)}>
                    <div className={`flex flex-col items-center mt-5`}>
                        <h4 className={`text-xl max-w-72`}>You have chosen <strong> {selectedRepo}</strong> repository</h4>
                        <h4 className={`max-w-60 my-3`}>Are you sure you want to make this repository the main of this
                            company?</h4>
                        <button className={`bg-green-600 text-white px-4 py-2 rounded-md`} onClick={submitRepo}>Yes</button>
                    </div>
                </Modal>

            }
        </div>
    );
};

export default CompanySettings;
