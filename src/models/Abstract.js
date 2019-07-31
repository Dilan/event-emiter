module.exports = function(Model, newInstance) {

    const create = async data => {
        return await new Promise((resolve, reject) => {
            const instance = newInstance(data);
            instance.save(err => {
                if (err) return reject(err);
                resolve(instance);
            });
        });
    };

    const update = async(id, data) => {
        data['updated_at'] = new Date();
        return await new Promise((resolve, reject) => {
            Model.findByIdAndUpdate(id, { $set: data, $inc: { __v: 1 } }, { new: true }, function(err, doc) {
                if (err) return reject(err);
                resolve(doc);
            });
        });
    };

    const findOne = async(filter) => {
        return await Model.findOne(filter).exec();
    };

    const getList = async(filterBy, orderBy) => {
        if (typeof filterBy == 'undefined') {
            filterBy = {};
        }
        if (typeof orderBy == 'undefined') {
            orderBy = { title: 'asc' };
        }

        return await Model.find(filterBy).sort(orderBy).exec();
    };

    const deleteOne = async(filter) => {
        return await Model.deleteOne(filter).exec();
    };

    const deleteMany = async(filter) => {
        return await Model.deleteMany(filter).exec();
    };

    return {
        create: create,
        update: update,
        findOne: findOne,
        getList: getList,
        deleteOne: deleteOne,
        deleteMany: deleteMany,
    }
};
