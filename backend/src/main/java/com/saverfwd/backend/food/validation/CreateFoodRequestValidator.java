package com.saverfwd.backend.food.validation;

import com.saverfwd.backend.food.dto.CreateFoodRequest;
import com.saverfwd.backend.food.enums.ListingType;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.LocalDateTime;

public class CreateFoodRequestValidator implements ConstraintValidator<ValidCreateFoodRequest, CreateFoodRequest> {

    @Override
    public boolean isValid(CreateFoodRequest request, ConstraintValidatorContext context) {
        if (request==null) {
            return true;
        }

        boolean valid = true;
        context.disableDefaultConstraintViolation();

        LocalDateTime pickupStartTime = request.pickupStartTime();
        LocalDateTime pickupEndTime = request.pickupEndTime();
        LocalDateTime expiryTime = request.expiryTime();

        if(pickupStartTime != null && pickupEndTime !=null && !pickupStartTime.isBefore(pickupEndTime)) {
            addViolation(context,"pickStartTime","Pickup start time should be before end time");
            valid=false;
        }

        if(pickupEndTime != null && expiryTime!= null && !pickupEndTime.isBefore(expiryTime)) {
            addViolation(context,"pickupEndTime","Pickup end time should be before expiry time");
            valid=false;
        }

        if(request.listingType()!=null){
            if(request.listingType()== ListingType.SALE){
                if(request.price()==null || request.price().signum()<=0){
                    addViolation(context,"price","Price must be greater than 0 for paid listings");
                    valid=false;
                }
            } else if (request.listingType()==ListingType.DONATION) {
                if(request.price()!=null && request.price().signum()>0){
                    addViolation(context,"price","Free listings cannot have a price");
                    valid=false;
                }
            }
        }

        return valid;
    }

    private void addViolation(ConstraintValidatorContext context, String field, String message) {
        context.buildConstraintViolationWithTemplate(message)
                .addPropertyNode(field)
                .addConstraintViolation();
    }
}
