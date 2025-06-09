#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include "middleware/fetchuser.h"
#include "suggestionControllers/getLocationSuggestions.h"

#define PORT 8080
#define MAX_ERROR_LEN 256
#define BUFFER_SIZE 4096

// Standardized response helpers
void send_json_response(int client_socket, const char *json, int status_code) {
    if (!json) {
        // Handle null JSON response
        const char *error = "{\"error\":\"Internal server error\"}";
        send_json_response(client_socket, error, 500);
        return;
    }
    
    char response[BUFFER_SIZE];
    const char *status_text = "OK";
    if (status_code == 400) status_text = "Bad Request";
    else if (status_code == 401) status_text = "Unauthorized";
    else if (status_code == 403) status_text = "Forbidden";
    else if (status_code == 404) status_text = "Not Found";
    else if (status_code == 500) status_text = "Internal Server Error";
    else if (status_code == 502) status_text = "Bad Gateway";
    
    int len = snprintf(response, sizeof(response),
        "HTTP/1.1 %d %s\r\n"
        "Content-Type: application/json\r\n"
        "Content-Length: %zu\r\n\r\n"
        "%s",
        status_code, status_text, strlen(json), json);
    
    if (len > 0 && len < (int)sizeof(response)) {
        write(client_socket, response, len);
    }
}

void send_error(int client_socket, int status_code, const char *message) {
    char json[MAX_ERROR_LEN];
    snprintf(json, sizeof(json), "{\"error\":\"%s\"}", message);
    send_json_response(client_socket, json, status_code);
}

// Extract query parameter from URL
char* extract_query_param(const char* url, const char* key) {
    const char* query_start = strchr(url, '?');
    if (!query_start) return NULL;
    query_start++;
    
    char* query = strdup(query_start);
    char* token = strtok(query, "&");
    while (token) {
        char* eq = strchr(token, '=');
        if (eq) {
            *eq = '\0';
            if (strcmp(token, key) == 0) {
                char* value = strdup(eq + 1);
                free(query);
                return value;
            }
            *eq = '=';
        }
        token = strtok(NULL, "&");
    }
    free(query);
    return NULL;
}

// Handle suggestions endpoint
void handle_suggestions(int client_socket, const char* path) {
    char* input = extract_query_param(path, "input");
    if (!input) {
        send_error(client_socket, 400, "Input parameter is required");
        return;
    }
    
    char* json_response = NULL;
    int status = get_location_suggestions(input, &json_response);
    
    if (status != 200 || !json_response) {
        send_error(client_socket, 502, "Failed to fetch location suggestions");
    } else {
        send_json_response(client_socket, json_response, status);
    }
    
    if (json_response) free(json_response);
    free(input);
}

// Main request handler
void handle_request(int client_socket, const char* buffer) {
    // Parse method and path
    char method[8] = {0};
    char path[256] = {0};
    sscanf(buffer, "%7s %255s", method, path);

    // Extract auth token
    char *auth_token = NULL;
    char *header = strstr(buffer, "auth-token: ");
    if (header) {
        header += 12; // Skip "auth-token: "
        char *end = strstr(header, "\r\n");
        if (end) {
            size_t len = end - header;
            auth_token = (char*)malloc(len + 1);
            if (auth_token) {
                strncpy(auth_token, header, len);
                auth_token[len] = '\0';
            }
        }
    }

    // Apply authentication middleware
    struct fetchuser_result auth_result = fetchuser(auth_token);
    
    if (!auth_result.success) {
        // Send appropriate error based on auth failure
        send_error(client_socket, 401, auth_result.error ? auth_result.error : "Authentication failed");
        
        // Clean up auth resources
        if (auth_result.error) free(auth_result.error);
        if (auth_result.user_id) free(auth_result.user_id);
        if (auth_token) free(auth_token);
        return;
    }

    // Route authenticated requests
    if (strncmp(path, "/api/suggestion/suggestions", 26) == 0) {
        handle_suggestions(client_socket, path);
    } else {
        const char *response = "{\"success\":true,\"message\":\"Authenticated\"}";
        send_json_response(client_socket, response, 200);
    }
    
    // Clean up resources
    if (auth_result.error) free(auth_result.error);
    if (auth_result.user_id) free(auth_result.user_id);
    if (auth_token) free(auth_token);
}

int main() {
    int server_fd, client_socket;
    struct sockaddr_in address;
    int opt = 1;
    int addrlen = sizeof(address);

    if ((server_fd = socket(AF_INET, SOCK_STREAM, 0)) == 0) {
        perror("socket failed");
        exit(EXIT_FAILURE);
    }
    
    setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(PORT);

    if (bind(server_fd, (struct sockaddr *)&address, sizeof(address)) < 0) {
        perror("bind failed");
        exit(EXIT_FAILURE);
    }
    
    if (listen(server_fd, 3) < 0) {
        perror("listen");
        exit(EXIT_FAILURE);
    }
    
    printf("C API server running on port %d...\n", PORT);
    while (1) {
        if ((client_socket = accept(server_fd, (struct sockaddr *)&address, (socklen_t*)&addrlen)) < 0) {
            perror("accept");
            continue;
        }
        
        char buffer[BUFFER_SIZE] = {0};
        read(client_socket, buffer, BUFFER_SIZE - 1);
        handle_request(client_socket, buffer);
        close(client_socket);
    }
    return 0;
}
