package com.futureforge.ai.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateAccessToken(UserDetails userDetails) {
        return generateAccessToken(userDetails, false);
    }

    public String generateAccessToken(UserDetails userDetails, boolean rememberMe) {
        long expiration = rememberMe ? 30L * 24 * 60 * 60 * 1000 : accessTokenExpiration; // 30 days vs default
        return generateToken(new HashMap<>(), userDetails, expiration);
    }

    public String generateRefreshToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails, refreshTokenExpiration);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails, long expiration) {
        return Jwts.builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(
                java.util.Base64.getEncoder().encodeToString(secretKey.getBytes())
        );
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public long getAccessTokenExpiration() {
        return accessTokenExpiration;
    }

    public String generateAssessmentToken(String username, String domain, List<Integer> answerKey) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("domain", domain);
        claims.put("type", "ASSESSMENT");
        claims.put("answers", answerKey);

        return Jwts.builder()
                .claims(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 3600000)) // 1 hour validity
                .signWith(getSigningKey())
                .compact();
    }

    @SuppressWarnings("unchecked")
    public List<Integer> extractAssessmentAnswers(String token, String expectedUsername, String expectedDomain) {
        Claims claims = extractAllClaims(token);
        if (!"ASSESSMENT".equals(claims.get("type"))) {
            throw new com.futureforge.ai.exception.BadRequestException("Invalid assessment token type");
        }
        if (!expectedUsername.equals(claims.getSubject())) {
            throw new com.futureforge.ai.exception.BadRequestException("Assessment token does not belong to the current user");
        }
        if (expectedDomain != null && !expectedDomain.equalsIgnoreCase((String) claims.get("domain"))) {
            throw new com.futureforge.ai.exception.BadRequestException("Assessment token domain mismatch");
        }
        return (List<Integer>) claims.get("answers");
    }
}
