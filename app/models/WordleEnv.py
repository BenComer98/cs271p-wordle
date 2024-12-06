import csv
import random
import numpy as np

FILE_NAME = 'wordlist.csv'


class WordleEnv:
    def __init__(self, word_length=5, max_attempts=5):
        self.word_length = word_length
        self.max_attempts = max_attempts
        self.target = ''
        self.attempts_left = 0
        self.attempts = 0
        self.current_guess = ''
        self.guesses = []
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
        self.available_actions = list(range(self.action_size))

        self.current_state = np.zeros(self.state_size, dtype=np.float32)

    def remove_action(self, action):
        if action in self.available_actions:
            self.available_actions.remove(action)
        else:
            print(f"Action {action} already removed.")

    def get_state(self):
        state = self.current_state
        print(f"Current guess from get state word set to: {self.current_guess}")
        for idx, letter in enumerate(self.current_guess):
            letter = letter.upper()
            if letter == self.target[idx]:
                state[(ord(letter) - 65)] = 1
            elif letter in self.target:
                state[(ord(letter) - 65) + 26] = 1
            else:
                state[(ord(letter) - 65) + 26 * 2] = 1
        return state

    def compute_reward(self,current_guess, target, attempts_left):
        if current_guess == target:
            return 10, True  # Large reward for the correct guess

        correct_positions = sum(1 for i in range(len(current_guess)) if current_guess[i] == target[i])
        misplaced_positions = (
                sum(min(current_guess.count(c), target.count(c)) for c in set(current_guess)) - correct_positions
        )
        reward = 2 * correct_positions + misplaced_positions  # Reward for matches and misplacements

        if attempts_left <= 0:
            reward -= 100  # Penalty for exhausting attempts
            done = True
        else:
            done = False

        return reward, done

    def step(self, action):
        if not self.guesses:  # If this is the first guess
            self.current_guess = self.current_guess  # Use the guess set in reset
        else:
            self.current_guess = self.word_list[action].upper()
        print(f"Step method - Current Guess: {self.current_guess}, Target: {self.target}")
        # self.guesses.append(self.current_guess)# Ensure the action is removed from the list
        self.remove_action(action)
        if self.current_guess not in self.guesses:
            self.guesses.append(self.current_guess)
        self.attempts += 1

        # Calculate the reward and done flag using the compute_reward function
        reward, done = self.compute_reward(self.current_guess, self.target, self.attempts_left)

        # Decrease attempts left and finalize the state if done
        self.attempts_left -= 1
        if done:
            self.attempts_left = 0  # Ensure no negative attempts left
        else:
            self.remove_incompatible_words(self.current_guess)

        return self.get_state(), reward, done, {}


    def remove_incompatible_words(self, current_guess):
        print(f"Removing incompatible words for guess: {current_guess}")
        new_available_actions = []
        removed_count = 0
        reasons = {
            "incorrect_position": 0,
            "contains_eliminated": 0,
            "other": 0
        }

        for i in self.available_actions:
            word = self.word_list[i].upper()
            compatible = True
            reason = ""

            for idx, (guess_char, target_char) in enumerate(zip(current_guess, self.target)):
                if guess_char == target_char:
                    if word[idx] != guess_char:
                        compatible = False
                        reason = "incorrect_position"
                        break
                elif guess_char in self.target:
                    if word[idx] == guess_char:
                        compatible = False
                        reason = "incorrect_position"
                        break
                else:
                    if guess_char in word:
                        compatible = False
                        reason = "contains_eliminated"
                        break

            if compatible:
                new_available_actions.append(i)
            else:
                removed_count += 1
                reasons[reason] += 1

        if len(new_available_actions) > 0:
            self.available_actions = new_available_actions
        else:
            print("Warning: No compatible words left. Keeping all words.")

        return new_available_actions
    def reset(self,target_word=None, start_word=None,max_attempts=None):
        self.target = target_word.upper() if target_word else random.choice(self.word_list).upper()
        self.attempts_left = max_attempts if max_attempts else self.max_attempts
        self.attempts = 0
        self.guesses = []
        self.available_actions = list(range(self.action_size))
        self.current_state = np.zeros(self.state_size, dtype=np.float32)

        if start_word:
            action = self.word_list.index(start_word.lower())
            self.current_guess = start_word.upper()
            self.guesses.append(self.current_guess)
            self.remove_action(action)
            self.remove_incompatible_words(self.current_guess)
        else:
            self.current_guess = '_' * self.word_length
        print(f"Target word set to: {self.target}")
        print(f"Started : {self.current_guess}")
        return self.get_state()

    def show(self):
        print(f"Current guess: {self.current_guess}")
        print(f"Target word: {self.target}")
        print(f"Attempts left: {self.attempts_left}")
