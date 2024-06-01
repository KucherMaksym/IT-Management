import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import dayjs from 'dayjs';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { styled, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useState} from "react";
import {PickersActionBar} from "@mui/x-date-pickers";

const highlightedDates = [dayjs().add(3, 'day'), dayjs().add(5, 'day'), dayjs().add(7, 'day')];


const theme = createTheme({
    components: {
        MuiPickersDay: {
            styleOverrides: {
                root: ({ ownerState }) => ({
                    ...(highlightedDates.some(date => ownerState.day.isSame(date, 'day')) && {
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

const actionBar = React.forwardRef((props, ref) => {
    return(
        <PickersActionBar sx={{display: "none"}}  onCancel={props.onCancel} onAccept={props.onAccept} onClear={props.onClear} onSetToday={props.onSetToday}>

        </PickersActionBar>
    )
})

const CustomDay = React.forwardRef(({ day, outsideCurrentMonth, ...props }, ref) => {
    const isHighlighted = highlightedDates.some(date => day.isSame(date, 'day'));

    return (
        <PickersDay
            {...props}
            outsideCurrentMonth={outsideCurrentMonth}
            day={day}
            ref={ref}
            sx={{
                backgroundColor: isHighlighted ? '#ff4081' : 'transparent',
                color: isHighlighted ? 'white' : 'inherit',
                '&:after': {
                    content: isHighlighted ? `" "` : null,
                    right: "0",
                    top: "0",
                    borderRadius: "50%",
                    position: 'absolute',
                    height: "10px",
                    width: "10px",
                    backgroundColor: "red",
                    zIndex: "2",

                    // content: '"*"',
                    // color: 'green',
                    // marginLeft: '4px',
                },
                '&:hover, &:focus': {
                    backgroundColor: isHighlighted ? '#c60055' : 'rgba(0,0,0,0.08)',
                },
            }}
        >
        </PickersDay>
    );
});

export default function StaticDatePickerWithHighlight(props) {
    const today = dayjs();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticDatePicker
                    orientation="portrait"
                    disablePast={true}
                    value={props.selectedDay}
                    onChange={props.onChange}
                    slots={{
                        day: CustomDay,
                        actionBar: actionBar
                    }}
                />
            </LocalizationProvider>
        </ThemeProvider>
    );
}
