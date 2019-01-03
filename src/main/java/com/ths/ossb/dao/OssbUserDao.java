package com.ths.ossb.dao;


import com.ths.ossb.model.OssbUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Service;

import java.util.List;


@Mapper
@Service
public interface OssbUserDao {

    int updateUserInfo(OssbUser user);

    OssbUser getUserInfoById(@Param("id") Integer id);

    OssbUser getUserInfoByCond(@Param("name") String name, @Param("salary") String salary);

}
