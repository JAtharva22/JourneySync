#ifndef FETCHUSER_H
#define FETCHUSER_H

#include <stdbool.h>
#include <time.h>

struct fetchuser_result {
    bool success;
    char *user_id;
    char *error;
};

struct fetchuser_result fetchuser(const char *auth_token);

#endif // FETCHUSER_H
