import $api from '../http/index'

export default class OffersService{
    async getAll(){
        return $api.get('/offers/all')
    }

    async getOffer(id){
        console.log(id)
        return $api.get('/offers/get/' + id)
    }
}