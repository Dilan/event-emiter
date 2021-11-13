const nanoid = require('nanoid');
const mongoose = require('mongoose');
const AbstractModel = require('./Abstract');
mongoose.Promise = Promise;

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    department: {
        type: String
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    updated_at: {
        type: Date,
        required: true,
        default: Date.now
    }
});

userSchema.virtual('id').get(function() {
    return this._id;
});
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', {
    transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

userSchema.static('diff', function(oldDoc, newDoc) {
    var o = oldDoc.toObject();
    var n = newDoc.toObject();

    // exclude some properties
    delete o.__v;
    delete n.__v;
    delete o.updated_at;
    delete n.updated_at;

    return require('deep-diff').diff(o, n);
});

const user = mongoose.model('user', userSchema);
const newInstanceFunc = function(data) {
    return new user(data);
};
const Model = AbstractModel(user, newInstanceFunc);

exports = module.exports = {

    create: Model.create,
    update: Model.update,
    getList: Model.getList,
    findOne: Model.findOne,
    deleteOne: Model.deleteOne,
    deleteMany: Model.deleteMany
};
