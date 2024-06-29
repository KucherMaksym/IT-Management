import React from 'react';
import github from "./../assets/GitHub.png"

const LogInWithGitHub = () => {
    return (
        <a className={`bg-black rounded-xl flex text-white p-2 items-center mr-5`} href={"http://localhost:8000/auth/github"} >
            <img src={github} width={30} height={30} className="mr-3" />
            Log In with GitHub
        </a>
    );
};

export default LogInWithGitHub;
