const tf = require("@tensorflow/tfjs");
require('@tensorflow/tfjs-node')
const Utils = require("./utils");

let agent;
let env;
let actions;
let u = new Utils();


function translateAction(action) {
    return actions[action];
}

class Trainer {
    constructor(_agent, _environment) {
        agent = _agent;
        env = _environment;
        actions = env.getActions();
    }

    async train(num_ep = 50) {
        let data;
    
        for (var i_ep = 0; i_ep < num_ep; i_ep++) {
            // env.reset();
            // data = env.getObservations();
            data = env.reset();
            var state = [u.arrayClone(data)];
            let action, res, info;
            var next_state;
            let next_action;
            let done = false;
            var reward = 0;
            var score = 0;
            
            while (!done) {
                action = await agent.get_action(state)
                res = env.step(translateAction(action));
                data = res.observations;
                reward = res.reward;
                done = res.done;
    
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

    async test(agent, testdata) {
        agent.loadModel().then( () => {
            testdata.forEach(element => {
                console.log("For element:", element);
                agent.predict(element);
            });
        });
        
    }
}

module.exports = Trainer;