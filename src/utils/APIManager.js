import superagent from "superagent"

export default {

    get: (url, params, callback) => {
        superagent
        .get(url)
        .query(params)
        .set("Accept", "application/json")
        .end((err, response) => {
            if(err){                
                callback(err, null)
                return
            }
            callback(null, response.body)
        })
    },

    post: (url, body, callback) => {
        superagent
        .post(url)
        .send(body)
        .set("Accept", "application/json")
        .end((err, response) => {
            if(err){                
                callback(err, null)
                return
            }
            callback(null, response.body)
        })
    },

    put: () => {

    },

    delete: () => {

    }
}