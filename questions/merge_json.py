import json
import os
from pathlib import Path

INPUT_DIR = "./preguntas_generadas"
OUTPUT_FILE = "C:/Users/beepe/Desktop/trivia/trivial-app/src/data/preguntas.json"


def load_all_jsons(input_dir):
    all_questions = []

    for file in Path(input_dir).glob("*.json"):
        print(f"Leyendo {file}")

        with open(file, "r", encoding="utf-8") as f:
            data = json.load(f)
            all_questions.extend(data)

    return all_questions


def remove_duplicates(questions):
    seen = set()
    unique = []

    for q in questions:
        key = q["pregunta"].strip().lower()

        if key not in seen:
            seen.add(key)
            unique.append(q)
        else:
            print(f"Duplicada eliminada: {q['pregunta']}")

    return unique


def main():
    print("Cargando preguntas...")
    questions = load_all_jsons(INPUT_DIR)

    print(f"Total antes de limpiar: {len(questions)}")

    questions = remove_duplicates(questions)

    print(f"Total después de limpiar: {len(questions)}")

    print("Guardando archivo final...")

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)

    print(f"Archivo guardado en: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()