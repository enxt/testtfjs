const Environment = require("./xorEnvironment");
const Agent = require("./agent");
const Trainer = require('./trainer');

var env = new Environment();
var agent = new Agent(env);

var trainer = new Trainer(agent, env);

if(process.argv[2] == "train") {
    trainer.train(10);
} else if(process.argv[2] == "test") {
    trainer.test(agent, [[0,0], [0,1], [1,0], [1,1]]);
}
