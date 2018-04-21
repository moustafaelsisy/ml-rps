import numpy as np

class Probability:

    def __init__(self):
        self.enemyCounts = self._initCounts()

    def _initCounts(self):
        return [0,0,0]

    def _getIndexFromMove(self, move):
        return {"r": 0, "p": 1, "s": 2}[move]

    def _getMoveFromIndex(self, index):
        return ["r", "p", "s"][index]

    def choose(self, selfHistory, enemyHistory):
        if(not len(enemyHistory)):
            self.enemyCounts = self._initCounts()
            return "r"

        lastEnemyMove = enemyHistory[-1]
        self.enemyCounts[self._getIndexFromMove(lastEnemyMove)] += 1
        argmax = np.argmax(self.enemyCounts)
        expectedEnemyMove = self._getMoveFromIndex(argmax)
        opposing = {"r": "p", "p": "s", "s": "r"}
        return opposing[expectedEnemyMove]
