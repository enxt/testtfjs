class Environment {
    constructor(numObservations) {
        this.numObservations = numObservations;
        console.log("Environment parent");
    }

    getActions() {
        throw new Error("Implement the return of the actions. Ej: return this.actions;");
    }

    // getObservations() {
    //     throw new Error("Implement the return of the observations. Ej. return this.observations;");
    // }

    step(action) {
        let msg = "Implement the return of the object { observations, reward, done, info }.\n"
        msg += "observations: new set of observations after the action take it\n"
        msg += "reward: the reward to the action take it\n"
        msg += "done: true if the actions where success or false"
        msg += "info: any info that you want return to the runner";
        throw new Error(msg);
    }

    reset() {
        let msg = "Implement the reset to the environment. Ej. set to 0 the total reward, reset observations.\n";
        msg += "Must return the reseted observations";
        throw new Error(msg)
    }
}

module.exports = Environment;