export type Choice = {
  /** Texto del botón. */
  label: string
  /** ID de la escena destino. */
  goto: string
  /** Delta de reputación que aplica AL ELEGIR esta opción (antes de saltar). */
  rep?: number
  /** Texto que se muestra como "resultado" antes de transicionar. Opcional. */
  result?: string
  /** Si está, esta choice sólo aparece cuando el flag correspondiente está activo
   *  en el store. Útil para choices secretas / progresión meta. */
  requiresFlag?: 'allEndingsDiscovered'
}

export type SceneEnding = 'glory' | 'kingdom' | 'shame'

export type SceneRegion =
  | 'norte'      // Escandinavia, inicio
  | 'oeste'      // Francia, Inglaterra, ataques occidentales
  | 'oriente'    // Ruta varega, Volga, Bizancio, Bagdad
  | 'valhalla'   // Finales de gloria
  | 'shame'      // Finales de deshonra
  | 'skald'      // Camino secreto

export type Scene = {
  id: string
  /** Texto narrativo principal de la escena. */
  text: string
  /** Clave de sprite 8-bit (ver PixelScene.tsx). Si no existe, usa default. */
  art?: string
  /** Ruta a una imagen raster externa (opcional, sobrescribe el sprite). */
  image?: string
  /** Delta de reputación que aplica AL ENTRAR a esta escena. */
  rep?: number
  /** Opciones disponibles. Vacío = es un final. */
  choices: Choice[]
  /** Marca de final. Si está presente, la UI muestra "FIN" y permite reiniciar. */
  ending?: SceneEnding
  /** Región narrativa — determina la música contextual. */
  region?: SceneRegion
  /** Año aproximado del evento. Se muestra en el timeline. */
  year?: number
}
