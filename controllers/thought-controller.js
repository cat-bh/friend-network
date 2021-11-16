const { User, Thought } = require('../models');

const thoughtController = {
    // Get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
            .select('-__v')
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    // Get one thought by its ID
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
            .select('-__v')
            .then(dbThought => {
                if (!dbThought) {
                    res.status(404).json({message: 'No thought found with this id'});
                    return;
                }
                res.json(dbThought);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    // Create a new thought
    createThought({ params, body }, res) {
        Thought.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: params.id },
                    { $push: { thoughts: _id }},
                    { new: true }
                );
            })
            .then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).json({message: 'No user found with this id'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err)); 
    },
    // Update a thought
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.id },
            body,
            {new: true}
        )
            .then(dbResponse => {
                if(!dbResponse) {
                    res.status(404).json({message: 'No thought found with this id'});
                    return;
                }
                res.json(dbResponse);
            })
            .catch(err => res.status(400).json(err));
    },
    // Delete a thought
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then(dbThoughtData => {
                if(!dbThoughtData) {
                    res.status(404).json({message: "No thought found with this id"});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.status(400).json(err));
    }
};

module.exports = thoughtController;