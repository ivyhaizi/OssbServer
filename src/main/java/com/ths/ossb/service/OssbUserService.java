package com.ths.ossb.service;

import java.util.List;
import org.springframework.stereotype.Service;

import com.ths.ossb.model.OssbUser;

@Service
public interface OssbUserService {


    int updateUserInfo(OssbUser user);


    OssbUser getUserInfoById(Integer id);


}
