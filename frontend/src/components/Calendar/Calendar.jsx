import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import dayjs from 'dayjs';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { styled, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { forwardRef } from "react";
import { PickersActionBar } from "@mui/x-date-pickers";

const theme = createTheme({
    components: {
        MuiPickersDay: {
            styleOverrides: {
                root: ({ ownerState }) => ({
                    ...(ownerState.isHighlighted && {
                        backgroundColor: '#ff4081',
                        color: 'white',
                        '&:hover, &:focus': {
                            backgroundColor: '#c60055',
                        },
                    }),
                }),
            },
        },
    },
});

const actionBar = forwardRef((props, ref) => (
    <PickersActionBar
        sx={{ display: "none" }}
        onCancel={props.onCancel}
        onAccept={props.onAccept}
        onClear={props.onClear}
        onSetToday={props.onSetToday}
    />
));

const CustomDay = forwardRef(({ day, outsideCurrentMonth, highlightedDates, ...props }, ref) => {
    if (!highlightedDates) {
        return(
        <PickersDay
            {...props}
            outsideCurrentMonth={outsideCurrentMonth}
            day={day}
            ref={ref}
        />
        );
    }

    const isHighlighted = highlightedDates.some(date => day.isSame(date, 'day'));

    return (
        <PickersDay
            {...props}
            outsideCurrentMonth={outsideCurrentMonth}
            day={day}
            ref={ref}
            sx={{
                '&:after': {
                    content: isHighlighted ? '" "' : null,
                    right: "0",
                    top: "0",
                    borderRadius: "50%",
                    position: 'absolute',
                    height: "10px",
                    width: "10px",
                    backgroundColor: "red",
                    zIndex: "1",
                    transition: "all 0,2s",
                },
            }}
        />
    );
});

export default function StaticDatePickerWithHighlight({ highlightedDates, selectedDay, onChange }) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticDatePicker
                    orientation="portrait"
                    // disablePast={true}
                    value={selectedDay}
                    onChange={onChange}
                    slots={{
                        day: (props) => <CustomDay {...props} highlightedDates={highlightedDates} />,
                        actionBar: actionBar,
                    }}
                />
            </LocalizationProvider>
        </ThemeProvider>
    );
}
