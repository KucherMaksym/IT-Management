import React, { useState, useRef, useEffect } from 'react';
import classes from './ImageFullScreen.module.css';



const ImageFullScreen = ({ fileUrl, onClose }) => {
    const [scale, setScale] = useState(1);
    const imageRef = useRef(null);
    const [origin, setOrigin] = useState({ x: 0, y: 0 });
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startDragCords, setStartDragCords] = useState({ x: 0, y: 0 });


    const handleWheel = (e) => {
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const newScale = Math.max(scale + delta, 0.1);

        const image = imageRef.current;
        if (image) {
            const rect = image.getBoundingClientRect();
            const cursorX = e.clientX - rect.left;
            const cursorY = e.clientY - rect.top;
            const offsetX = (cursorX / rect.width) * 100;
            const offsetY = (cursorY / rect.height) * 100;

            const newOriginX = offsetX;
            const newOriginY = offsetY;

            setTranslate({
                x: translate.x - ((cursorX - rect.width / 2) / scale) * (newScale - scale),
                y: translate.y - ((cursorY - rect.height / 2) / scale) * (newScale - scale)
            });


            setOrigin({ x: newOriginX, y: newOriginY });
            setScale(newScale);
        }
    };


    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        setStartDragCords({ x: e.clientX, y: e.clientY });
    };



    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startDragCords.x;
        const deltaY = e.clientY - startDragCords.y;
        setStartDragCords({ x: e.clientX, y: e.clientY });
        setTranslate((prevTranslate) => ({
            x: prevTranslate.x + deltaX / scale,
            y: prevTranslate.y + deltaY / scale,
        }));
    };

    useEffect(() => {
        const image = imageRef.current;

        isDragging ? image.style.transition ="all 0s" : image.style.transition = "all 0.15s";

        if (image) {
            image.style.transform = `scale(${scale}) translate(${translate.x}px, ${translate.y}px)`;
            image.style.transformOrigin = `${origin.x}% ${origin.y}%`;
        }
    }, [scale, translate, origin]);

    const resetTransform = () => {
        setScale(1);
        setTranslate({ x: 0, y: 0 });
        setOrigin({ x: 50, y: 50 });
    };

    return (
        <div className={classes.background}>
            <div>
                <div className="absolute z-10 top-0 left-0 h-16 w-full bg-black/20 backdrop-blur-sm flex justify-center px-3">
                    <div className="w-full container flex justify-end gap-10">
                        <button className="text-3xl" onClick={resetTransform}>
                            🔄
                        </button>
                        <button className="text-2xl" onClick={onClose}>
                            ❌
                        </button>
                    </div>
                </div>
                <div
                    className={classes.imageContainer}
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}>

                    <img
                        ref={imageRef}
                        className={`${classes.image} ${isDragging ? "cursor-grabbing" : "cursor-grab"} `}
                        src={fileUrl}
                        alt=""
                        width="100%"
                        height="100%"
                    />
                </div>
            </div>
        </div>
    );
};

export default ImageFullScreen;
