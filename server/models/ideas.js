import mongoose from 'mongoose';

const ideaSchema  = {
    ipfsHash: String,
    address: String,
    likes: { type: [String], default: [] },
    comments: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    createdAt: {
        type: Date,
        default: new Date(),
    },
}

var ideaMessage = mongoose.model('PostMessage', ideaSchema);

export default ideaMessage;