export type Pregunta = {
  id: string;
  categoria: string;
  subcategoria: string;
  pregunta: string;
  respuesta_principal: string;
  respuestas_validas: string[];
  explicacion: string;

  veces_jugada?: number;
  veces_acertada?: number;
  veces_fallada?: number;
  marcada_revision?: boolean;
};

export type Stats = {
  [categoria: string]: {
    correctas: number;
    incorrectas: number;
  };
};