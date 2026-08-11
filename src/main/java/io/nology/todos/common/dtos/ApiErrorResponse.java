package io.nology.todos.common.dtos;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Map;

import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.annotation.JsonInclude;

// Formats error responses into JSON objects
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiErrorResponse(Instant timestamp, int status, String error, String message, String path, Map<String, ArrayList<String>> details) {
    public static ApiErrorResponse of(HttpStatus httpStatus, String message, String path) {
        return new ApiErrorResponse(Instant.now(), httpStatus.value(), httpStatus.getReasonPhrase(), message, path, null);
    }
}
