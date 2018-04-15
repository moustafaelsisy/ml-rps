//Parked
//Please refer to `server/nn.py`

RPS_NN = function(){
    var self = {};
    self.name = "NN";
    self.opposing = {"r": "p", "p":"s", "s":"r"}
    self.generateModel = function(){
        const model = tf.sequential()
        model.add(tf.layers.dense({units: 3, inputShape: [6*3], activation: "softmax"})) //6 moves, each one-hot encoded for Rock,Paper and Scissors
        const optimizer = tf.train.sgd(0.1)
        model.compile({optimizer, loss: "categoricalCrossentropy"})
        return model
    }
    self.oneHot = function(move){
        const encoding = [0,0,0]
        const moveToIndex = {"r": 0, "p": 1, "s": 2}
        encoding[moveToIndex[move]] = 1
        return encoding
    }
    self.getInputLayer = function(offsets, enemyHistory, selfHistory){
        //input layer based on one hot encoding of the moves specified by the `offsets` array
        const x = offsets.reduce((inputLayer, offset) => {
            const length = enemyHistory.length
            const enemyMove = self.oneHot(enemyHistory[length - offset])
            const selfMove = self.oneHot(selfHistory[length - offset])
            return [...inputLayer, ...enemyMove, ...selfMove]
        }, [])

        return x
    }
    self.model = null
    self.xTrain = []
    self.yTrain = []
    self.choose = async function(selfHistory, enemyHistory) {
        if(enemyHistory.length < 4){
            if(!enemyHistory.length){
                self.model = self.generateModel()
                self.xTrain = []
                self.yTrain = []
            }
            return "r"
        }
        const trainingOffsets = [2,3,4]
        const x = self.getInputLayer(trainingOffsets, enemyHistory, selfHistory)
        self.xTrain.push(x)

        const lastEnemyMove = enemyHistory[enemyHistory.length - 1]
        const y = self.oneHot(self.opposing[lastEnemyMove])
        self.yTrain.push(y)

        if(self.xTrain.length < 2){
            return "r"
        }

        const xTrain = tf.tensor2d(self.xTrain)
        const yTrain = tf.tensor2d(self.yTrain)
        await self.model.fit(xTrain, yTrain)

        const predictionOffsets = [1,2,3]
        const xPredict = self.getInputLayer(predictionOffsets, enemyHistory, selfHistory)
        const prediction = self.model.predict(tf.tensor2d([xPredict])).dataSync()
        const movesProba = {"r": prediction[0], "p": prediction[1], "s": prediction[2]}
        return getArgmax(movesProba)
    }
    return self;
}