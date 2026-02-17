package com.fiims.util

import java.text.SimpleDateFormat
import java.util.*
import kotlin.random.Random

object RfidCodeGenerator {
    /**
     * Genera un código único para un nodo
     * Formato: NODO-SITIO-YYYYMMDDHHMMSS-RANDOM
     */
    fun generateUniqueCode(sitio: String = "SITIO-001"): String {
        val timestamp = SimpleDateFormat("yyyyMMddHHmmss", Locale.US).format(Date())
        val random = Random.nextInt(1000, 9999)
        return "NODO-$sitio-$timestamp-$random"
    }

    /**
     * Genera un código EPC (Electronic Product Code) para etiquetas RFID
     */
    fun generateEPC(uniqueCode: String): String {
        val hex = uniqueCode.toByteArray().joinToString("") { "%02x".format(it) }
        return hex.take(24).padEnd(24, '0')
    }

    /**
     * Valida si un código RFID es válido
     */
    fun validateRfidCode(code: String): Boolean {
        return code.matches(Regex("^[0-9A-Fa-f]{24}$"))
    }

    /**
     * Decodifica un código EPC de vuelta al código del nodo
     */
    fun decodeEPC(epc: String): String {
        return try {
            val bytes = epc.chunked(2).map { it.toInt(16).toByte() }.toByteArray()
            String(bytes)
        } catch (e: Exception) {
            ""
        }
    }
}
