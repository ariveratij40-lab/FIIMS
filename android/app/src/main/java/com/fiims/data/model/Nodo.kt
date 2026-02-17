package com.fiims.data.model

import java.util.Date

data class Nodo(
    val id: String,
    val codigo_unico: String,
    val categoria: String,
    val color_cable: String?,
    val integrador: String?,
    val ubicacion_area: String?,
    val ubicacion_faceplate: String?,
    val foto_url: String?,
    val estado: String,
    val tecnico_id: String?,
    val fecha_creacion: Date,
    val fecha_actualizacion: Date,
    val tenant_id: String
)

data class CreateNodoRequest(
    val categoria: String,
    val color_cable: String,
    val integrador: String,
    val ubicacion_area: String,
    val ubicacion_faceplate: String,
    val foto_url: String? = null
)

data class UpdateNodoRequest(
    val categoria: String? = null,
    val color_cable: String? = null,
    val integrador: String? = null,
    val ubicacion_area: String? = null,
    val ubicacion_faceplate: String? = null,
    val foto_url: String? = null,
    val estado: String? = null
)
