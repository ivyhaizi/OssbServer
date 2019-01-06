package com.ths.ossb.controller.web;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(value = "/")
public class StaticPageController {
	    
    @GetMapping(value = {"/html/{filename}"})
    public String getHtml(@PathVariable String filename){
        return filename;
    }

}
