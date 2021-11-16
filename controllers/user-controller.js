const { User, Thought } = require('../models');

const userController = {
    // get all users
    getAllUsers(req, res) {
        User.find({})
            .populate({
                path: 'thoughts',
                model: 'Thought',
                select: '-__v'
            })
            .select('-__v')
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    // get one user by their id
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({
                path: 'thoughts',
                model: 'Thought',
                select: '-__v'
            })
            .select('-__v')
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({message: 'No user found with this id'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    //Create a new user
    createUser(req, res) {
        User.create(req.body)
            .then(dbResponse => res.json(dbResponse))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    // Update a user
    updateUser({params, body}, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbResponse => {
                if(!dbResponse) {
                    res.status(404).json({message: 'No user found with this id'});
                    return;
                }
                res.json(dbResponse);
            })
            .catch(err => res.status(400).json(err));
    },
    //Delete a user
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(dbResponse => {
                if(!dbResponse) {
                    res.status(404).json({message: 'No user found with this id'});
                    return;
                }
                res.json(dbResponse);
            })
            .catch(err => res.status(400).json(err));
    }
};

module.exports = userController;