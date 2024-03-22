import $api from '../http/index'

export default class RatingService{
    async getAll(){
        return $api.get('/ratings/all')
    }
    async create(message){
        return $api.post('/ratings/create', {message})
    }
}