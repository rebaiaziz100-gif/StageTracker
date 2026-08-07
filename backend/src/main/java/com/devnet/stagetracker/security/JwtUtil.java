package com.devnet.stagetracker.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long expirationTime;

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String genererToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extraireEmail(String token) {
        return extraireClaim(token, Claims::getSubject);
    }

    public Date extraireDateExpiration(String token) {
        return extraireClaim(token, Claims::getExpiration);
    }

    public <T> T extraireClaim(String token, Function<Claims, T> resolver) {
        Claims claims = extraireToutesLesClaims(token);
        return resolver.apply(claims);
    }

    private Claims extraireToutesLesClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean estExpire(String token) {
        return extraireDateExpiration(token).before(new Date());
    }

    public boolean estValide(String token, String email) {
        String emailDansToken = extraireEmail(token);
        return emailDansToken.equals(email) && !estExpire(token);
    }
}