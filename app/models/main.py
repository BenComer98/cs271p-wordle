import tensorflow as tf
import numpy as np
import random
from collections import namedtuple, deque

# ReplayMemory from File 1
from ReplayMemory import Transition
from WordleEnv import WordleEnv

class ReplayMemory(object):
    def __init__(self, capacity):
        self.memory = deque([], maxlen=capacity)

    def push(self, *args):
        """Save a transition"""
        for i, arg in enumerate(args):
            if isinstance(arg, np.ndarray):
                print(f"Argument {i} shape: {arg.shape}")
            else:
                print(f"Argument {i} value: {arg}")
        self.memory.append(Transition(*args))

    def sample(self, batch_size):
        return random.sample(self.memory, batch_size)

    def __len__(self):
        return len(self.memory)


# DQNAgent
class DQNAgent:
    def __init__(self, env, learning_rate):
        self.env = env
        self.state_size = env.state_size
        self.action_size = env.action_size
        self.gamma = 0.95  # Discount factor
        self.epsilon = 1.0  # Exploration rate
        self.epsilon_decay = 0.995
        self.epsilon_min = 0.01
        self.batch_size = 32
        self.learning_rate = learning_rate

        # Replay memory
        self.memory = ReplayMemory(10000)

        # Q-network and target network
        self.model = self._build_model()
        self.target_model = self._build_model()
        self.update_target_model()

    def _build_model(self):
        model = tf.keras.Sequential([
            tf.keras.layers.InputLayer(input_shape=(78,)),
            tf.keras.layers.Dense(256, activation='relu', ),
            tf.keras.layers.Dense(256, activation='relu',),
            # tf.keras.layers.Dense(64, activation='relu'),
            tf.keras.layers.Dense(self.action_size, activation='linear')
        ])
        model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=self.learning_rate), loss=tf.keras.losses.MeanSquaredError())
        return model

    def update_target_model(self):
        """Copy weights from the main model to the target model."""
        self.target_model.set_weights(self.model.get_weights())

    def store_transition(self, prev_state, state, action, reward, next_state, done):
        # Save the transition including the previous state, the current state, and the next state
        print(f"Storing transition: prev_state shape {prev_state.shape}, state shape {state.shape}, next_state shape {next_state.shape}")
        self.memory.push(prev_state, state, action, reward, next_state, done)

    def act(self, state):
        if np.random.rand() <= self.epsilon:
            return random.randrange(self.action_size)  # Explore
        state = np.expand_dims(state, axis=0)
        q_values = self.model.predict(state, verbose=0)
        print(f"Q-values: {q_values[0]}")  # Debugging Q-values
        return np.argmax(q_values[0])  # Exploit

    def replay(self):
        """Train the model using experiences from replay memory."""
        if len(self.memory) < self.batch_size:
            # print(f"Memory size: {len(self.memory)}")
            return

        # Sample a batch of transitions
        minibatch = self.memory.sample(self.batch_size)
        prev_states, states, actions, rewards, next_states, dones = zip(*minibatch)
        prev_states = np.array(prev_states)
        states = np.array(states)
        next_states = np.array(next_states)
        prev_states = prev_states.reshape(self.batch_size, self.state_size)
        states = states.reshape(self.batch_size, self.state_size)
        next_states = next_states.reshape(self.batch_size, self.state_size)

        print(f"Prev states shape: {prev_states.shape}")
        print(f"States shape: {states.shape}")
        print(f"Next states shape: {next_states.shape}")

        q_values = self.model.predict(states, verbose=0)
        next_q_values = self.target_model.predict(next_states, verbose=0)

        for i in range(self.batch_size):
            if dones[i]:
                q_values[i][actions[i]] = rewards[i]
            else:
                q_values[i][actions[i]] = rewards[i] + self.gamma * np.amax(next_q_values[i])

        self.model.fit(states, q_values, batch_size=self.batch_size, verbose=0, epochs=1)

        if self.epsilon > self.epsilon_min:
            self.epsilon *= self.epsilon_decay
        else:
            self.epsilon = self.epsilon_min


# Training Loop
def train_dqn(env, agent, episodes=10000, sync_frequency=10):
    for episode in range(episodes):
        state = env.reset()
        prev_state = state  # Store the initial state as the previous state
        total_reward = 0
        done = False

        while not done:
            action = agent.act(state)
            next_state, reward, done, _ = env.step(action)
            print(f"State: {state}, Action: {action}, Reward: {reward}, Next State: {next_state}, Done: {done}")
            agent.store_transition(prev_state, state, action, reward, next_state, done)
            prev_state = state  # Update the previous state for the next iteration
            state = next_state
            total_reward += reward

            if len(agent.memory) >= agent.batch_size:
                agent.replay()

        if episode % sync_frequency == 0:
            agent.update_target_model()

        print(f"Episode {episode + 1}/{episodes}, Total Reward: {total_reward}, Epsilon: {agent.epsilon:.2f}")

    print("Training complete!")


# Main Script
if __name__ == "__main__":
    env = WordleEnv()

    learning_rate = 0.01
    agent = DQNAgent(env, learning_rate)

    train_dqn(env, agent, episodes=10000)

    agent.model.save("wordle_10000_dqn_model.h5")
