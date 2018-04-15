import numpy as np
from tensorflow.contrib import keras
from functools import reduce

class NN:
    """
    A fully connected Neural Network that looks at the 3 enemy and self moves prior to the last round,
    and learns which move to make based on the cross entropy loss between its prediction
    and the move that would have won the last round.

    6*3 neurons in the input layer (one-hot encoding of previous moves)
    No hidden layers
    3 neuron softmax output layer (one-hot encoding of prediction)
    """

    def __init__(self):
        self.model = self._generateModel()
        self.opposing = {"r": "p", "p": "s", "s": "r"}

    def _generateModel(self):
        model = keras.models.Sequential()
        model.add(keras.layers.Dense(units=3, input_shape=[6*3], activation="softmax"))
        optimizer = keras.optimizers.SGD(lr=0.1)
        model.compile(optimizer=optimizer, loss="categorical_crossentropy")
        return model

    def _oneHot(self, move):
        moveToIndex = {"r": 0, "p": 1, "s": 2}
        encoding = np.zeros([3])
        encoding[moveToIndex[move]] = 1
        return encoding

    def _decode(self, index):
        return ["r", "p", "s"][index]

    def _getInputLayer(self, offsets, enemyHistory, selfHistory):
        def generate(layer, offset):
            enemyMove = self._oneHot(enemyHistory[-offset])
            selfMove = self._oneHot(selfHistory[-offset])
            return [*layer, *enemyMove, *selfMove]

        layer = np.array(reduce(generate, offsets, []))
        return layer

    def _train(self, enemyHistory, selfHistory):
        trainingOffsets = np.array([2,3,4])
        x = self._getInputLayer(trainingOffsets, enemyHistory, selfHistory)

        lastEnemyMove = enemyHistory[-1]
        y = self._oneHot(self.opposing[lastEnemyMove])

        self.model.fit(np.array([x]), np.array([y]), epochs=3)

    def _predict(self, enemyHistory, selfHistory):
        predictionOffsets = [1,2,3]
        x = self._getInputLayer(predictionOffsets, enemyHistory, selfHistory)
        y = self.model.predict(np.array([x]))[0]
        return self._decode(np.argmax(y))

    def choose(self, selfHistory, enemyHistory):
        if(len(enemyHistory) < 4):
            if(not len(enemyHistory)):
                self.model = self._generateModel()
            return "r"

        self._train(enemyHistory, selfHistory)
        return self._predict(enemyHistory, selfHistory)


def main():
    nn = NN()
    nn.choose(4*["r"], 4*["s"])

main()
