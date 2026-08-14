package com.saverfwd.backend.auth.validation;

import com.saverfwd.backend.common.constant.RegexConstants;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class EmailOrPhoneValidator implements ConstraintValidator<EmailOrPhone, String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if(value==null || value.isBlank()){
            return false;
        }

        return value.matches(RegexConstants.EMAIL) || value.matches(RegexConstants.PHONE_NUMBER);
    }
}
