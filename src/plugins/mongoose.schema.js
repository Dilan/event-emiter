const mongoose = require('mongoose');
const cache = {};

module.exports.init = function(mediator) {

    return function(schema, options) {

        schema.pre('findOneAndUpdate', async function (next) {
            // cache current document version
            var oldDoc = await this.model.findOne(this._conditions);
            if (oldDoc && oldDoc['id'])
                cache[oldDoc.id] = oldDoc;

            next();
        });
        schema.post('findOneAndUpdate', function (doc) {

            var oldDoc = cache[doc.id];
            if (oldDoc) {
                var diff = this.model.diff(oldDoc, doc);
                if (diff)
                    mediator.emit(this.model.collection.name + '.update', doc, diff);
            }
        });
        // =====================================================================

        schema.pre('save', function(next) {
            next();
        });

        schema.post('save', function(doc) {
            var modelName = this.constructor.modelName;
            var collectionName = mongoose.model(modelName).collection.name;

            mediator.emit(collectionName + '.create', doc);
        });
    }
}
