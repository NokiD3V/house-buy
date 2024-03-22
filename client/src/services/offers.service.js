import $api from '../http/index'

export default class OffersService{
    async getAll(){
        return $api.get('/offers/all')
    }

    async getOffer(id){
        return $api.get('/offers/get/' + id)
    }

    async createOffer(data, file){
        const {location, phone, price, type, long_desc, short_desc } = data;
        let JSON_DATA = {location, phone, price, type, long_desc, short_desc}
        
        let formData = new FormData()
        formData.append("image", file)
        formData.append("json", new Blob([JSON.stringify(JSON_DATA)], { type: "application/json" }))

        return $api.post('/offers/create', formData)
    }
}