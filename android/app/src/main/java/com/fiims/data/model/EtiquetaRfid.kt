package com.fiims.data.model

import java.util.Date

data class EtiquetaRfid(
    val id: String,
    val nodo_id: String,
    val codigo_rfid: String,
    val datos_etiqueta: Map<String, Any>?,
    val fecha_generacion: Date,
    val impresa: Boolean,
    val fecha_impresion: Date?,
    val tenant_id: String
)

data class GenerateRfidRequest(
    val nodo_id: String
)

data class MarkAsPrintedRequest(
    val id: String
)
