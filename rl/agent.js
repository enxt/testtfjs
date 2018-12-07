const tf = require("@tensorflow/tfjs");
require('@tensorflow/tfjs-node')

function makeInput(data, numobservations) {
    var input = tf.tensor2d(data, [1, numobservations]);
    return input;
}

function make_model(lr, numobservations, numactions) {
    const model = tf.sequential();

    model.add(tf.layers.dense({
        inputShape: [numobservations],
        units: 128,
        activation: 'relu',
        kernelInitializer: 'varianceScaling'
    }));
    model.add(tf.layers.dense({
        units: 128,
        activation: 'relu',
        kernelInitializer: 'varianceScaling'
    }));
    model.add(tf.layers.dense({
        units: 128,
        activation: 'relu',
        kernelInitializer: 'varianceScaling'
    }));
    model.add(tf.layers.dense({
        units: numactions,
        kernelInitializer: 'VarianceScaling',
        activation: 'linear'
    }))
    model.compile({ loss: 'meanSquaredError', optimizer: tf.train.adam(lr) });
    return model
}

let options = {
    discount_factor: 0.9,
    learning_rate: 0.001,
    epsilon_decay: 0.9998,
    epsilon_min: 0.01,
    epsilon: 1.0,

    modelFolder: 'mymodel',
    modelName: 'model'
};


class Agent {
    constructor(env, opts) {
        this.env = env;
        if(typeof opts != "undefined") {
            for(var opt of Object.keys(opts)) {
                if(options.hasOwnProperty(opt)) {
                    options[opt] = opts[opt];
                }
            }
        }
        // this.observations = env.getObservations();
        // this.numObservations = this.observations.length;
        this.actions = env.getActions();
        this.numActions = this.actions.length;
        this.model = make_model(options.learning_rate, env.numObservations, this.numActions);
        this.num_frame = 0
    }

    async get_action(state) {
        if (Math.random() <= options.epsilon) {
            return this.get_random_action(0, this.numActions - 1)
        }
        else {
            var input_data = makeInput(state, this.env.numObservations);
            var result = this.model.predict(input_data);

            var action = (await result.argMax(1).data())[0]

            input_data.dispose()
            result.dispose()
            return action
        }
    }

    async train_model(state, action, reward, next_state, next_action, done) {
        if (options.epsilon > options.epsilon_min) {
            options.epsilon *= options.epsilon_decay
        }

        state = makeInput(state, this.env.numObservations);
        next_state = makeInput(next_state, this.env.numObservations);

        var target = this.model.predict(state)
        var target_val = this.model.predict(next_state)

        var q_res = await target.data()
        var target_reward = (await target_val.data())
        target_reward = target_reward[next_action]
        if (done) {
            q_res[action] = reward
        }
        else {
            q_res[action] = reward + options.discount_factor * target_reward
        }

        // Q value update
        var res = Array.from(q_res);
        var q = tf.tensor2d(res, [1, this.numActions]);

        const h = await this.model.fit(state, q, { epoch: 1, verbose: 0 })

        this.num_frame += 1
        if (this.num_frame % 100 == 0) {
            console.log("loss: " + h.history.loss[0]);
        }
        state.dispose()
        next_state.dispose()
        target.dispose()
        target_val.dispose()
        q.dispose()

    }
    get_random_action(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    async storemodel() {
        return await this.model.save('file://./' + options.modelFolder);
    }

    async loadModel(required = false) {
        try {
            this.model = await tf.loadModel("file://./" + options.modelFolder + "/model.json");
        } catch(error) {
            if(!required) {
                console.log(error);
            } else {
                throw new Error(error);
            }
        }
    }

    async predict(state) {
        var input_data = makeInput(state, this.env.numObservations);
        var result = this.model.predict(input_data);
        console.log("result:", result.dataSync());

        var action = (await result.argMax(1).data())[0];
        input_data.dispose();
        result.dispose();
        console.log("action:", action);
        return action;
    }
}

module.exports = Agent;