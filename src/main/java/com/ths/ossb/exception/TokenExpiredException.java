package com.ths.ossb.exception;

public class TokenExpiredException extends RuntimeException {

    public TokenExpiredException(){
        super();
    }
    public TokenExpiredException(Throwable t){
        super(t);
    }
    public TokenExpiredException(String msg){
        super(msg);
    }
}
