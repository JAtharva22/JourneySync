#include "fetchuser.h"
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <jwt.h>
#include <time.h>
#include <stdint.h>
#include <jansson.h>

#define JWT_SECRET_ENV "JWT_SECRET"

struct fetchuser_result fetchuser(const char *auth_token)
{
    struct fetchuser_result result = {0};
    result.success = false;
    result.user_id = NULL;
    result.error = NULL;
    printf("Fetching user from token: %s\n", auth_token ? auth_token : "NULL");
    if (!auth_token)
    {
        result.error = strdup("Please authenticate using a valid token");
        return result;
    }

    const char *jwt_secret = getenv(JWT_SECRET_ENV);
    if (!jwt_secret)
    {
        result.error = strdup("JWT secret not set");
        return result;
    }

    jwt_t *token = NULL;
    if (jwt_new(&token) != 0)
    {
        result.error = strdup("Failed to create JWT object");
        return result;
    }

    // Decode and verify the token
    int status = jwt_decode(&token, auth_token, (unsigned char *)jwt_secret, strlen(jwt_secret));
    if (status != 0)
    {
        jwt_free(token);
        result.error = strdup("Please authenticate using a valid token");
        return result;
    }

    // Check token expiration
    time_t now = time(NULL);
    // If you want to print the payload, use jwt_dump_str() for debugging
    char *jwt_dump = jwt_dump_str(token, 1); // 1 for pretty print
    if (jwt_dump)
    {
        printf("JWT payload: %s\n", jwt_dump);
        free(jwt_dump);
    }
    int64_t exp = jwt_get_grant_int(token, "iat");
    if (exp == -1)
    {
        jwt_free(token);
        result.error = strdup("Invalid or missing 'exp' claim in token");
        return result;
    }
    printf("Token expiration time: %ld\n", exp);
    printf("Current time: %ld\n", now);
// if (now >= exp) {
//     jwt_free(token);
//     result.error = strdup("Token expired");
//     return result;
// }

    // Get the "user" claim as a JSON string
    char *user_json_str = jwt_get_grants_json(token, "user");
    if (!user_json_str)
    {
        jwt_free(token);
        result.error = strdup("User claim not found in token");
        return result;
    }

    // Parse the JSON string
    json_error_t error;
    json_t *user_json = json_loads(user_json_str, 0, &error);
    free(user_json_str); // Free the string returned by jwt_get_grants_json

    if (!user_json)
    {
        jwt_free(token);
        result.error = strdup("Failed to parse user JSON");
        return result;
    }

    // Extract the "id" from the JSON object
    json_t *id_json = json_object_get(user_json, "id");
    if (!json_is_string(id_json))
    {
        json_decref(user_json);
        jwt_free(token);
        result.error = strdup("User id not found or not a string in token");
        return result;
    }

    const char *user_id = json_string_value(id_json);
    result.user_id = strdup(user_id);
    result.success = true;

    // Clean up
    json_decref(user_json);
    jwt_free(token);
    return result;
}
