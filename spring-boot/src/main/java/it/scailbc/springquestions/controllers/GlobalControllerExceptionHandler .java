package it.scailbc.springquestions.controllers;

import java.util.NoSuchElementException;

import org.hibernate.exception.ConstraintViolationException;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.validation.FieldError;

import org.springframework.web.bind.MethodArgumentNotValidException;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import org.springframework.web.context.request.WebRequest;

import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/** Handle generic errors in all controllers */
@ControllerAdvice
class GlobalControllerExceptionHandler extends ResponseEntityExceptionHandler  {

    @ResponseStatus(HttpStatus.NOT_FOUND)  // 404
    @ExceptionHandler(NoSuchElementException.class)
    protected @ResponseBody String handleEntityNotFound(NoSuchElementException ex) {
        return ex.getLocalizedMessage();
    }

    @ResponseStatus(HttpStatus.CONFLICT)  // 409
    @ExceptionHandler(ConstraintViolationException.class)
    public HttpEntity<Object> handleConflict(ConstraintViolationException ex) {
        return new HttpEntity<Object>(ex.getSQLException().getLocalizedMessage());
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                HttpHeaders headers, HttpStatus status,
                                                                WebRequest request) {
        FieldError fieldError = ex.getBindingResult().getFieldErrors().get(0);
        String errorMessage = fieldError.getField()+": "+fieldError.getDefaultMessage();
        return new ResponseEntity<Object>(errorMessage, HttpStatus.UNPROCESSABLE_ENTITY);  // 422
    }
}