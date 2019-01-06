package com.ths.ossb.controller;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicHeader;
import org.apache.http.params.CoreConnectionPNames;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ths.ossb.intercepter.OssbIntercepter;
import com.ths.ossb.model.OssbUser;
import com.ths.ossb.service.OssbUserService;
import com.ths.ossb.utils.SSLClient;

@RestController
@RequestMapping("/speech")
public class SpeechController extends BaseController{

	private static final Logger log = LoggerFactory.getLogger(SpeechController.class);
	
	@Autowired
	private OssbUserService ossbUserService;

	@RequestMapping("/gettoken")
	public String gettoken(){
		String subkey = "d3b7cbc0c49c42dfacc6bd622b9b145a";
		String region = "eastasia";
		String url = "https://" + region + ".api.cognitive.microsoft.com/sts/v1.0/issueToken";
		String token = "";
		
       HttpClient httpClient = null;
        HttpPost httpPost = null;
        String result = null;
        try{
            httpClient = new SSLClient();
            httpPost = new HttpPost(url);
            httpPost.addHeader("Content-Type", "application/json");
            httpPost.addHeader("Ocp-Apim-Subscription-Key", subkey);
            StringEntity se = new StringEntity("");
            se.setContentType("text/json");
            se.setContentEncoding(new BasicHeader("Content-Type", "application/json"));
            
            httpPost.setEntity(se);
            HttpResponse response = httpClient.execute(httpPost);
            if(response != null){
                HttpEntity resEntity = response.getEntity();
                if(resEntity != null){
                	token = EntityUtils.toString(resEntity,"UTF-8");
                }
            }
        }catch(Exception ex){
            ex.printStackTrace();
        }
        return token;		
		 
	}
	
}
