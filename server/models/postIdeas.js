import mongoose from 'mongoose';

const ideaSchema  = {
    title: String,
    description: String,
}

var ideaMessage = mongoose.model('PostMessage', ideaSchema);

export default ideaMessage;