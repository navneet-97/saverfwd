package com.saverfwd.backend.food.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = CreateFoodRequestValidator.class)
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidCreateFoodRequest {
    String message() default "Invalid food listing";

    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
