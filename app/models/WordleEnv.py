import csv
from random import random
import numpy as np

FILE_NAME = 'resources/wordlist.csv'


class WordleEnv:
    def __init__(self, word_length=5, max_attempts=6):
        self.word_length = word_length
        self.max_attempts = max_attempts
        self.target = ''
        self.attempts_left = 0
        self.attempts = 0
        self.current_guess = ''
        try:
            with open(FILE_NAME, 'r', newline='') as csvFile:
                csv_reader = csv.reader(csvFile)
                self.word_list = [row[0] for row in csv_reader if row]
        except FileNotFoundError:
            print(f"The file {FILE_NAME} was not found.")
        except IndexError:
            print("The CSV file appears to be empty or malformed.")

        self.state_size = 78
        self.action_size = len(self.word_list)
        self.available_actions = [list(range(self.action_size))]
        self.current_state = np.zeros(self.state_size, dtype=np.float32)

    # def load_words(self):
    #     try:
    #         with open(FILE_NAME, 'r', newline='') as csvFile:
    #             csv_reader = csv.reader(csvFile)
    #             self.word_list = [row[0] for row in csv_reader if row]
    #     except FileNotFoundError:
    #         print(f"The file {FILE_NAME} was not found.")
    #     except IndexError:
    #         print("The CSV file appears to be empty or malformed.")

    def remove_action(self, action):
        if action in self.available_actions:
            self.available_actions.remove(action)

    def get_state(self):
        state = self.current_state
        for idx, letter in enumerate(self.current_guess):
            if letter == self.target[idx]:
                state[(ord(letter) - 65)] = 1
            elif letter in self.target:
                state[(ord(letter) - 65) + 26] = 1
            else:
                state[(ord(letter) - 65) + 26 * 2] = 1
        return state

    def step(self, action):
        self.current_guess = self.word_list[action]
        self.remove_action(action)
        self.attempts += 1
        reward = 0
        done = False
        if self.current_guess == self.target:
            reward = 10
            done = True
        else:
            correct_letters = sum([1 for guessed_letter, target_letter in zip(self.current_guess, self.target) if
                                   guessed_letter == target_letter])
            reward = 1 * correct_letters

            self.attempts_left -= 1
            if self.attempts_left <= 0:
                reward = -10
                done = True

        self.remove_incompatible_words(self.current_guess)

        return self.get_state(), reward, done, {}

    def remove_incompatible_words(self, current_guess):
        new_available_actions = []
        for i in self.available_actions:
            word = self.word_list[i]
            compatible = True

            matched_letters = [False] * len(self.target)

            for idx, (guess_char, target_char) in enumerate(zip(current_guess, self.target)):
                if guess_char == target_char:
                    if word[idx] != guess_char:
                        compatible = False
                        break
                    matched_letters[idx] = True

            if compatible:
                for idx, guess_char in enumerate(current_guess):
                    if guess_char in self.target:
                        if word[idx] == guess_char and not matched_letters[idx]:
                            compatible = False
                            break
                        target_count = self.target.count(guess_char)
                        word_count = word.count(guess_char)
                        if word_count > target_count:
                            compatible = False
                            break

            if compatible:
                new_available_actions.append(i)

        if len(new_available_actions) > 0:
            self.available_actions = new_available_actions

    def reset(self):
        self.target = random.choice(self.word_list)
        self.attempts_left = self.max_attempts
        self.attempts = 0
        self.current_guess = '_' * self.word_length
        self.available_actions = list(range(self.action_size))
        self.current_state = np.zeros(self.state_size, dtype=np.float32)

        return self.current_state

    def show(self):
        print(f"Current guess: {self.current_guess}")
        print(f"Target word: {self.target}")
        print(f"Attempts left: {self.attempts_left}")
