package com.ths.ossb.utils;

import com.google.gson.Gson;


public class GsonUtil {

    private static final Gson gson = new Gson();

    public static String toJsonString(Object object){
      return object==null?null:gson.toJson(object);
    }
}
