import { makeAutoObservable } from "mobx";
import axios from "axios";
import { API_URL } from "../http";
import AuthService from "../services/auth.service";
import RequestService from "../services/request.service";
import OffersService from "../services/offers.service";

export default class Store{

    //
    // Auth Store 
    //
    user = {};
    isAuth = false;
    isLoading = false;
    localErros = [];

    constructor(){
        // Автоматическое обновление стора при изменении какой-либо части
        makeAutoObservable(this)
    }

    setAuth(bool){
        this.isAuth = bool;
    }

    setUser(user){
        this.user = user
    }

    setLoading(bool){
        this.isLoading = bool
    }

    async login(email, password){
        this.setLoading(true)
        try{
            const response = await new AuthService().login(email, password);
            localStorage.setItem('token', response.data.accessToken);
            console.log(response)
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch(e){
            console.log(e)
            console.log(e.toJSON())
            console.log(e.message)

            this.setErrors([e.response?.data?.message])
        } finally{
            this.setLoading(false)
        }
    }

    async registration(data){
        try{ 
            const response = await new AuthService().registration(data.email, data.password, data.username, data.phoneNumber);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch(e){
            console.log(e)
            this.setErrors([e.response?.data?.message])
            console.log(e.response?.data?.message)
        } finally{
            this.setLoading(false)
        }
    }

    async logout(){
        try{
            const response = await new AuthService().logout();
            localStorage.removeItem('token');
            this.setAuth(false)
            this.setUser({})
        } catch(e){
            console.log(e.response?.data?.message)
            this.setErrors([e.response?.data?.message])
        } finally{
            this.setLoading(false)
        }
    }

    async checkAuth(){
        this.setLoading(true)
        try {
            const res = await axios.get(`${API_URL}/users/refresh`, {withCredentials:true})
            localStorage.setItem('token', res.data.accessToken);
            this.setAuth(true)
            this.setUser(res.data.user)
            console.log(res.data)
            this.setErrors([])
            console.log('1')
        } catch (e) {
            console.log(e)
            this.setErrors([e.response?.data?.message])
        }
        finally {
            this.setLoading(false)
        }
        
        console.log(this.isAuth)
    }

    async isAdmin(){
        try {
            const response = await new AuthService().isAdmin();
            return response.data
        } catch (error) {
            this.setErrors([error.response?.data?.message])
            return {admin: false}
        } finally{
            this.setLoading(false)
        }
    }

    async createRequest(offerID, userID, phoneNumber, rentdays){
        try {
            this.setLoading(true)
            const response = await new RequestService().create(offerID, userID, phoneNumber, rentdays);
            if(response.data.success == true) this.setErrors([])
            return response.data
        } catch (e) {
            console.log(e)
            this.setErrors([e.response?.data?.message])
        }
        finally {
            this.setLoading(false)
        }
    }

    async requestsSelf(){
        try {
            // this.setLoading(true)   
            if(!this.isAuth) return this.setErrors(["Вы не авторизованы!"])
            const response = await new RequestService().getSelfs();
            if(response.data.success == true) this.setErrors([])
            return response.data
        } catch (e) {
            console.log(e)
            this.setErrors([e.response?.data?.message])
        }
        finally {
            this.setLoading(false)
        }
    }

    async getOffers(){
        try {
            const response = await new OffersService().getAll();
            return response.data
        } catch (error) {
            console.log(error)
            this.checkAuth()
        }
    }

    async getOffer(id){
        try {
            const response = await new OffersService().getOffer(id);
            console.log(response)
            return response.data
        } catch (error) {
            console.log(error)
            this.checkAuth()
        }
    }

    async getRequests(){
        try {
            const response = await new RequestService().getRequests()

            return response.data
        } catch (error) {
            
        } finally{
            this.setLoading(false)
        }
    }

    async RequestClose(requestID, closedType, closedComment){
        try {
            const response = await new RequestService().close(requestID, closedType, closedComment);
            console.log(response)
        } catch (error) {
            console.log(error)
            this.checkAuth()
        } finally {

        }
    }

    setErrors(errors){
        console.log(errors)
        this.localErros = errors;
    }
}