package com.saverfwd.backend.auth.repository;

import com.saverfwd.backend.auth.entity.RefreshToken;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    @Modifying
    @Query("""
        UPDATE RefreshToken rt
        SET rt.revoked = true
        WHERE rt.token = :token
        AND rt.revoked = false
    """)
    void revokeIfActive(@Param("token") String token);

    @Modifying
    @Query("""
        UPDATE RefreshToken rt
        SET rt.revoked = true
        WHERE rt.user.id = :userId
    """)
    void revokeAllByUserId(@Param("userId") Long userId);
}
