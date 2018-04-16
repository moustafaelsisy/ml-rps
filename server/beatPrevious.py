class BeatPrevious:

    def choose(self, selfHistory, enemyHistory):
        if(not len(enemyHistory)):
            return "p"

        last = enemyHistory[-1]
        opposing = {"r": "p","p": "s","s": "r"}
        return opposing[last]