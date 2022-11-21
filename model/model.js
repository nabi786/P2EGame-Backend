const mongoose = require('mongoose')


const schema = mongoose.Schema({
        Address : {
            type : String
        },
        Wins : {
            type : Number,
        },
        Date : {
            type: String,
        }
})





const p2eGame = mongoose.model('p2eGame', schema)

const modelOBj = {
    p2eGame
}

module.exports = modelOBj;