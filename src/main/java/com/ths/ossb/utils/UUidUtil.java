package com.ths.ossb.utils;

import java.util.UUID;

public class UUidUtil {
    public static final String generate(){
        return UUID.randomUUID().toString().replace("-","");
    }
}
