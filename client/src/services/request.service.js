import $api from '../http/index'

export default class RequestService{
    async create(offerID, userID, phoneNumber, rentdays){
        return $api.post('/requests/create', {offerID, userID, phoneNumber, rentdays})
    }
    async getSelfs(){
        return $api.get("/requests/all/self")
    }
    async close(requestID, closedType, closedComment){
        return $api.post('/requests/close', {requestID, closedType, closedComment})
    }
    async getRequests(){
        return $api.get("/requests/all")
    }
}