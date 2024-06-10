import React from 'react';
import word from "./../assets/word.png"
import powerpoint from "./../assets/powerpoint.png"
import excel from "./../assets/excel.png"
import pdf from "./../assets/pdf.png"
import image from "./../assets/image.png"


const FileExtension = ({filename}) => {

    const imageExtensionMap = new Map();

    imageExtensionMap.set("docx", word)
    imageExtensionMap.set("pptx", powerpoint)
    imageExtensionMap.set("xlsx", excel)
    imageExtensionMap.set("pdf", pdf)
    imageExtensionMap.set("jpg", image)

    const getFileExtension = (filename) => {
        const extension = filename.split('.').pop();
        const imageSrc = imageExtensionMap.get(extension) || "./../assets/file.jpg";

        return <img width={'30px'} src={imageSrc} alt={imageSrc}/>;

    }

    return (
        <>
            {getFileExtension(filename)}
        </>
    );
};

export default FileExtension;
