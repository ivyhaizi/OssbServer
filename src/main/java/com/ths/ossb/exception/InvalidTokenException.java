package com.ths.ossb.exception;

public class InvalidTokenException extends RuntimeException {

    public InvalidTokenException(){
        super();
    }
    public InvalidTokenException(Throwable t){
        super(t);
    }
    public InvalidTokenException(String msg){
        super(msg);
    }
}
