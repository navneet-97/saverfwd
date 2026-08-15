package com.saverfwd.backend.auth.security;

import com.saverfwd.backend.common.constant.JwtConstants;
import com.saverfwd.backend.common.utils.Common;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractJti(String token) {
        return extractClaim(token, Claims::getId);
    }

    public Long extractVersion(String token) {
        return extractClaim(token, claims -> claims.get("version", Long.class));
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String generateToken(String username, long version) {
        return Jwts.builder()
                .subject(username)
                .id(Common.getSessionId())
                .claim("version", version)
                .issuedAt(new Date())
                .expiration(
                        new Date(System.currentTimeMillis()
                                + JwtConstants.ACCESS_TOKEN_EXPIRATION_TIME)
                )
                .signWith(getSignInKey(),  SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);

        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private SecretKey getSignInKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public long getRemainingTime(String token) {
        Date expiration = extractExpiration(token);
        long remainingTime = expiration.getTime() - System.currentTimeMillis();

        return Math.max(0, remainingTime);
    }
}
