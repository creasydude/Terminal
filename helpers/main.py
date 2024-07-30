from collections import Counter
import json

def parse_json_input():
    lines = []
    print('To obtain JSON, follow these steps: \n1. Enter the game. \n2. Press F12 in your browser (Open DevTools by any method). \n3. Go to the Network section. \n4. Find the object named last. \n5. Copy all the code that is in the Response tab \n6. Also You Can Enter The Website : https://app.0xterminal.game/api/game/last')
    print('If such an element is not present, try exiting the current match and entering again. \nAlso, for each new match, you need to perform this trick again with a new last element')
    print("\nEnter JSON (press Enter twice to finish input):")
    while True:
        line = input()
        if not line:
            break
        lines.append(line)

    json_input = '\n'.join(lines)

    try:
        data = json.loads(json_input)
        words_list = data.get("words", [])
        return words_list

    except json.JSONDecodeError:
        print("JSON input error. Please enter valid JSON.")
        return None

def keep_and_count_vertical_matching_words(sorted_matrix, first_word):
    first_word_letters = list(first_word)

    def count_vertical_matches(row):
        return sum(1 for i, letter in enumerate(row) if i < len(first_word_letters) and letter == first_word_letters[i])

    matching_matrix = []
    for row in sorted_matrix:
        vertical_matches = count_vertical_matches(row)
        matching_matrix.append(row + [vertical_matches])

    return matching_matrix

def dig_str_del(orig_string):
    final_string = ''
    for c in orig_string:
        if c not in ('0', '1', '2', '3', '4', '5', '6', '7', '8', '9'):
            final_string = final_string + c
    return final_string

def dobavlenie_vesa(result_matrix, result_letter_counts):
    for row in result_matrix:
        row_sum = sum(result_letter_counts[var] for var in row)
        row.append(row_sum)
    return result_matrix

def count_letter_occurrences(matrix):
    # Use Counter to count letter occurrences
    letter_counts = Counter()

    # Iterate through each letter in the matrix
    for row in matrix:
        for letter in row:
            # Check if the character is a letter
            if letter.isalpha():
                # Update the counter for the given letter
                letter_counts[letter] += 1

    return letter_counts

def find_unique_letters(matrix):
    # Create a set to store unique letters
    unique_letters = set()

    # Iterate through each letter in the matrix
    for row in matrix:
        for letter in row:
            # Check if the letter is an English uppercase letter and add it to the set
            if letter.isalpha() and letter.isascii() and letter.isupper():
                unique_letters.add(letter)

    # Convert the set to a list and sort it
    alphabet = sorted(list(unique_letters))

    return alphabet

def print_matrix(matrix):
    for row in matrix:
        print(row)

def create_word_matrix(words):
    # Create an empty two-dimensional matrix
    matrix = []

    # Fill the matrix with letters from words
    for word in words:
        matrix.append(list(word))

    return matrix

def vibor_slova(sorted_matrix):
    choice1 = dig_str_del(str(''.join(str(el) for el in sorted_matrix[0]))) # Word
    choice_result = input(f'\nChoose the word {choice1} and enter the number of matches for the word (number):')
    return choice_result

def kolvo_sovpad(sorted_matrix, kolvo_sovpad):
    print(sorted_matrix, kolvo_sovpad)
    return 0

def vivod_sovpad(sorted_matrix, kolvo_sovpad):
    filtered_matrix = []
    words_length = len(sorted_matrix[0]) - 1
    for word in sorted_matrix:
        if int(word[words_length]) == int(kolvo_sovpad):
            filtered_matrix.append(word)
    return filtered_matrix

def win():
    return 0

def main():

    activity_count = 0
    words_list = parse_json_input()

    # Step 1: Form a matrix from the letters
    result_matrix = create_word_matrix(words_list)

    # Step 2: Determine the number of letter occurrences in the matrix
    result_letter_counts = count_letter_occurrences(result_matrix)

    # Step 3: Append the word weight to the right in the matrix
    result_matrix = dobavlenie_vesa(result_matrix, result_letter_counts)
    sorted_matrix = sorted(result_matrix, key=lambda x: x[-1], reverse=True)
    print("\nSorted matrix by word weight in descending order:")
    print_matrix(sorted_matrix)


    words_length = len(sorted_matrix[1]) - 1 # shows the actual word length and the index of the numerical parameter

    for row in sorted_matrix:
        row.pop(int(words_length))

    while True:

        # Step 4: Choose the most weighted word for the user
        activity_count += 1
        kolvo_sovpad = vibor_slova(sorted_matrix) # Number of matches

        if int(kolvo_sovpad) == int(words_length):
            print('You won')
            return 0
        print('User actions count:', activity_count)
        if (activity_count == 4):
            print("You lost")
            return 0

        # Step 5: Remove unsuitable words from the matrix
        filtered_matrix = keep_and_count_vertical_matching_words(sorted_matrix, sorted_matrix[0])
        print('Options matrix')
        sorted_matrix = vivod_sovpad(filtered_matrix, kolvo_sovpad)
        print_matrix(sorted_matrix)
        for row in sorted_matrix:
            row.pop(int(words_length))

if __name__ == '__main__':
    while True:
        main()
