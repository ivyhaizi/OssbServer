package com.ths.ossb.service.impl;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ths.ossb.dao.OssbUserDao;
import com.ths.ossb.exception.BusinessException;
import com.ths.ossb.model.OssbUser;
import com.ths.ossb.service.OssbUserService;

@Service
public class OssbUserServiceImpl implements OssbUserService {

    @Autowired
    private OssbUserDao OssbUserDao;


    @Transactional
    @Override
    public int updateUserInfo(OssbUser user) {
        if (null == user.getId())
            throw BusinessException.withErrorCode("user id cannot be null");
        return OssbUserDao.updateUserInfo(user);
    }

    @Override
    public OssbUser getUserInfoById(Integer id) {
        return OssbUserDao.getUserInfoById(id);
    }


}
