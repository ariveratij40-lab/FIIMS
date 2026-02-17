package com.fiims.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.fiims.data.model.CreateNodoRequest
import com.fiims.data.model.Nodo
import com.fiims.data.model.UpdateNodoRequest
import com.fiims.data.remote.ApiClient
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class NodoViewModel : ViewModel() {
    private val apiService = ApiClient.getApiService()

    private val _nodos = MutableStateFlow<List<Nodo>>(emptyList())
    val nodos: StateFlow<List<Nodo>> = _nodos

    private val _selectedNodo = MutableStateFlow<Nodo?>(null)
    val selectedNodo: StateFlow<Nodo?> = _selectedNodo

    private val _loading = MutableStateFlow(false)
    val loading: StateFlow<Boolean> = _loading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    fun listNodos() {
        viewModelScope.launch {
            _loading.value = true
            try {
                val result = apiService.listNodos()
                _nodos.value = result
                _error.value = null
            } catch (e: Exception) {
                _error.value = e.message ?: "Error desconocido"
            } finally {
                _loading.value = false
            }
        }
    }

    fun getNodo(id: String) {
        viewModelScope.launch {
            _loading.value = true
            try {
                val result = apiService.getNodo(id)
                _selectedNodo.value = result
                _error.value = null
            } catch (e: Exception) {
                _error.value = e.message ?: "Error desconocido"
            } finally {
                _loading.value = false
            }
        }
    }

    fun createNodo(request: CreateNodoRequest) {
        viewModelScope.launch {
            _loading.value = true
            try {
                val result = apiService.createNodo(request)
                _nodos.value = _nodos.value + result
                _error.value = null
            } catch (e: Exception) {
                _error.value = e.message ?: "Error al crear nodo"
            } finally {
                _loading.value = false
            }
        }
    }

    fun updateNodo(id: String, request: UpdateNodoRequest) {
        viewModelScope.launch {
            _loading.value = true
            try {
                val result = apiService.updateNodo(id, request)
                _nodos.value = _nodos.value.map { if (it.id == id) result else it }
                _selectedNodo.value = result
                _error.value = null
            } catch (e: Exception) {
                _error.value = e.message ?: "Error al actualizar nodo"
            } finally {
                _loading.value = false
            }
        }
    }

    fun findByCode(codigo: String) {
        viewModelScope.launch {
            _loading.value = true
            try {
                val result = apiService.findByCode(codigo)
                _selectedNodo.value = result
                _error.value = null
            } catch (e: Exception) {
                _error.value = e.message ?: "Nodo no encontrado"
            } finally {
                _loading.value = false
            }
        }
    }

    fun clearError() {
        _error.value = null
    }
}
