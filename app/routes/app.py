import random
from flask import jsonify
from flask_cors import CORS  # Import CORS
from routes import create_app
from models import WordList
from algorithms import WordleCSP

app = create_app()

# Enable CORS for the entire app
CORS(app)

with app.app_context():
    word_list = WordList().get()

@app.route('/')
def hello():
    return "Hello World!"

@app.route('/wordList', methods=['GET'])
def get_word_list():
    return jsonify(word_list)

@app.route('/randomWord', methods=['GET'])
def get_random_word_list():
    random_word = random.choice(word_list)
    return jsonify({"random_word": random_word})  # Fixed random_word to return the actual value

@app.route('/checkWord/<word>', methods=['GET'])
def check_word_in_list(word):
    if not word:
        return jsonify({"error": "No word provided"}), 400

    is_present = word in word_list
    return jsonify({"word": word, "is_present": is_present})

@app.route('/csp/<initial_word>/<target_word>', methods=['GET'])
def get_csp(initial_word, target_word):
    solver = WordleCSP(initial_word, target_word)
    return solver.solve()

def run_app():
    app.run()
