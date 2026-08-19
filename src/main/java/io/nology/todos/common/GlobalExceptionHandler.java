package io.nology.todos.common;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import io.nology.todos.common.dtos.ApiErrorResponse;
import io.nology.todos.common.exceptions.NotFoundException;
import io.nology.todos.common.exceptions.UnprocessableContentException;
import jakarta.servlet.http.HttpServletRequest;

@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleNotFoundException(NotFoundException ex, HttpServletRequest req) {
        ApiErrorResponse response = ApiErrorResponse.of(HttpStatus.NOT_FOUND, ex.getMessage(), req.getRequestURI());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiErrorResponse> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException ex, HttpServletRequest req) {
        ApiErrorResponse response = ApiErrorResponse.of(HttpStatus.BAD_REQUEST, ex.getMessage(), req.getRequestURI());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex, HttpServletRequest req) {
        ApiErrorResponse response = ApiErrorResponse.of(HttpStatus.BAD_REQUEST, ex.getMessage(), req.getRequestURI());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex, HttpServletRequest req) {
        ApiErrorResponse response = ApiErrorResponse.of(HttpStatus.BAD_REQUEST, ex.getMessage(), req.getRequestURI());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UnprocessableContentException.class)
    public ResponseEntity<ApiErrorResponse> handleUnprocessableContentException(UnprocessableContentException ex, HttpServletRequest req) {
        ApiErrorResponse response = ApiErrorResponse.of(HttpStatus.UNPROCESSABLE_CONTENT, ex.getMessage(), req.getRequestURI());
        return new ResponseEntity<>(response, HttpStatus.UNPROCESSABLE_CONTENT);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleDataIntegrityViolationException(DataIntegrityViolationException ex, HttpServletRequest req) {
        ApiErrorResponse response = ApiErrorResponse.of(HttpStatus.BAD_REQUEST, ex.getMessage(), req.getRequestURI());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiErrorResponse> handleIllegalStateException(IllegalStateException ex, HttpServletRequest req) {
        ApiErrorResponse response = ApiErrorResponse.of(HttpStatus.BAD_REQUEST, ex.getMessage(), req.getRequestURI());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

}
