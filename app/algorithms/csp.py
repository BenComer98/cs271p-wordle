from models import WordList

class WordleCSP:
    def __init__(self, initial_word, target_word):
        self.current_guess = initial_word
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

    def update_constraints(self, guess, feedback):
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
        output = ""
        while self.current_guess != self.target_word:
            output += f"Attempt {attempt}: Guess - {self.current_guess} \n"
            fb = self.feedback(self.current_guess)
            output += f"Feedback: {fb} \n"

            constraints, global_exclude = self.update_constraints(self.current_guess, fb)

            self.apply_constraints(constraints, global_exclude)

            if not self.possible_words:
                output += "No possible words left based on constraints. \n"
                return output

            self.current_guess = self.choose_optimal_guess()
            attempt += 1
        output += f"Solved! The target word is '{self.current_guess}' in {attempt} attempts."
        return output

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