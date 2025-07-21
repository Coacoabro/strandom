import tkinter as tk
import json

ROWS, COLS = 8, 6  # Adjust grid size
board = [["" for _ in range(COLS)] for _ in range(ROWS)]
current_path = []
solution_words = []

def click_cell(r, c):
    current_path.append([r, c])
    buttons[r][c].config(bg="lightblue")

def save_word():
    word = word_entry.get().strip().upper()
    if not word or len(current_path) != len(word):
        print("Word/path mismatch!")
        return

    solution_words.append({
        "word": word,
        "path": current_path.copy()
    })
    print(f"Added: {word}")
    word_entry.delete(0, tk.END)
    reset_path()

def reset_path():
    global current_path
    for r, c in current_path:
        buttons[r][c].config(bg="white")
    current_path = []

def save_json():
    for r in range(ROWS):
        for c in range(COLS):
            board[r][c] = entries[r][c].get().upper() or " "
    
    result = {
        "title": title_entry.get(),
        "board": board,
        "solutionWords": solution_words
    }
    with open("strandom_puzzle.json", "w") as f:
        json.dump(result, f, indent=2)
    print("Saved to strandom_puzzle.json")

root = tk.Tk()
root.title("Strandom Puzzle Builder")

title_entry = tk.Entry(root, width=30)
title_entry.insert(0, "Puzzle Title")
title_entry.grid(row=0, column=0, columnspan=COLS)

entries = [[None for _ in range(COLS)] for _ in range(ROWS)]
buttons = [[None for _ in range(COLS)] for _ in range(ROWS)]

for r in range(ROWS):
    for c in range(COLS):
        frame = tk.Frame(root, width=30, height=30)
        frame.grid(row=r+1, column=c)
        e = tk.Entry(frame, width=2, justify='center')
        e.pack()
        entries[r][c] = e
        
        b = tk.Button(root, text="", width=2, command=lambda r=r, c=c: click_cell(r, c))
        b.grid(row=r+ROWS+1, column=c)
        buttons[r][c] = b

word_entry = tk.Entry(root)
word_entry.grid(row=ROWS*2+2, column=0, columnspan=COLS//2)
tk.Button(root, text="Add Word", command=save_word).grid(row=ROWS*2+2, column=COLS//2)
tk.Button(root, text="Reset Path", command=reset_path).grid(row=ROWS*2+3, column=0, columnspan=COLS//2)
tk.Button(root, text="Save JSON", command=save_json).grid(row=ROWS*2+3, column=COLS//2)

root.mainloop()
