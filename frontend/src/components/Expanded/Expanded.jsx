import React, {useState} from 'react';

const Expanded = ({title, children, isOpenByDefault}) => {

    const [isOpen, setIsOpen] = useState(isOpenByDefault || false);

    return (
        <div className="w-full">
            <button className="w-full bg-gray-200 border-gray-300 border rounded-md p-2 flex justify-between items-center" onClick={() => setIsOpen(!isOpen)}>
                <span>{title}</span>
                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-full opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="bg-white border-gray-300 border-x border-b rounded-b-md p-3">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Expanded;
