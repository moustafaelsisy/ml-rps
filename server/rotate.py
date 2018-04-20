class Rotate:

    def __init__(self):
        self.index = 0

    def choose(self, selfHistory, enemyHistory):
        if(not len(enemyHistory)):
            self.index = 0

        move = ["r", "s", "p"][self.index]
        self.index = (self.index + 1) % 3 #rotate through indices
        return move