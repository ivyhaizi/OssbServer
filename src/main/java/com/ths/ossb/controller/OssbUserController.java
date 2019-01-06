package com.ths.ossb.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ths.ossb.model.OssbUser;
import com.ths.ossb.service.OssbUserService;

@RestController
@RequestMapping("/ossbuser")
public class OssbUserController extends BaseController{

	@Autowired
	private OssbUserService ossbUserService;

	@RequestMapping("/getOssbUserById/{id}")
	public OssbUser getOssbUserById(@PathVariable String id){

		OssbUser ossbUser = ossbUserService.getUserInfoById(Integer.parseInt(id));
		return ossbUser;
	}
	
}
