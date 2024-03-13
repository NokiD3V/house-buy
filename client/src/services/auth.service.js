import $api from '../http/index'

export default class AuthService{
    async login(email, password){
        return $api.post('/users/login', {email, password})
    }

    async registration (email, password, username, phoneNumber){
        return $api.post('/users/register', {email, password, username, phoneNumber})
    }

    async logout(){
        return $api.post('/users/logout')
    }

    async isAdmin(){
        return $api.post('/users/isadmin')
    }
}