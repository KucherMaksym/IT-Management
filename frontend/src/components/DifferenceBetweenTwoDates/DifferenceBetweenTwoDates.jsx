import React from 'react';
import dayjs from "dayjs";

const DifferenceBetweenTwoDates = ({deadline, unit}) => {
    let difference = dayjs(deadline).diff(dayjs(), `${unit}`);

    const color = `${difference < 2 ? 'text-red-600' : difference < 5 ? "text-yellow-500" :  difference < 8 ? "text-green-400" : "text-green-700"}`;

    let isDeadlineMissed = false;

    if (difference <= 1 && difference >= 0) {
        difference = "< 1";
    } else if (difference <= 0) {
        difference = "you missed deadline";
        isDeadlineMissed = true;
    }

    return (
        <div className={`absolute right-2 top-2`}>
            <p className={`${color}`}>
                <strong>🕘 {difference}</strong>{ isDeadlineMissed ? "" :  " days left"}
            </p>
        </div>
    );
};

export default DifferenceBetweenTwoDates;
