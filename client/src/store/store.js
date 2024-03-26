import { makeAutoObservable } from "mobx";
import axios from "axios";
import { API_URL } from "../http";
import AuthService from "../services/auth.service";
import RequestService from "../services/request.service";
import OffersService from "../services/offers.service";
import RatingService from "../services/rating.service";

export default class Store{

    //
    // Auth Store 
    //
    user = {};
    isAuth = false;
    isLoading = false;
    localErros = [];

    headerAuth = true;

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
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch(e){
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
            this.setErrors([e.response?.data?.message])
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
            this.setErrors([])
        } catch (e) {
            this.setErrors([e.response?.data?.message])
        }
        finally {
            this.setLoading(false)
        }
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

    async changePass(oldpass, newpass){
        try {
            const response = await new AuthService().changePass(oldpass, newpass);
            return response?.data?.success
        } catch (error) {
            
        }
    }

    async changeNumber(phoneNumber){
        try {
            const response = await new AuthService().changeNumber(phoneNumber);
            return response?.data?.success
        } catch (error) {
            
        }
    }

    async clearAvatar(){
        try {
            const response = await new AuthService().clearAvatar();
            return response?.data?.success
        } catch (error) {
            
        }
    }

    async changeAvatar(image){
        try {
            const response = await new AuthService().changeAvatar(image);
            return response?.data?.success
        } catch (e) {
            this.setErrors([e.response?.data?.message])
        }
        finally {
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
            this.setErrors([e.response?.data?.message])
        }
        finally {
            this.setLoading(false)
        }
    }

    async requestsSelf(){
        try {
            if(!this.isAuth) return this.setErrors(["Вы не авторизованы!"])
            const response = await new RequestService().getSelfs();
            if(response.data.success == true) this.setErrors([])
            return response.data
        } catch (e) {
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
            this.setErrors([error.response?.data?.message])
        }
    }

    async getOffer(id){
        try {
            const response = await new OffersService().getOffer(id);
            return response.data
        } catch (error) {            
            this.setErrors([error.response?.data?.message])
        }
    }

    async createOffer(data, file, address){
        try {
            const response = await new OffersService().createOffer(data, file, address);
            return response.data?.success
        } catch (error) {            
            this.setErrors([error.response?.data?.message])
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
            return response.data
        } catch (error) {            
            this.setErrors([error.response?.data?.message])
        } finally {

        }
    }

    async getRatings(){
        try {
            const response = await new RatingService().getAll();
            return response?.data
        } catch (error) {
            this.setErrors([error.response?.data?.message])
        } finally {

        }
    }

    async createRating(message){
        try {
            const response = await new RatingService().create(message);
            return response?.data
        } catch (error) {
            this.setErrors([error.response?.data?.message])
        } finally {

        }
    }

    setErrors(errors){
        this.localErros = errors;
    }
}