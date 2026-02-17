package com.fiims.data.model

import java.util.Date

data class Cambio(
    val id: String,
    val nodo_id: String,
    val tipo_cambio: String, // creacion, actualizacion, escaneo
    val datos_anteriores: Map<String, Any>?,
    val datos_nuevos: Map<String, Any>,
    val tecnico_id: String?,
    val fecha_cambio: Date,
    val sincronizado: Boolean,
    val tenant_id: String
)

data class CreateCambioRequest(
    val nodo_id: String,
    val tipo_cambio: String,
    val datos_anteriores: Map<String, Any>? = null,
    val datos_nuevos: Map<String, Any>
)
