import { useContext, useEffect } from "react"
import { Context } from "../.."
import Loader from "../Loader/Loader"
import { useNavigate } from "react-router-dom"
import { observer } from "mobx-react-lite"

const RequireAuth = ({ children }) => {
    const {store} = useContext(Context)
    const navigate = useNavigate();

    store.headerAuth = false;

    useEffect(() => {
        if(localStorage.getItem('token')){
            store.checkAuth()
        }
        store.headerAuth = false;
    }, [])

    if(store.isLoading){
        return <><Loader/></>
    }

    if(!store.isAuth){
        if(!store.user) return;
        return navigate("/login", {replace: true})
    }

    return children
}


export default observer(RequireAuth);