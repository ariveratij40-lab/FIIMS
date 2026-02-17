package com.fiims.data.remote

import com.fiims.data.model.*
import retrofit2.http.*

interface FiimApiService {
    // Nodos endpoints
    @GET("/api/nodos")
    suspend fun listNodos(): List<Nodo>

    @GET("/api/nodos/{id}")
    suspend fun getNodo(@Path("id") id: String): Nodo

    @POST("/api/nodos")
    suspend fun createNodo(@Body request: CreateNodoRequest): Nodo

    @PUT("/api/nodos/{id}")
    suspend fun updateNodo(
        @Path("id") id: String,
        @Body request: UpdateNodoRequest
    ): Nodo

    @DELETE("/api/nodos/{id}")
    suspend fun deleteNodo(@Path("id") id: String)

    @GET("/api/nodos/search/{codigo}")
    suspend fun findByCode(@Path("codigo") codigo: String): Nodo?

    // Cambios endpoints
    @GET("/api/cambios/nodo/{nodo_id}")
    suspend fun listCambiosByNodo(@Path("nodo_id") nodoId: String): List<Cambio>

    @GET("/api/cambios")
    suspend fun listAllCambios(): List<Cambio>

    @GET("/api/cambios/pending")
    suspend fun getPendingSync(): List<Cambio>

    @POST("/api/cambios/sync")
    suspend fun markAsSynced(@Body request: SyncRequest): SyncResponse

    // Etiquetas RFID endpoints
    @POST("/api/etiquetas/generate")
    suspend fun generateEtiqueta(@Body request: GenerateRfidRequest): EtiquetaRfid

    @GET("/api/etiquetas/{codigo}")
    suspend fun getEtiquetaByCode(@Path("codigo") codigo: String): EtiquetaRfid?

    @GET("/api/etiquetas/nodo/{nodo_id}")
    suspend fun listEtiquetasByNodo(@Path("nodo_id") nodoId: String): List<EtiquetaRfid>

    @PUT("/api/etiquetas/{id}/print")
    suspend fun markAsPrinted(@Path("id") id: String): EtiquetaRfid

    @GET("/api/etiquetas/unprinted")
    suspend fun getUnprintedEtiquetas(): List<EtiquetaRfid>
}

data class SyncRequest(
    val ids: List<String>
)

data class SyncResponse(
    val success: Boolean
)
