package com.saverfwd.backend.auth.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = EmailOrPhoneValidator.class)
public @interface EmailOrPhone {

    String message() default "Enter a valid email or phone number";

    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
