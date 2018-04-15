//Original Work Copyright Dr. Dave Churchill
RPS_Rock = function() {
    var self = {};
    self.name = "Rock";
    self.choose = function(selfHistory, enemyHistory) { return 'r'; }
    return self;
}

RPS_Paper = function() {
    var self = {};
    self.name = "Paper";
    self.choose = function(selfHistory, enemyHistory) { return 'p'; }
    return self;
}

RPS_Scissors = function() {
    var self = {};
    self.name = "Scissors";
    self.choose = function(selfHistory, enemyHistory) { return 's'; }
    return self;
}

RPS_Random = function() {
    var self = {};
    self.name = "Random";
    self.choose = function(selfHistory, enemyHistory) { 
        var choices = ['r', 'p', 's'];
        return choices[Math.floor(Math.random()*3)]; 
    }
    return self;
}

RPS_Rotate = function() {
    var self = {};
    self.name = "Rotate";
    self.choose = function(selfHistory, enemyHistory) { 
        if (selfHistory.length == 0) { return 'r'; }
        var last = selfHistory[selfHistory.length - 1];
        if (last == 'r') { return 's'; }
        else if (last == 's') { return 'p'; }
        else { return 'r'; }
    }
    return self;
}

RPS_BeatPrevious = function() {
    var self = {};
    self.name = "BeatPrevious";
    self.choose = function(selfHistory, enemyHistory) { 
        if (enemyHistory.length == 0) {
            return 'r'; 
        } else {
            var last = enemyHistory[enemyHistory.length - 1];
            if (last == 'r') { return 'p'; }
            else if (last == 's') { return 'r'; }
            else { return 's'; }
        }
    }
    return self;
}

//Modified Work Copyright 2018 Moustafa Elsisy
getArgmax = function(obj){
    keys = Object.keys(obj)
    return keys.reduce(function(maxKey, currentkey){
        return obj[currentkey] > obj[maxKey] ? currentkey : maxKey
    }, keys[0])
}

RPS_Probability = function() {
    var self = {};
    self.name = "P(A)";
    self.enemyCounts = {"r": 0, "p":0, "s":0}
    self.opposing = {"r": "p", "p":"s", "s":"r"}
    self.proba = function(selfHistory, enemyHistory){
        if(!enemyHistory.length) {
            self.enemyCounts = {"r": 0, "p":0, "s":0} //reset counts
            return "r"
        }
        var last = enemyHistory[enemyHistory.length - 1]
        self.enemyCounts[last] += 1
        var argmax = Object.keys(self.enemyCounts).reduce(function(maxKey, currentkey){
            return self.enemyCounts[currentkey] > self.enemyCounts[maxKey] ? currentkey : maxKey
        }, "r")
        return self.opposing[argmax]
    }
    self.choose = function(selfHistory, enemyHistory) {
        return self.proba(selfHistory, enemyHistory)
    }
    return self;
}

RPS_Conditional = function() {
    var self = {};
    self.name = "P(A|B)";
    self.getInitialProbabilities = function(){
        return {
            "r": {"r": 0, "p": 0, "s":0},
            "p": {"r": 0, "p": 0, "s":0},
            "s": {"r": 0, "p": 0, "s":0}
        }
    }
    self.probabilitiesBySelfMove = self.getInitialProbabilities()
    self.opposing = {"r": "p", "p":"s", "s":"r"}
    self.choose = function(selfHistory, enemyHistory) {
        if(enemyHistory.length < 2){
            self.probabilitiesBySelfMove = self.getInitialProbabilities()
            return "r"
        }
        lastEnemy = enemyHistory[enemyHistory.length - 1]
        lastSelf = selfHistory[selfHistory.length - 1]
        self.probabilitiesBySelfMove[selfHistory[selfHistory.length - 2]][lastEnemy] += 1
        optimizationSpace = self.probabilitiesBySelfMove[lastSelf]
        return self.opposing[getArgmax(optimizationSpace)]
    }
    return self;
}

RPS_Learner = function() {
    var self = {};
    self.name = "Learner";
    self.getInitialProbabilities = function(){
        return {
            "r": {"r": 0.5, "p": 0.5, "s":0.5},
            "p": {"r": 0.5, "p": 0.5, "s":0.5},
            "s": {"r": 0.5, "p": 0.5, "s":0.5}
        }
    }
    self.probabilitiesByEnemyMove = self.getInitialProbabilities()
    self.opposing = {"r": "p", "p":"s", "s":"r"}
    self.choose = function(selfHistory, enemyHistory) {
        if(enemyHistory.length < 2){
            self.probabilitiesByEnemyMove = self.getInitialProbabilities()
            return "r"
        }
        lastEnemy = enemyHistory[enemyHistory.length - 1]
        lastSelf = selfHistory[selfHistory.length - 1]
        self.probabilitiesByEnemyMove[enemyHistory[enemyHistory.length - 2]][lastSelf] += lastSelf === self.opposing[lastEnemy] ? 0.001 : -0.001
        optimizationSpace = self.probabilitiesByEnemyMove[lastEnemy]
        return getArgmax(optimizationSpace)
    }
    return self;
}

RPS_Learner2 = function() {
    var self = {};
    self.name = "Learner2";
    self.getInitialProbabilities = function(){
        return {
            "r": {
                "r": {"r": 0.5, "p": 0.5, "s":0.5},
                "p": {"r": 0.5, "p": 0.5, "s":0.5},
                "s": {"r": 0.5, "p": 0.5, "s":0.5}
            },
            "p": {
                "r": {"r": 0.5, "p": 0.5, "s":0.5},
                "p": {"r": 0.5, "p": 0.5, "s":0.5},
                "s": {"r": 0.5, "p": 0.5, "s":0.5}
            },
            "s": {
                "r": {"r": 0.5, "p": 0.5, "s":0.5},
                "p": {"r": 0.5, "p": 0.5, "s":0.5},
                "s": {"r": 0.5, "p": 0.5, "s":0.5}
            }
        }
    }
    self.probabilitiesByEnemyMove = self.getInitialProbabilities()
    self.opposing = {"r": "p", "p":"s", "s":"r"}
    self.choose = function(selfHistory, enemyHistory) {
        if(enemyHistory.length < 3){
            self.probabilitiesByEnemyMove = self.getInitialProbabilities()
            return "r"
        }
        numGames = enemyHistory.length
        lastEnemy = enemyHistory[numGames - 1]
        lastSelf = selfHistory[numGames - 1]
        self.probabilitiesByEnemyMove[selfHistory[numGames - 3]][enemyHistory[numGames - 2]][lastSelf] += lastSelf === self.opposing[lastEnemy] ? 0.001 : -0.001
        optimizationSpace = self.probabilitiesByEnemyMove[selfHistory[numGames - 2]][lastEnemy]
        return getArgmax(optimizationSpace)
    }
    return self;
}

RPS_NN = function(){
    var self = {};
    self.name = "NN";
    self.choose = async function(selfHistory, enemyHistory) {
        const body = {
            selfHistory,
            enemyHistory
        }
        const res = await fetch("http://localhost:5000/choose", {
            body: JSON.stringify(body),
            headers: {"content-type": "application/json", "accept": "application/json"},
            method: "POST",
            mode: "cors"
        })
        return (await res.json())["choice"]
    }
    return self;
}
