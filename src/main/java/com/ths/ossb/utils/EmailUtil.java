package com.ths.ossb.utils;

import java.util.Date;
import java.util.Properties;

import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMessage.RecipientType;


public class EmailUtil {


	public static void sendMail(String to, String code) throws AddressException, MessagingException{

		Properties props = new Properties();

		props.setProperty("mail.transport.protocol", "smtp");

		props.setProperty("mail.smtp.host", "smtp.163.com");

		props.setProperty("mail.smtp.port", "465");

		props.setProperty("mail.smtp.auth", "true");

		props.setProperty("mail.smtp.ssl.enable", "true");

		props.put("mail.debug", "true");
		Session session = Session.getDefaultInstance(props, new Authenticator(){
			@Override
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication("17691008810@163.com","wsc251314");
			}
		});

		Message message = new MimeMessage(session);

		message.setFrom(new InternetAddress("17691008810@163.com"));

		message.setRecipient(RecipientType.TO, new InternetAddress(to));

		message.setSubject("mail subject");

		message.setContent("<h1>main content</h1>","text/html;charset=UTF-8");

		message.setSentDate(new Date());

		Transport.send(message);
	}

}
