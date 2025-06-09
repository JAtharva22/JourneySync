#include "getLocationSuggestions.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <curl/curl.h>
#include <jansson.h>

// Helper struct for libcurl response
struct MemoryStruct {
    char *memory;
    size_t size;
};

static size_t WriteMemoryCallback(void *contents, size_t size, size_t nmemb, void *userp) {
    size_t realsize = size * nmemb;
    struct MemoryStruct *mem = (struct MemoryStruct *)userp;
    char *ptr = realloc(mem->memory, mem->size + realsize + 1);
    if(ptr == NULL) return 0; // out of memory
    mem->memory = ptr;
    memcpy(&(mem->memory[mem->size]), contents, realsize);
    mem->size += realsize;
    mem->memory[mem->size] = 0;
    return realsize;
}

// Helper to get env var for API key
static const char* get_maps_api_key() {
    return getenv("MAPS_API_KEY");
}

int get_location_suggestions(const char *input, char **json_response) {
    if (!input || strlen(input) == 0) {
        *json_response = strdup("{\"error\":\"Input parameter is required\"}");
        return 400;
    }

    const char* api_key = get_maps_api_key();
    if (!api_key) {
        *json_response = strdup("{\"error\":\"API key not set\"}");
        return 500;
    }
    
    char requestUrl[1024];
    snprintf(requestUrl, sizeof(requestUrl),
        "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=%s&types=geocode&key=%s",
        input, api_key);
        
    CURL *curl = curl_easy_init();
    if (!curl) {
        *json_response = strdup("{\"error\":\"Failed to initialize curl\"}");
        return 500;
    }
    
    struct MemoryStruct chunk = { malloc(1), 0 };
    if (!chunk.memory) {
        curl_easy_cleanup(curl);
        *json_response = strdup("{\"error\":\"Memory allocation failed\"}");
        return 500;
    }
    
    curl_easy_setopt(curl, CURLOPT_URL, requestUrl);
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteMemoryCallback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, (void *)&chunk);
    CURLcode res = curl_easy_perform(curl);
    curl_easy_cleanup(curl);
    
    if (res != CURLE_OK) {
        free(chunk.memory);
        *json_response = strdup("{\"error\":\"Failed to fetch from Google Maps API\"}");
        return 500;
    }
    
    json_t *root = json_loads(chunk.memory, 0, NULL);
    free(chunk.memory);
    
    if (!root) {
        *json_response = strdup("{\"error\":\"Invalid JSON from Google Maps API\"}");
        return 500;
    }
    
    json_t *predictions = json_object_get(root, "predictions");
    json_t *arr = json_array();
    if (json_is_array(predictions)) {
        size_t i;
        json_t *val;
        json_array_foreach(predictions, i, val) {
            json_t *desc = json_object_get(val, "description");
            json_t *pid = json_object_get(val, "place_id");
            if (desc && pid) {
                json_t *obj = json_object();
                json_object_set_new(obj, "name", json_string(json_string_value(desc)));
                json_object_set_new(obj, "place_id", json_string(json_string_value(pid)));
                json_array_append_new(arr, obj);
            }
        }
    }
    
    *json_response = json_dumps(arr, JSON_COMPACT);
    json_decref(arr);
    json_decref(root);
    
    if (!*json_response) {
        *json_response = strdup("{\"error\":\"Failed to serialize response\"}");
        return 500;
    }
    
    return 200;
}
