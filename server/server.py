from flask import Flask, request, jsonify
from flask_cors import CORS
from server.nn import NN

app = Flask(__name__)
app.config.from_object(__name__) # load config from this file
CORS(app)

app.config.update(dict(
    SECRET_KEY='pick_your_favourite!',
))

@app.route("/choose", methods=["POST"])
def handleChoose():
    data = request.get_json(force=True)
    nn = NN()
    result = {"choice": nn.choose(data["selfHistory"], data["enemyHistory"])}
    response = jsonify(result)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response