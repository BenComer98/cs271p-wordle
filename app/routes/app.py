from routes import create_app
from models import WordList
from algorithms import WordleCSP
app = create_app()

@app.route('/')
def hello():
    return "Hello World!"

@app.route('/wordList', methods=['GET'])
def get_word_list():
    return WordList().get()


@app.route('/csp/<initial_word>/<target_word>', methods=['GET'])
def get_csp(initial_word, target_word):
    solver = WordleCSP(initial_word,target_word)
    return solver.solve()


def run_app():
    app.run()
