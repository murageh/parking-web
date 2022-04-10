//@ts-nocheck
import {createContext, useState} from 'react';

//create a context, with createContext api
export const userDetailsContext = createContext();

const UserDetailsProvider = (props) => {
    const [userDetails, setUserDetails] = useState<StudentData>(undefined);

    return (
        <userDetailsContext.Provider value={[userDetails, setUserDetails]}>
            {props.children}
        </userDetailsContext.Provider>
    );
};

export default UserDetailsProvider;