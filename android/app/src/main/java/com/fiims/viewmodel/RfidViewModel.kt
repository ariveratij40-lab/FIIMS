package com.fiims.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.fiims.data.model.EtiquetaRfid
import com.fiims.data.model.GenerateRfidRequest
import com.fiims.data.remote.ApiClient
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class RfidViewModel : ViewModel() {
    private val apiService = ApiClient.getApiService()

    private val _etiquetas = MutableStateFlow<List<EtiquetaRfid>>(emptyList())
    val etiquetas: StateFlow<List<EtiquetaRfid>> = _etiquetas

    private val _selectedEtiqueta = MutableStateFlow<EtiquetaRfid?>(null)
    val selectedEtiqueta: StateFlow<EtiquetaRfid?> = _selectedEtiqueta

    private val _loading = MutableStateFlow(false)
    val loading: StateFlow<Boolean> = _loading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    fun generateEtiqueta(nodoId: String) {
        viewModelScope.launch {
            _loading.value = true
            try {
                val result = apiService.generateEtiqueta(GenerateRfidRequest(nodoId))
                _selectedEtiqueta.value = result
                _etiquetas.value = _etiquetas.value + result
                _error.value = null
            } catch (e: Exception) {
                _error.value = e.message ?: "Error al generar etiqueta"
            } finally {
                _loading.value = false
            }
        }
    }

    fun getEtiquetaByCode(codigo: String) {
        viewModelScope.launch {
            _loading.value = true
            try {
                val result = apiService.getEtiquetaByCode(codigo)
                _selectedEtiqueta.value = result
                _error.value = null
            } catch (e: Exception) {
                _error.value = e.message ?: "Etiqueta no encontrada"
            } finally {
                _loading.value = false
            }
        }
    }

    fun listEtiquetasByNodo(nodoId: String) {
        viewModelScope.launch {
            _loading.value = true
            try {
                val result = apiService.listEtiquetasByNodo(nodoId)
                _etiquetas.value = result
                _error.value = null
            } catch (e: Exception) {
                _error.value = e.message ?: "Error al cargar etiquetas"
            } finally {
                _loading.value = false
            }
        }
    }

    fun markAsPrinted(id: String) {
        viewModelScope.launch {
            _loading.value = true
            try {
                val result = apiService.markAsPrinted(id)
                _etiquetas.value = _etiquetas.value.map { if (it.id == id) result else it }
                _selectedEtiqueta.value = result
                _error.value = null
            } catch (e: Exception) {
                _error.value = e.message ?: "Error al marcar como impresa"
            } finally {
                _loading.value = false
            }
        }
    }

    fun getUnprintedEtiquetas() {
        viewModelScope.launch {
            _loading.value = true
            try {
                val result = apiService.getUnprintedEtiquetas()
                _etiquetas.value = result
                _error.value = null
            } catch (e: Exception) {
                _error.value = e.message ?: "Error al cargar etiquetas"
            } finally {
                _loading.value = false
            }
        }
    }

    fun clearError() {
        _error.value = null
    }
}
