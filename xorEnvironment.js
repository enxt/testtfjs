class XorEnvironment {
    constructor() {
        // this.observations = [Math.round(Math.random()), Math.round(Math.random())];
        this.observacion_space = 2;
        this.observations = new Array(this.observacion_space).fill(0);
        this.actions = [0,1];
        this.action_space = this.actions.length;

        this.totreward = 0;
    }

    getActions() {
        return this.actions;
    }

    getObservations() {
        return this.observations;
    }

    translateAction(action, actions) {
        return actions[action];
    }

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
        this.observations = new Array(this.observacion_space).fill(0);
        let observations = this.observations;
        this.totreward = 0;

        // return s
        return observations;        
    }
}

module.exports = { XorEnvironment: XorEnvironment }