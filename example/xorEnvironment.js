const Environment = require("../index").Environment;

class XorEnvironment extends Environment {
    constructor(numObservations) {
        super(numObservations);
        // this.observacion_space = 2;
        this.observations = new Array(this.numObservations).fill(0);
        this.actions = [0,1];
        this.action_space = this.actions.length;

        this.totreward = 0;
    }

    getActions() {
        return this.actions;
    }

    // getObservations() {
    //     return this.observations;
    // }

    step(action) {
        let done = false;
        let reward = (this.observations[0] ^ this.observations[1] == action)?1:-1;
        this.observations = [Math.round(Math.random()), Math.round(Math.random())];
        let observations = this.observations;
        let info = {};

        this.totreward += reward;
        if(this.totreward >= 10) {
            done = true;
        }

        // return s_, r, done, _
        return { observations, reward, done, info };
    }

    reset() {
        this.observations = new Array(this.numObservations).fill(0);
        this.totreward = 0;

        // return s
        return this.observations;        
    }
}

module.exports = XorEnvironment;