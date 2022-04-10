//@ts-nocheck
import jsPDF from "jspdf";
import "jspdf-autotable";

import {errorToaster, successToaster} from "./Toaster";
import {capitalize} from "@mui/material";
import {format} from "date-fns";

export function printUsers(users) {
    // title, type, rows, columns
    let columns = ["Name", "Email", "Parked at"];
    let rows = [];
    users.forEach((user) => {
        rows.push([user.name, user.email, `${user.parkingSpot ? user.parkingSpot.name : "None"}`]);
    });

    generatePDF(capitalize("All users"), rows, columns, "p");
}

export function printParkingSpots(spots) {
    // title, type, rows, columns
    let columns = ["Name", "Cost", "Late fee", "Booked", "Booked at", "Current Vehicle"];
    let rows = [];
    spots.forEach((spot) => {
        rows.push([spot.name, `KES ${spot.cost}/hr`, `KES ${spot.lateFee}/minute`, spot.booked ? spot.booked : "No", spot.bookedAt ? spot.bookedAt : "N/A", spot.currentVehicle ? spot.currentVehicle : "N/A"]);
    });

    generatePDF(capitalize("All parking spots"), rows, columns, "p");
}

export function printPayments(payments) {
    // title, type, rows, columns
    let columns = ["For", "Amount", "Paid by", ];
    let rows = [];
    payments.forEach((payment) => {
        rows.push([payment.parkingSpot ? payment.parkingSpot.name : "Error", `KES ${payment.amount}/hr`, payment.user?.name,]);
    });

    generatePDF(capitalize("All payments"), rows, columns, "p");
}


// define a generatePDF function that accepts a tickets argument
const generatePDF = (type, rows, columns, orientation) => {
    // initialize jsPDF
    const doc = new jsPDF({
        orientation: orientation,
        unit: "px",
        format: "a4",
        putOnlyUsedFonts: true
    });

    // define an empty array of rows
    const tableColumn = [...columns];
    const tableRows = [...rows];

    const date = Date().split(" ");
    // we use a date string to generate our filename.
    const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];

    const commonText = `This is a list of ${type}. Generated on ${format(
        new Date(),
        "dd/MM/yyyy"
    )} at ${format(
        new Date(),
        "hh:mm:ss a"
    )}`;
    const footerText = `${date}`;

    let pageSize = doc.internal.pageSize;
    let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();

    // report title. and margin-top + margin-left
    doc.setFontSize(20);
    doc.setFont("Helvetica", "bold");
    doc.text("Parking Management System", 30, 22);
    // doc.text(title, 14, 30);
    doc.setFontSize(16);
    doc.text(doc.splitTextToSize(type, pageWidth - 35, {}), 30, 40);
    doc.setFontSize(11);
    doc.setTextColor(100);

    // jsPDF 1.4+ uses getWidth, <1.4 uses .width
    pageSize = doc.internal.pageSize;
    pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
    doc.setFont("Helvetica", "normal");
    let text = doc.splitTextToSize(commonText, pageWidth - 35, {});
    doc.text(text, 30, 60);

    if (tableRows.length < 1) {
        errorToaster("There's no data. Add some data first, before trying to export.");
        return;
    }

    // load images
    const imgElements = rows.map(row => row[row.length-1]);

    // startY is basically margin-top
    doc.autoTable(
        {
            columns:tableColumn,
            body: tableRows,
            startY: 80,
            showHead: "firstPage",
        }
    );

    //footer
    doc.setFontSize(11);
    doc.text(footerText, 30, doc.lastAutoTable.finalY + 30);

    // we define the name of our PDF file.
    doc.save(`PARKING_SYSTEM_${type.toUpperCase()}_Report_${dateStr}.pdf`);

    successToaster(`Your ${type} data has been successfully exported to pdf.`);
};

export default generatePDF;