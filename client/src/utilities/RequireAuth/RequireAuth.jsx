import { useContext, useEffect } from "react"
import { Context } from "../.."
import Loader from "../Loader/Loader"
import { useNavigate } from "react-router-dom"
import { observer } from "mobx-react-lite"

const RequireAuth = ({ children }) => {
    const {store} = useContext(Context)
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('token')){
            store.checkAuth()
        }
    }, [])

    if(store.isLoading){
        console.log("Loading",store.isLoading)
        return <Loader/>
    }

    if(!store.isAuth){
        if(!store.user) return;
        navigate("/login", {replace: true})
        return
    }

    return children
}


export default observer(RequireAuth);