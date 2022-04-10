// @ts-nocheck
import React, {Fragment, useState} from "react";
import {useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable,} from "react-table";
import {Checkbox} from "./Checkbox";
import {CircularProgress} from "@mui/material";
import {BottomNavBar} from "./BottomNavBar";

const LoadingData = ({message, showProgress = true}) => {
    return (
        <div className={"loading-container"}>
            {showProgress ? <CircularProgress/> : ""}
            <h4 data-testid={"loading-indicator"} className={"loading-indicator"}>
                {message}
            </h4>
        </div>
    );
};

export function generateDate(timestamp, isISO = false) {
    let date;
    if (isISO) {
        date = new Date(Date.parse(timestamp) || 0);
    } else date = new Date(timestamp);

    // console.log({ timestamp });

    const hours = date.getHours().toString().length === 1 ? "0" + date.getHours() : date.getHours();
    const minutes =
        date.getMinutes().toString().length === 1 ? "0" + date.getMinutes() : date.getMinutes();
    return `${date.getDate()}/${
        date.getMonth() + 1
    }/${date.getFullYear()} at ${hours}:${minutes} EAT`;
}

export const GlobalFilter = ({filter, setFilter, type}) => {
    return (
        <div className={"filter-div"}>
      <span>
        Search {type}:{" "}
          <input
              type={"search"}
              value={filter || ""}
              onChange={(e) => {
                  setFilter(e.target.value);
              }}
              data-testid={"search-filter"}
          />
      </span>
        </div>
    );
};


export function getTableColumns(type: string) {
    return type === "users"
        ? [
            {
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "Email",
                accessor: "email",
            },
            {
                Header: "Parked at",
                accessor: (user) =>
                    user.parkingSpot ? user.parkingSpot.name : "None",
            },
        ]
        : type === "payments"
            ? [
                {
                    Header: "Paid by",
                    accessor: (payment) =>
                        payment.userName,
                },
                {
                    Header: "Paid for",
                    accessor: (payment) =>
                        payment.parkingSpotName ? payment.parkingSpotName : "Error",
                },
                {
                    Header: "Amount",
                    accessor: (payment) =>
                        `KES ${payment.amountPaid}`,
                },
            ]
            : type === "parking"
                ? [
                    {
                        Header: "Name",
                        accessor: "name",
                    },
                    {
                        Header: "Cost",
                        accessor: (spot) =>
                            `KES ${spot.cost}/hr`,
                    },
                    {
                        Header: "Late fee",
                        accessor: (spot) =>
                            `KES ${spot.lateFee}/minute`,
                    },
                    {
                        Header: "Booked",
                        accessor: (spot) =>
                            spot.booked ? "Yes" : "No",
                    },
                    {
                        Header: "Booked at",
                        accessor: (spot) =>
                            spot.bookedAt ? generateDate(spot.bookedAt) : "N/A",
                    },
                    {
                        Header: "Current Vehicle",
                        accessor: (spot) =>
                            spot.currentVehicle ? spot.currentVehicle : "N/A",
                    },
                ]
                : [
                    {
                        Header: "Select an option above",
                        accessor: "sample_accessor",
                    },
                ];
}

export function Table({type, columns, data, showAdd}) {
    const [selectedRow, setSelectedRow] = useState("none selected");

    const getSelectedRow = (selectedFlatRow) => {
        return selectedFlatRow.original.name;
    };

    const deleteRow = (selectedFlatRows) => {
        let name = "none selected";

        // if the array is not empty
        if (selectedFlatRows.length > 0) {
            // currently does not support multi-select
            // thus array contains only one  item - index 0
            name = getSelectedRow(selectedFlatRows[0]);
            if (window.confirm("Do you want to delete " + name + "?")) {
                if (type === "students") {
                    // dispatch(deletePartner(name));
                } else {
                    if (type === "staff") {
                        // dispatch(deleteOutlet(name));
                    } else {
                        if (type === "visitors") {
                            // dispatch(deleteCoupon(name));
                        }
                    }
                }
            }
        } else return;
    };

    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        gotoPage,
        pageCount,
        setPageSize,
        state,
        setGlobalFilter,
        prepareRow,
        toggleAllRowsSelected,
        selectedFlatRows,
    } = useTable(
        {
            columns,
            data,
            initialState: {pageIndex: 0, pageSize: 10},
        },
        useGlobalFilter,
        useSortBy,
        usePagination,
        useRowSelect,
        (hooks) => {
            hooks.visibleColumns.push((columns) => {
                return [
                    {
                        id: "selection",
                        Header: ({getToggleAllRowsSelectedProps}) => (
                            <Checkbox {...getToggleAllRowsSelectedProps()} />
                        ),
                        Cell: ({row}) => (
                            <Checkbox {...row.getToggleRowSelectedProps()} />
                        ),
                    },
                    ...columns,
                ];
            });
        }
    );

    const {globalFilter, pageIndex, pageSize} = state;

    // Render the UI for the table

    return (
        <Fragment>
            {/*{type === "students" || type === "staff" || type === "visitors" ? (*/}
            {/*    <ContextMenu selectedItem={selectedRow} type={type.slice(0, -1)}/>*/}
            {/*) : (*/}
            {/*    <></>*/}
            {/*)}*/}
            <div className={"action-bar"}>
                <GlobalFilter
                    filter={globalFilter}
                    setFilter={setGlobalFilter}
                    type={type}
                />
            </div>
            <div className={"table-container"}>
                <div className={"table-holder"}>
                    <table {...getTableProps()}>
                        <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                    >
                                        {column.render("Header")}
                                        <span>
                        {column.isSorted
                            ? column.isSortedDesc
                                ? " ▼"
                                : " ▲"
                            : ""}
                      </span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                        {page.map((row, i) => {
                            prepareRow(row);
                            return (
                                <tr
                                    {...row.getRowProps()}
                                    className={"tableRow"}
                                    onContextMenu={(e) => {
                                        toggleAllRowsSelected(false);
                                        row.toggleRowSelected(row);

                                        setSelectedRow(
                                            type === "partners"
                                                ? page[i].values.name
                                                : type === "users"
                                                    ? page[i].values.phone_number
                                                    : ""
                                        );
                                    }}
                                >
                                    {row.cells.map((cell) => {
                                        return (
                                            <td
                                                {...cell.getCellProps()}
                                                onClick={() => {
                                                    toggleAllRowsSelected(false);
                                                    row.toggleRowSelected(row);

                                                    //make this the selected row for the contextmenu
                                                    setSelectedRow(
                                                        page[i].values.name ?? page[i].values.phone_number
                                                    );
                                                }}
                                            >
                                                {cell.render("Cell")}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                    {data.length < 1 ? (
                        <LoadingData
                            message={
                                "I couldn't find any " +
                                type +
                                " on the server. " +
                                "If you're confident that everything's okay then don't fret." +
                                " Add a new one to make this page more interesting."
                            }
                            showProgress={false}
                        />
                    ) : (
                        ""
                    )}
                </div>

                <BottomNavBar
                    dataSize={data.length}
                    dataType={type}
                    pageIndex={pageIndex}
                    pageOptions={pageOptions}
                    pageSize={pageSize}
                    pageCount={pageCount}
                    setPageSize={setPageSize}
                    gotoPage={gotoPage}
                    previousPage={previousPage}
                    nextPage={nextPage}
                    canPreviousPage={canPreviousPage}
                    canNextPage={canNextPage}
                />
            </div>
        </Fragment>
    );
}

