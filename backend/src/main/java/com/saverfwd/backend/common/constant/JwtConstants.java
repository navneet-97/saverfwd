package com.saverfwd.backend.common.constant;

public final class JwtConstants {
    private JwtConstants() {}

    public static final long ACCESS_TOKEN_EXPIRATION_TIME = 24 * 60 * 60 * 1000L;

    public static final long REFRESH_TOKEN_EXPIRATION_TIME = 30L * 24 * 60 * 60 * 1000;
}
