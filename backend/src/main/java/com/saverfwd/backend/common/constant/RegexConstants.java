package com.saverfwd.backend.common.constant;

public final class RegexConstants {
    private RegexConstants() {}

    public static final String PHONE_NUMBER = "^[6-9]\\d{9}$";

    public static final String PASSWORD = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!]).{8,}$";

    public static final String EMAIL = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
}
