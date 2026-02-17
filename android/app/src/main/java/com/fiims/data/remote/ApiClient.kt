package com.fiims.data.remote

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiClient {
    private const val BASE_URL = "https://fiims.tu-dominio.com/"
    private var retrofit: Retrofit? = null
    private var apiService: FiimApiService? = null

    fun getApiService(token: String? = null): FiimApiService {
        if (apiService == null) {
            val httpClient = OkHttpClient.Builder()
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS)

            // Agregar interceptor de logging en debug
            val logging = HttpLoggingInterceptor()
            logging.level = HttpLoggingInterceptor.Level.BODY
            httpClient.addInterceptor(logging)

            // Agregar token de autenticación si está disponible
            if (token != null) {
                httpClient.addInterceptor { chain ->
                    val request = chain.request().newBuilder()
                        .addHeader("Authorization", "Bearer $token")
                        .build()
                    chain.proceed(request)
                }
            }

            retrofit = Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .client(httpClient.build())
                .build()

            apiService = retrofit!!.create(FiimApiService::class.java)
        }

        return apiService!!
    }

    fun resetClient() {
        retrofit = null
        apiService = null
    }
}
