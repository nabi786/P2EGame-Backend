const mongoose = require('mongoose')


const schema = mongoose.Schema({
        Address : {
            type : String
        },
        Wins : {
            type : Number,
        },
        Claims : {
            type : Number
        },
        Date : {
            type: String,
        },
        lost : {
            type : Boolean,
            default : false
        }
})





const p2eGame = mongoose.model('p2eGame', schema)

const modelOBj = {
    p2eGame
}

module.exports = modelOBj;