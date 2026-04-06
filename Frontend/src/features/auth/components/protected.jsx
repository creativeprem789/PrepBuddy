import {useAuth} from '../hooks/useAuth';
import React from 'react';
import { Navigate } from 'react-router';

const Protected = ({children}) => {
    const {loading, user} = useAuth();
    
    if(loading) {
        return (<main><h3>Loading...</h3></main>);
    }
    if(!user) {
        return <Navigate to={"/"} />
    }
    return children;
}
export default Protected;