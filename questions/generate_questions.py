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

SYSTEM_PROMPT = """Eres un generador de preguntas de trivial de alta calidad.

Tu tarea es crear EXACTAMENTE el numero de preguntas solicitado.

Reglas generales:
- Las preguntas deben ser precisas, verificables y con UNA respuesta principal clara.
- Evita preguntas demasiado famosas, obvias o repetitivas.
- Evita ambiguedades.
- No repitas el mismo hecho con redacciones distintas.
- Varia los temas dentro de la subcategoria.
- Las respuestas deben ser cortas siempre que sea posible.
- Incluye alternativas validas solo si realmente son razonables.
- La explicacion debe tener 1 o 2 frases y justificar por que la respuesta es correcta.
- No incluyas texto fuera del JSON.
- Si una pregunta no puede hacerse con suficiente claridad o calidad, sustituyela por otra mejor.
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
Dificultad: {dificultad}

Escala de dificultad:
1 = nivel secundaria (conocimiento general accesible)
2 = nivel bachillerato (requiere algo más de detalle)
3 = nivel universidad (cultura general sólida o conocimiento específico)
4 = nivel avanzado (preguntas difíciles de concurso)
5 = nivel experto (muy específicas o poco conocidas)

Reglas específicas:
- Ajusta la dificultad REAL al nivel solicitado
- Para niveles bajos (1-2): evita preguntas demasiado técnicas o raras
- Para niveles altos (4-5): evita preguntas típicas o demasiado conocidas
- Preguntas específicas, no generales
- Cada pregunta debe tener UNA única respuesta clara
- Evita ambigüedades
- No repitas conceptos entre preguntas
- No reutilices la misma respuesta principal más de una vez dentro del lote
- No generes varias preguntas sobre el mismo país, ciudad, persona, territorio, tratado, evento o entidad principal
- Evita variaciones mínimas de una misma idea
- Varía los temas dentro de la subcategoría
- Si la subcategoría se presta a repetición, fuerza diversidad de ejemplos y enfoques
- Devuelve solo datos que encajen en el esquema JSON
- No generes preguntas que dependan de opinión o interpretación
- No generes preguntas con múltiples respuestas correctas posibles
- Si no puedes generar suficiente variedad real, genera preguntas más profundas en vez de repetir ejemplos obvios
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

    if len(preguntas) != expected_count:
        raise ValueError(
            f"Se esperaban {expected_count} preguntas y llegaron {len(preguntas)}."
        )

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

        for nivel in [1, 2, 3, 4, 5]:
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