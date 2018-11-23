class Environment {
    constructor() {
        // this.observacion_space = 2;
        // this.observations = new Array(this.observacion_space).fill(0);
        // this.actions = [0,1];
        // this.action_space = this.actions.length;
        // this.totreward = 0;
    }

    getActions() {
        // return this.actions;
        throw new Error("Implement the return of the actions. Ej: return this.actions;");
    }

    getObservations() {
        // return this.observations;
        throw new Error("Implement the return of the observations. Ej. return this.observations;");
    }

    // translateAction(action, actions) {
    //     return actions[action];
    // }

    step(action) {
        // let done = false;
        // let reward = (this.observations[0] ^ this.observations[1] == action)?1:-1;
        // this.observations = [Math.round(Math.random()), Math.round(Math.random())];
        // let observations = this.observations;
        // let info = {};

        // this.totreward += reward;
        // if(this.totreward >= 10) {
        //     done = true;
        // }

        // // return s_, r, done, _
        // return { observations, reward, done, info };
        let msg = "Implement the return of the object { observations, reward, done, info }.\n"
        msg += "observations: new set of observations after the action take it\n"
        msg += "reward: the reward to the action take it\n"
        msg += "done: true if the actions where success or false"
        msg += "info: any info that you want return to the runner";
        throw new Error(msg);
    }

    reset() {
        // this.observations = new Array(this.observacion_space).fill(0);
        // let observations = this.observations;
        // this.totreward = 0;

        // // return s
        // return observations;
        let msg = "Implement the reset to the environment. Ej. set to 0 the total reward, reset observations.\n";
        msg += "Must return the reseted observations";
        throw new Error(msg)
    }
}

module.exports = Environment;