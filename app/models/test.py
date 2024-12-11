import random
from models.WordleEnv import WordleEnv
import numpy as np
import tensorflow as tf

model = tf.keras.models.load_model("models/wordle_10000_dqn_model.h5")
env = WordleEnv()

def similarity_score(word_idx, previous_guesses, target):
    word = env.word_list[word_idx]
    overlap_score = sum(len(set(word) & set(guess)) for guess in previous_guesses)
    return overlap_score


def test_model(env, model, target_word=None, start_word=None, max_attempts=None):

    state = env.reset(target_word=target_word, start_word=start_word,max_attempts=max_attempts)

    done = False
    steps = 0
    total_reward = 0
    guesses=[]
    while not done and steps < max_attempts:
        state_input = np.array(state).reshape(1, -1)
        q_values = model.predict(state_input, verbose=0)  # Predict Q-values
        q_values_filtered = [
            (q, i, similarity_score(i, env.guesses, env.target))
            for i, q in enumerate(q_values[0]) if i in env.available_actions
        ]
        q_values_filtered.sort(key=lambda x: (x[0], x[2]), reverse=True)

        if not q_values_filtered:
            print("No valid actions left!")
            break

        if np.random.rand() < 0.01:  # Random exploration
            action = random.choice(env.available_actions)
        else:
            valid_actions = [
                i for i in env.available_actions
                if sum(len(set(env.word_list[i]) & set(guess)) for guess in env.guesses) > 0
            ]
            if valid_actions:
                action = max(valid_actions, key=lambda i: q_values[0][i])  # Best Q-value among valid
            else:
                action = random.choice(env.available_actions)
        next_state, reward, done, _ = env.step(action)
        total_reward += reward
        steps += 1
        guesses.append(env.word_list[action])
        print(f"Step {steps}: Guessed '{env.word_list[action]}', Reward: {reward}")

    # Update state
        state = next_state


    if env.target == env.current_guess:
        print(f"Success! Guessed the word '{env.target}' in {steps} steps.")
    else:
        print(f"Failed to guess the word. Target was '{env.target}'.")
    statuses=[]
    target = env.target.upper()
    for guess in guesses:
        guess = guess.upper()
        counts = [0]*26
        status = ["gray"] * 5
        for i in range(5):
            if guess[i] == target[i]:
                status[i] = "green"
            else:
                counts[ord(target[i]) - ord('A')] += 1
        for i in range(5):
            if status[i] == "gray":
                if counts[ord(guess[i]) - ord('A')] > 0:
                    status[i] = "yellow"
                counts[ord(guess[i]) - ord('A')] -= 1

        statuses.append(status)

    return guesses, statuses

# guesses,statuses = test_model(env, model, target_word="CHIRP", start_word="CHURN",max_attempts=2)
# print(guesses)
# print(statuses)