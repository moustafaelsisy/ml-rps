from nn import NN
from beatPrevious import BeatPrevious
from rotate import Rotate
from probability import Probability
from conditional import Conditional

def getResult(selfMove, enemyMove):
    """
    Returns the result's code (0 for win, 1 for loss, 2 for draw)

    :param selfMove:
    :param enemyMove:
    :return: The result's code
    """
    opposing = {"r": "p", "p":"s", "s":"r"}
    if(selfMove == opposing[enemyMove]): #win
        return 0
    elif(enemyMove == opposing[selfMove]): #loss
        return 1
    else: #draw
        return 2

def getScore(result):
    if(sum(result) == 0): #no rounds were played
        return "-"

    return "{:.3f}".format((result[0] + result[2]/2) / (sum(result)))

def playTournament(players, numOfGames=10):
    results = [[3*[0] for _ in range(len(players))] for _ in range(len(players))]
    totals = [3*[0] for _ in range(len(players))]

    for i in range(len(players)):
        for j in range(len(players)):
            if(i == j):
                continue

            result = 3*[0]
            iHistory = []
            jHistory = []

            for _ in range(numOfGames):
                iChoice = players[i].choose(iHistory, jHistory)
                jChoice = players[j].choose(jHistory, iHistory)
                iHistory.append(iChoice)
                jHistory.append(jChoice)
                result[getResult(iChoice, jChoice)] += 1

            results[i][j] = result
            for resultIndex in range(3):
                totals[i][resultIndex] += result[resultIndex]

    resultScores = [[getScore(result) for result in row] for row in results]
    totalScores = [getScore(total) for total in totals]

    print(resultScores)
    print("Totals:")
    print(totalScores)

def main():
    playTournament(numOfGames=200, players=[NN(), Rotate(), BeatPrevious(), Probability(), Conditional()])

main()