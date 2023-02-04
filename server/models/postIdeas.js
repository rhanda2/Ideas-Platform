import mongoose from 'mongoose';

const ideaSchema  = {
    title: String,
    description: String,
    authorName: String,
    email: String,
    bio: String,
    otherInterest: String,
    likes: { type: [String], default: [] },
    comments: { type: [String], default: [] },
    createdAt: {
        type: Date,
        default: new Date(),
    },
}

var ideaMessage = mongoose.model('PostMessage', ideaSchema);

export default ideaMessage;