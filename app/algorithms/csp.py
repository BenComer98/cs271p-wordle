from models import WordList
from models.feedback import feedback
import json

class WordleCSP:
    def __init__(self, initial_word, target_word):
        self.current_guess = initial_word.lower()
        self.target_word = target_word.lower()
        self.possible_words = [word.lower() for word in WordList().get()]

        
    def update_constraints(self, guess, feedback):
        guess = guess.lower()
        constraints = [{"include": set(), "exclude": set()} for _ in range(len(guess))]
        global_exclude = set()
        for i, (letter, fb) in enumerate(zip(guess, feedback)):
            if fb == "green":
                constraints[i]["include"].add(letter)

        letter_counts = {}
        for letter in self.target_word:
            letter_counts[letter] = letter_counts.get(letter, 0) + 1

        for i, (letter, fb) in enumerate(zip(guess, feedback)):
            if fb == "yellow":
                constraints[i]["exclude"].add(letter)
            elif fb == "gray":
                if letter_counts.get(letter, 0) == 0:
                    global_exclude.add(letter)
                constraints[i]["exclude"].add(letter)

        return constraints, global_exclude

    def apply_constraints(self, constraints, global_exclude):
        new_possible_words = []
        for word in self.possible_words:
            valid = True
            for i, char in enumerate(word):
                if char in global_exclude or \
                        (char in constraints[i]["exclude"]) or \
                        (constraints[i]["include"] and char not in constraints[i]["include"]):
                    valid = False
                    break
            if valid:
                new_possible_words.append(word)
        print(f"Remaining possible words: {new_possible_words}")
        self.possible_words = new_possible_words

    def solve(self):
        attempt = 1
        outputJSON = {
            "startingWord": self.current_guess,
            "target": self.target_word,
            "wordAttempts": [],
            "feedbacks": []
        }
        output = ""
        while self.current_guess != self.target_word:
            output += f"Attempt {attempt}: Guess - {self.current_guess.upper()} \n"
            print(outputJSON)
            outputJSON["wordAttempts"].append(self.current_guess.upper())
            print(self.current_guess)
            print(self.target_word)
            fb = feedback(self.current_guess.upper(), self.target_word.upper())
            output += f"Feedback: {fb} \n"
            outputJSON["feedbacks"].append(fb)

            constraints, global_exclude = self.update_constraints(self.current_guess, fb)

            print(self.possible_words)
            self.apply_constraints(constraints, global_exclude)

            if not self.possible_words:
                output += "No possible words left based on constraints. \n"
                outputJSON["invalid"] = True
                outputJSON["description"] = output
                data = json.dumps(outputJSON)
                return data

            self.current_guess = self.choose_optimal_guess()
            attempt += 1
        output += f"Solved! The target word is '{self.current_guess}' in {attempt} attempts."
        outputJSON["solved"] = True
        outputJSON["description"] = output
        data = json.dumps(outputJSON)
        return data

    def choose_optimal_guess(self):
        from collections import Counter
        position_counts = [Counter() for _ in range(5)]
        for word in self.possible_words:
            for i, char in enumerate(word):
                position_counts[i][char] += 1
        word_scores = []
        for word in self.possible_words:
            score = sum(position_counts[i][char] for i, char in enumerate(word))
            word_scores.append((score, word))
        word_scores.sort(reverse=True)
        best_score, best_word = word_scores[0]
        return best_word