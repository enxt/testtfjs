const Environment = require("./xorEnvironment").XorEnvironment;
const Agent = require("./agent").Agent;
const tf = require("@tensorflow/tfjs");
require('@tensorflow/tfjs-node')
const Utils = require("./utils").Utils;

var env = new Environment();
var agent = new Agent(env);
var u = new Utils();



async function train(agent, env) {
    // var env = new Environment(width, height, num_enemies, locs)
    var data = env.getObservations();
    var num_ep = 50;

    for (var i_ep = 0; i_ep < num_ep; i_ep++) {
        env.reset();
        data = env.getObservations();
        var state = [u.arrayClone(data)];
        let action, res, info;
        var next_state;
        let done = false;
        var reward = 0;
        var score = 0;
        
        while (!done) {
            action = await agent.get_action(state)
            res = env.step(env.translateAction(action, env.getActions()));
            data = res.observations; // res["state"]
            reward = res.reward; // res["reward"]
            done = res.done; // res["done"]

            next_state = [u.arrayClone(data)];
            next_action = await agent.get_action(next_state)

            await agent.train_model(state, action, reward, next_state, next_action, done)

            state = [u.arrayClone(data)]
            score += reward

            await tf.nextFrame();
        }

        console.log((i_ep+1) + "th episode ended. score: " + score.toFixed(3));
    }

    await agent.storemodel();
}

async function test(agent) {
    agent.loadModel().then( () => {
        agent.predict([0,0]);
        agent.predict([1,0]);
        agent.predict([0,1]);
        agent.predict([1,1]);
    });
    
}

if(process.argv[2] == "train") {
    train(agent, env);
} else if(process.argv[2] == "test") {
    test(agent);
}