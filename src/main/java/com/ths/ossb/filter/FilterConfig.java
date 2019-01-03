package com.ths.ossb.filter;


import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class FilterConfig {

	@Bean
	public FilterRegistrationBean myOncePerRequestFilterRegistration() {
		FilterRegistrationBean registration = new FilterRegistrationBean();
		registration.setFilter(new OssbFilter());
		registration.addUrlPatterns("/*");
		registration.setName("OssbFilter");
		registration.setOrder(1);
		return registration;
	}

}

