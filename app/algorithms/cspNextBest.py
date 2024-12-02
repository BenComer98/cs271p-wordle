from models import WordList
from collections import Counter

def update_constraints(guess, feedback, constraints, global_include, global_exclude):
    for i, (letter, fb) in enumerate(zip(guess, feedback)):
        if fb == "green":
            constraints[i]["include"].add(letter)
            global_include.add(letter)
        elif fb == "yellow":
            constraints[i]["exclude"].add(letter)
            global_include.add(letter)
        elif fb == "gray":
            # If the letter is not in any green or yellow positions, exclude it globally
            if letter not in global_include:
                global_exclude.add(letter)
            constraints[i]["exclude"].add(letter)
    return constraints, global_include, global_exclude


class WordleCSPNextBest:
    def __init__(self, target_word):
        self.target_word = target_word
        self.possible_words = WordList().get()

    def feedback(self, guess):
        result = []
        for i, letter in enumerate(guess):
            if letter == self.target_word[i]:
                result.append("green")
            elif letter in self.target_word:
                result.append("yellow")
            else:
                result.append("gray")
        return result

    def apply_constraints(self, constraints, global_include, global_exclude):
        new_possible_words = []
        for word in self.possible_words:
            valid = True
            for i, char in enumerate(word):
                if char in global_exclude:
                    valid = False
                    break
                if char in constraints[i]["exclude"]:
                    valid = False
                    break
                if constraints[i]["include"] and char not in constraints[i]["include"]:
                    valid = False
                    break
            if valid and all(char in word for char in global_include):
                new_possible_words.append(word)
        self.possible_words = new_possible_words

    def choose_optimal_guess(self):
        position_counts = [Counter() for _ in range(5)]
        for word in self.possible_words:
            for i, char in enumerate(word):
                position_counts[i][char] += 1
        word_scores = []
        for word in self.possible_words:
            score = sum(position_counts[i][char] for i, char in enumerate(word))
            unique_chars = len(set(word))
            word_scores.append((score + unique_chars * 0.1, word))  # Encourage words with unique letters
        word_scores.sort(reverse=True)
        best_score, best_word = word_scores[0]
        return best_word

    def suggest_next_word(self, guesses, feedbacks):
        self.possible_words = WordList().get()

        constraints = [{"include": set(), "exclude": set()} for _ in range(5)]
        global_include = set()
        global_exclude = set()
        for guess, feedback in zip(guesses, feedbacks):
            constraints, global_include, global_exclude = update_constraints(
                guess, feedback, constraints, global_include, global_exclude
            )
            self.apply_constraints(constraints, global_include, global_exclude)

        if not self.possible_words:
            print("No possible words left based on constraints.")
            return None

        next_guess = self.choose_optimal_guess()
        return next_guess