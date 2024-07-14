import React from 'react';
import clipboard from "./../assets/clipboard.svg"
import {Bounce, toast} from "react-toastify";

const CopyBranchName = ({branchName}) => {

    const copyText = () => {
        navigator.clipboard.writeText(`git checkout ${branchName}`);
        toast.success('Copied to clipboard!', {
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

    return (
        <div className={`bg-gray-300 w-full border border-gray-400 rounded-md flex items-center justify-between p-3 `}>
            <pre>git checkout {branchName}</pre>
            <button onClick={copyText}><img src={clipboard} width={24} height={24} alt="copy"/></button>
        </div>
    );
};

export default CopyBranchName;
