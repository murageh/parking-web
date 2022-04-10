//@ts-nocheck
import React from "react";
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from "@mui/material/Typography";
import {Grid, Paper} from "@mui/material";
import {styled} from "@mui/styles";
import Box from '@mui/material/Box';
import BasePage from "../components/page";
import {Helmet} from "react-helmet";

export const Item = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.primary,
}));

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({theme}) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{fontSize: '0.9rem'}}/>}
        {...props}
    />
))(({theme}) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({theme}) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

function Home() {

    return (
        <main className={"main"}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>Home - Parking Management System</title>
            </Helmet>
            <Box my={2} mt={1} px={3} py={2}>
                <Typography alignContent={"center"} variant={"h5"} fontWeight="bold">
                    Home
                </Typography>
                <Box sx={{flexGrow: 1}} mt={2}>
                    <Grid container spacing={2} alignContent={"center"}>
                        <Grid item xs={6} py={4}>
                            <Item style={{
                                cursor: "pointer",
                                paddingTop: "2rem",
                                paddingBottom: "2rem",
                                // background: "#78e997"
                            }}>
                                <Typography component="a" href={"/users"} style={{textDecoration: "none"}}
                                            variant={"button"}>View users</Typography>
                            </Item>
                        </Grid>
                        <Grid item xs={6} py={4}>
                            <Item style={{
                                cursor: "pointer",
                                paddingTop: "2rem",
                                paddingBottom: "2rem",
                                // background: "#7c5cf5"
                            }}>
                                <Typography component="a" href={"/parking"} style={{textDecoration: "none"}}
                                            variant={"button"}>View parking spots</Typography>
                            </Item>
                        </Grid>
                        <Grid item xs={6} py={4}>
                            <Item style={{
                                cursor: "pointer",
                                paddingTop: "2rem",
                                paddingBottom: "2rem",
                                // background: "#7c5cf5"
                            }}>
                                <Typography component="a" href={"/payments"} style={{textDecoration: "none"}}
                                            variant={"button"}>View payments</Typography>
                            </Item>
                        </Grid>
                        <Grid item xs={12} py={4}>
                            <Item style={{
                                cursor: "pointer",
                                paddingTop: "2rem",
                                paddingBottom: "2rem",
                                // background: "#7c5cf5"
                            }}>
                                <Typography component="a" href={"/newParking"} style={{textDecoration: "none"}}
                                            variant={"button"}>Add new parking spot</Typography>
                            </Item>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </main>
    );
}

export default function () {
    return <BasePage children={<Home/>}/>
};