package com.ths.ossb.exception.handler;



import com.ths.ossb.controller.BaseController;
import com.ths.ossb.exception.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;


@RestControllerAdvice
public class OssbExceptionHandler extends BaseController{
    private static Logger log = LoggerFactory.getLogger(OssbExceptionHandler.class);

    @ExceptionHandler(TokenExpiredException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Object handlerTokenExpiredException(TokenExpiredException e){
        log.error("token is expired.",e);
        return this.ajaxFailureResponse("oken is expired。");
    }

    @ExceptionHandler(InvalidTokenException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Object handlerInvalidTokenException(InvalidTokenException e){
        log.error("token invalid.",e);
        return this.ajaxFailureResponse("token invaid。");
    }

    @ExceptionHandler(Exception.class)
    public Object handlerException(Exception e){
        log.error("服务器错误。",e);
        return this.ajaxFailureResponse("服务器错误。");
    }
}
