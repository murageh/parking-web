//@ts-nocheck
import React, {useContext, useState} from "react";
import {Form, useForm} from "utils/useForm";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Controls from "utils/Controls/Controls";
import Button from "@mui/material/Button";
import BasePage from "../components/page";
import {api} from "../api";
import {UploadFilesService} from "../upload/upload-images.service";
import Loading from "../utils/loading";
import {useNavigate} from "react-router-dom";
import MessageSnackbars from "../utils/alerts";
import {saveAdmissionEntry} from "./dialogs/scanDialog";
import {Helmet} from "react-helmet";

const initialParkingSpotValues = {
    "name": "",
    "cost": 50,
    "duration": 60,
    "lateFee": 1
};

function NewParking() {
    const validate = (fieldValues = values) => {
        let temp = {...errors};
        // let temp = {};
        if ("name" in fieldValues)
            temp.name =
                fieldValues.name ? "" : "This field is required.";
        if ("cost" in fieldValues)
            temp.cost =
                fieldValues.cost > 0 ? "" : "This value should be greater than 0.";
        if ("lateFee" in fieldValues)
            temp.lateFee =
                fieldValues.lateFee > 0 ? "" : "This value should be greater than 0.";
        if ("duration" in fieldValues)
            temp.duration =
                fieldValues.duration > 0 ? "" : "This value should be greater than 0.";
        setErrors({
            ...temp,
        });
        if (fieldValues === values) return Object.values(temp).every((x) => x === "");
    };
    const {values, setValues, errors, setErrors, handleInputChange, resetForm} = useForm(
        initialParkingSpotValues,
        true,
        validate
    );
    let navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    // Page errors and info toasts
    const [error, updateError] = useState({counter: 0, message: null});
    const [info, updateInfo] = useState({counter: 0, message: null});

    const setError = (err) => {
        updateError({counter: ++error.counter, message: `${err} (${error.counter + 1})`});
    };

    const setInfo = (inf) => {
        updateInfo({counter: ++info.counter, message: `${inf} (${info.counter + 1})`});
    };

    const handleClose = () => {
        setShowScanDialog(false);
    }

    const handleClearForm = () => {
        // TODO: Clear any state
        resetForm();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            // TODO: Process data upload to server
            resetForm();
        } else {
            console.log("could not validate");
        }
    };

    const handleAddParking = async () => {
        await handleAddParkingSpot();
    }

    const handleAddParkingSpot = async () => {
        setLoading(true);
        if (validate()) {
            await api().post(
                '/parking',
                {
                    "name": values.name,
                    "cost": Number(values.cost),
                    "duration": Number(values.duration),
                    "lateFee": Number(values.lateFee)
                }
            ).then(response => {
                const data = response.data;
                if (data.success){
                    resetForm();
                    setInfo(data.message ?? "Parking Spot was added successfully.");
                } else {
                    setError(data.message);
                }
            }).catch(error => {
                if(error.response){
                    const data = error.response.data;
                    console.log(data);
                    setError(data.message);
                }
            })
        }
        setLoading(false);
    }
    
    return (
        <main className={"main"}>
            <Helmet>
                <meta charSet="utf-8" />
                <title>New Parking Spot - Parking Management System</title>
            </Helmet>
            <Box my={2} p={1}>
                {error.message !== null && <MessageSnackbars message={error.message} color="error"/>}
                {info.message !== null && <MessageSnackbars message={info.message} color="info"/>}
                <Typography alignContent={"center"} variant={"h5"} fontWeight="bold">
                    New parking spot
                </Typography>
                {loading ? <Loading/> : ''}
                <Box mt={3}>
                    <Form>
                        <Grid container>
                            <Grid item xs={6}>
                                <Controls.Input
                                    label="Name"
                                    name="name"
                                    value={values.name}
                                    onChange={handleInputChange}
                                    error={errors.name}
                                />

                                <Controls.Input
                                    label="Cost per hour"
                                    name="cost"
                                    type="number"
                                    value={values.cost}
                                    onChange={handleInputChange}
                                    error={errors.cost}
                                />

                            </Grid>
                            <Grid item xs={6}>
                                <Controls.Input
                                    label="Late fee per minute"
                                    name="lateFee"
                                    readOnly={true}
                                    type="number"
                                    value={values.lateFee}
                                    onChange={handleInputChange}
                                    error={errors.lateFee}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button onClick={handleAddParking}
                                        disabled={loading}
                                        variant={"contained"}>Add parking spot</Button>
                            </Grid>
                        </Grid>
                    </Form>
                </Box>
            </Box>
        </main>
    );
}

export default function () {
    return <BasePage children={<NewParking/>}/>
};