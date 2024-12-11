import random
from flask import jsonify, request
from flask_cors import CORS  # Import CORS
from routes import create_app
from models import WordList
from algorithms import WordleCSP
from algorithms import WordleCSPNextBest
from models.feedback import feedback, allowed_list
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

@app.route('/allowedWords', methods=['POST'])
def get_allowed_words():
    data = request.json
    if not data or 'guesses' not in data or len(data['guesses']) == 0:
        return jsonify({"allowed_words": word_list})

    if 'feedbacks' not in data or not isinstance(data['guesses'], list) or not isinstance(data['feedbacks'], list) or len(data['guesses']) != len(data['feedbacks']):
        return jsonify({"error": "No feedbacks provided for words."}), 400
    
    return jsonify({"allowed_words": allowed_list(word_list, data['guesses'], data['feedbacks'])})

@app.route('/randomWord', methods=['GET'])
def get_random_word_list():
    random_word = random.choice(word_list)
    return jsonify({"random_word": random_word})  # Fixed random_word to return the actual value

@app.route('/checkWord/<word>', methods=['GET'])
def check_word_in_list(word):
    if not word:
        return jsonify({"error": "No word provided"}), 400

    is_present = word.lower() in word_list
    return jsonify({"word": word, "is_present": is_present})

@app.route('/csp/<initial_word>/<target_word>', methods=['GET'])
def get_csp(initial_word, target_word):
    solver = WordleCSP(initial_word, target_word)
    return solver.solve()

@app.route('/csp/bestGuess', methods=['POST'])
def get_best_guess_endpoint():
    data = request.json
    if not data or 'words' not in data or 'target_word' not in data:
        return jsonify({"error": "Missing 'words' or 'target_word' parameter"}), 400

    words = data['words']
    target_word = data['target_word']

    if not isinstance(words, str):
        return jsonify({"error": "'words' must be a comma-separated string"}), 400
    if not isinstance(target_word, str) or not target_word.strip():
        return jsonify({"error": "'target_word' must be a non-empty string"}), 400

    word_lists = [word.strip() for word in words.split(',') if word.strip()]
    if not word_lists:
        word_lists = []

    print(word_lists)
    feedbacks = [get_feedback(guess, target_word) for guess in word_lists]
    best_guess = WordleCSPNextBest(target_word).suggest_next_word(word_lists, feedbacks)
    return jsonify({"best_guess": best_guess})

@app.route('/getFeedback', methods=['POST'])
def get_feedback_endpoint():
    data = request.json
    if not data or 'guess' not in data or 'answer' not in data:
        return jsonify({"error": "Missing 'guess' or 'answer' parameter"}), 400
    
    guess = data['guess']
    answer = data['answer']
    
    if not isinstance(guess, str) or not guess.strip():
        return jsonify({"error": "'guess' must be a non-empty string"}), 400
    if not isinstance(answer, str) or not answer.strip():
        return jsonify({"error": "'answer' must be a non-empty string"}), 400

    return jsonify({"feedback": feedback(guess, answer)})


def get_feedback(guess, target):
    feedback = []
    for i, letter in enumerate(guess):
        if letter == target[i]:
            feedback.append('green')
        elif letter in target:
            feedback.append('yellow')
        else:
            feedback.append('gray')
    return feedback

def run_app():
    app.run()
