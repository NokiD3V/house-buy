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

    async changePass(oldpass, newpass){
        return $api.post('/users/settings/changepass', {oldpass, newpass})
    }

    async changeNumber(phoneNumber){
        return $api.post('/users/settings/changenumber', {phoneNumber})
    }

    async clearAvatar(){
        return $api.post('/users/settings/clearavatar')
    }

    async changeAvatar(image){
        let formData = new FormData()
        formData.append("image", image)

        return $api.post('/users/settings/changeavatar', formData)
    }
}