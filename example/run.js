const t = require("../index"), // require("testtfjs")
      Environment = require("./xorEnvironment");

const numObservations = 2;
var env = new Environment(numObservations);
var agent = new t.Agent(env);
var trainer = new t.Trainer(agent, env);

if(process.argv[2] == "train") {
    trainer.train(10);
} else if(process.argv[2] == "test") {
    trainer.test(agent, [[0,0], [0,1], [1,0], [1,1]]);
}