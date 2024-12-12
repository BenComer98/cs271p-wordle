import csv
import os

FILE_NAME = "resources/wordlist.csv"

class WordList:
    def __init__(self):
        self.word_list = []
        self.load_words()

    def load_words(self):
        try:
            with open(FILE_NAME, 'r', newline='') as csvFile:
                csv_reader = csv.reader(csvFile)
                self.word_list = [row[0] for row in csv_reader if row]
        except FileNotFoundError:
            print(f"The file {FILE_NAME} was not found.")
        except IndexError:
            print("The CSV file appears to be empty or malformed.")

    def get(self):
        return self.word_list
