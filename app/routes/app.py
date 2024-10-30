from routes import create_app
from models import WordList
app = create_app()


@app.route('/')
def hello():
    return "Hello World!"

@app.route('/wordList', methods=['GET'])
def get_word_list():
    return WordList().get()


def run_app():
    app.run()
