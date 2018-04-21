import numpy as np

class Conditional:
    """
    Acts based on the probability that the enemy will make a specific move given the self move
    preceding it
    """

    def __init__(self):
        self.probabilitiesGivenSelfMove = self._initCounts()

    def _initCounts(self):
        return {
            "r": [0,0,0],
            "p": [0,0,0],
            "s": [0,0,0]
        }

    def _getIndexFromMove(self, move):
        return {"r": 0, "p": 1, "s": 2}[move]

    def _getMoveFromIndex(self, index):
        return ["r", "p", "s"][index]

    def choose(self, selfHistory, enemyHistory):
        if(len(enemyHistory) < 2):
            self.probabilitiesGivenSelfMove = self._initCounts()
            return "r"

        lastEnemyMove = enemyHistory[-1]
        beforeLastSelfMove = selfHistory[-2]
        self.probabilitiesGivenSelfMove[beforeLastSelfMove][self._getIndexFromMove(lastEnemyMove)] += 1

        lastSelfMove = selfHistory[-1]
        optimizationSpace = self.probabilitiesGivenSelfMove[lastSelfMove]
        argmax = np.argmax(optimizationSpace)
        expectedEnemyMove = self._getMoveFromIndex(argmax)

        opposing = {"r": "p", "p": "s", "s": "r"}
        return opposing[expectedEnemyMove]
