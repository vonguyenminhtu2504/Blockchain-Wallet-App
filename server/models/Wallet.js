const mongoose = require('mongoose')

const Schema = mongoose.Schema

const PostSchema = new Schema (
    {
        name: {
            type: String,
            required: true
        },
        balance: {
            type: Number
        },
        url: {
            type: String
        },
        status: {
            type: String,
            enum: ['Active', 'Deactive']
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    }
)

module.exports = mongoose.model('posts', PostSchema)