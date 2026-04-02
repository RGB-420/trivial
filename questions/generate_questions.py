from __future__ import annotations

import json
import time
import os
import re
import csv
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from openai import OpenAI

from dotenv import load_dotenv

load_dotenv()

NIVELES_GENERAR = [3]

SYSTEM_PROMPT = """Eres un generador experto de preguntas de trivial de alta calidad.

OBJETIVO:
Crear preguntas variadas, no repetitivas y con alto valor educativo dentro de una subcategoría.

REGLAS CRÍTICAS:
- Genera EXACTAMENTE el número de preguntas solicitado.
- Cada pregunta debe centrarse en un concepto distinto.
- Evita repetir:
  - el mismo tema
  - la misma entidad (persona, obra, país, evento, etc.)
  - el mismo tipo de pregunta con ligeras variaciones

CALIDAD:
- Preguntas específicas, no genéricas
- Evita preguntas triviales o demasiado conocidas
- Evita preguntas excesivamente oscuras o irrelevantes
- Cada pregunta debe ser interesante por sí misma

RESPUESTAS:
- Debe haber UNA respuesta principal clara
- Respuestas cortas y concretas
- Incluye alternativas solo si son realmente equivalentes

EXPLICACIONES:
- 1 o 2 frases máximo
- Deben justificar por qué la respuesta es correcta

DIVERSIDAD (MUY IMPORTANTE):
- Máxima variedad dentro de la subcategoría
- Cambia:
  - tipo de conocimiento (histórico, técnico, cultural…)
  - tipo de pregunta (definición, identificación, causa, dato concreto…)
- No generes bloques repetitivos (ej: varias preguntas tipo “¿Quién fue…?”)

PROHIBIDO:
- Preguntas ambiguas
- Preguntas opinables
- Preguntas con múltiples respuestas posibles
- Repetición de estructuras

FORMATO:
- Devuelve SOLO JSON válido según el esquema
"""

QUESTION_SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "preguntas": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "categoria": {"type": "string"},
                    "subcategoria": {"type": "string"},
                    "dificultad": {"type": "integer", "enum": [1, 2, 3, 4, 5]},
                    "pregunta": {"type": "string"},
                    "respuesta_principal": {"type": "string"},
                    "respuestas_validas": {
                        "type": "array",
                        "items": {"type": "string"},
                        "minItems": 1,
                    },
                    "explicacion": {"type": "string"},
                },
                "required": [
                    "categoria",
                    "subcategoria",
                    "dificultad",
                    "pregunta",
                    "respuesta_principal",
                    "respuestas_validas",
                    "explicacion",
                ],
                "additionalProperties": False,
            },
            "minItems": 1,
        }
    },
    "required": ["preguntas"],
    "additionalProperties": False,
}


VALID_CATEGORIES = {
    "Ciencia",
    "Deportes",
    "Arte y literatura",
    "Historia",
    "Entretenimiento",
    "Geografía",
}


def load_plan(csv_path):
    plan = []

    with open(csv_path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)

        for row in reader:
            plan.append(row)

    return plan

def slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9áéíóúüñ]+", "_", value)
    return value.strip("_")


def build_user_prompt(
    categoria: str,
    subcategoria: str,
    dificultad: int,
    n_preguntas: int,
) -> str:
    return f"""Genera EXACTAMENTE {n_preguntas} preguntas de trivial.

Categoría: {categoria}
Subcategoría: {subcategoria}
Dificultad: {dificultad} (nivel universidad)

ENFOQUE ESPECÍFICO:
- Prioriza conocimiento relevante y representativo de la subcategoría
- Evita centrar demasiadas preguntas en un solo tema dentro de la subcategoría
- Cubre el mayor número posible de conceptos distintos

CONTROL DE CALIDAD:
- Cada pregunta debe ser única en concepto
- No repitas:
  - misma persona
  - misma obra
  - mismo evento
  - mismo lugar
- Máximo 1 pregunta por entidad principal

VARIEDAD:
- Mezcla:
  - conceptos teóricos
  - datos concretos
  - contexto histórico/cultural
  - identificación

DIFICULTAD NIVEL 3:
- Conocimiento de cultura general sólida
- No trivial, pero tampoco ultra especializado
- Evita preguntas tipo:
  - “¿Quién es…?” demasiado obvias
  - datos extremadamente raros

AUTOCONTROL:
Antes de responder:
- Revisa que no hay repeticiones
- Revisa que hay variedad real
- Reemplaza preguntas débiles por mejores

Devuelve SOLO JSON válido.
"""


def validate_questions(
    payload: dict[str, Any],
    categoria: str,
    subcategoria: str,
    dificultad: int,
    expected_count: int,
) -> list[dict[str, Any]]:
    preguntas = payload.get("preguntas")
    if not isinstance(preguntas, list):
        raise ValueError("La respuesta no contiene una lista válida en 'preguntas'.")

    MIN_ACCEPTABLE = int(expected_count * 0.8)  # 80%
    MAX_ACCEPTABLE = int(expected_count * 1.5)  # margen alto

    n = len(preguntas)

    if n < MIN_ACCEPTABLE:
        raise ValueError(
            f"Demasiadas pocas preguntas: {n} (mínimo aceptable {MIN_ACCEPTABLE})"
        )

    if n > expected_count:
        preguntas = preguntas[:expected_count]  # recorte limpio

    seen_questions: set[str] = set()
    validated: list[dict[str, Any]] = []

    for item in preguntas:
        if item.get("categoria") != categoria:
            raise ValueError(
                f"Categoría incorrecta en una pregunta: {item.get('categoria')}"
            )
        if item.get("subcategoria") != subcategoria:
            raise ValueError(
                f"Subcategoría incorrecta en una pregunta: {item.get('subcategoria')}"
            )
        if item.get("dificultad") != dificultad:
            raise ValueError(
                f"Dificultad incorrecta en una pregunta: {item.get('dificultad')}"
            )

        pregunta = str(item.get("pregunta", "")).strip()
        respuesta_principal = str(item.get("respuesta_principal", "")).strip()
        explicacion = str(item.get("explicacion", "")).strip()
        respuestas_validas = item.get("respuestas_validas", [])

        if not pregunta or not respuesta_principal or not explicacion:
            raise ValueError("Hay preguntas con campos vacíos.")
        if not isinstance(respuestas_validas, list) or not respuestas_validas:
            raise ValueError("Hay preguntas sin respuestas_validas.")

        normalized_question = pregunta.lower()
        if normalized_question in seen_questions:
            raise ValueError(f"Pregunta duplicada detectada: {pregunta}")
        seen_questions.add(normalized_question)

        validated.append(item)

    return validated


def enrich_questions(raw_questions: list[dict[str, Any]], source_model: str) -> list[dict[str, Any]]:
    today = datetime.now(timezone.utc).date().isoformat()
    enriched: list[dict[str, Any]] = []

    for idx, item in enumerate(raw_questions, start=1):
        categoria = item["categoria"]
        prefix = slugify(categoria)[:4] or "triv"
        item_id = f"{prefix}_{today.replace('-', '')}_{idx:04d}"
        enriched.append(
            {
                "id": item_id,
                **item,
                "estado": "activa",
                "marcada_revision": False,
                "motivo_revision": "",
                "nota_revision": "",
                "veces_jugada": 0,
                "veces_acertada": 0,
                "veces_fallada": 0,
                "fuente": source_model,
                "version": 1,
                "fecha_creacion": today,
                "ultima_modificacion": today,
            }
        )

    return enriched


def save_batch(
    preguntas: list[dict[str, Any]],
    output_dir: str,
    categoria: str,
    subcategoria: str,
    dificultad: int,
) -> Path:
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    filename = (
        f"{slugify(categoria)}__{slugify(subcategoria)}__d{dificultad}.json"
    )
    file_path = output_path / filename

    with file_path.open("w", encoding="utf-8") as f:
        json.dump(preguntas, f, ensure_ascii=False, indent=2)

    return file_path


def generate_batch(
    client: OpenAI,
    model: str,
    categoria: str,
    subcategoria: str,
    dificultad: int,
    n_preguntas: int = 10,
    reasoning_effort: str = "none",
) -> list[dict[str, Any]]:
    if categoria not in VALID_CATEGORIES:
        raise ValueError(f"Categoría no válida: {categoria}")
    if dificultad not in {1, 2, 3 , 4, 5}:
        raise ValueError("La dificultad debe ser 4, 5 o 6.")

    response = client.responses.create(
        model=model,
        reasoning={"effort": reasoning_effort},
        instructions=SYSTEM_PROMPT,
        input=build_user_prompt(categoria, subcategoria, dificultad, n_preguntas),
        text={
            "format": {
                "type": "json_schema",
                "name": "trivia_questions",
                "strict": True,
                "schema": QUESTION_SCHEMA,
            }
        },
    )

    payload = json.loads(response.output_text)
    validated = validate_questions(
        payload=payload,
        categoria=categoria,
        subcategoria=subcategoria,
        dificultad=dificultad,
        expected_count=n_preguntas,
    )
    return enrich_questions(validated, source_model=model)


if __name__ == "__main__":
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    MODEL = os.getenv("MODEL", "gpt-5.4-mini")
    OUTPUT_DIR = os.getenv("OUTPUT_DIR", "./preguntas_generadas")

    MAX_RETRIES = 3
    RETRY_DELAY = 2

    plan = load_plan("categorias.csv")

    for row in plan:
        categoria = row["categoria"]
        subcategoria = row["subcategoria"]

        for nivel in NIVELES_GENERAR:
            n_preguntas = int(row[f"nivel_{nivel}"])

            if n_preguntas == 0:
                continue

            print(f"{categoria} | {subcategoria} | nivel {nivel} | {n_preguntas} preguntas")

            filename = f"{slugify(categoria)}__{slugify(subcategoria)}__d{nivel}.json"

            if os.path.exists(os.path.join(OUTPUT_DIR, filename)):
                print("Ya existe, salto")
                continue

            success = False

            for attempt in range(1, MAX_RETRIES + 1):
                try:
                    preguntas = generate_batch(
                        client=client,
                        model=MODEL,
                        categoria=categoria,
                        subcategoria=subcategoria,
                        dificultad=nivel,
                        n_preguntas=n_preguntas,
                    )

                    save_batch(
                        preguntas,
                        OUTPUT_DIR,
                        categoria,
                        subcategoria,
                        nivel,
                    )

                    print(f"✔ Generado correctamente en intento {attempt}")
                    success = True
                    break

                except Exception as e:
                    print(f"Intento {attempt}/{MAX_RETRIES} fallido: {e}")

                    if attempt < MAX_RETRIES:
                        print(f"Reintentando en {RETRY_DELAY} segundos...")
                        time.sleep(RETRY_DELAY)

            if not success:
                print(f"❌ Fallo definitivo en {categoria} | {subcategoria} | nivel {nivel}")

            time.sleep(1)