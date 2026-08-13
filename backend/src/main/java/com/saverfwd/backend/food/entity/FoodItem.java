package com.saverfwd.backend.food.entity;

import java.util.Date;

public class FoodItem {
    private int id;
    private int seller_id;
    private String title;
    private String description;
    private int quantity;
    private String food_type;
    private String listing_type;
    private double price;
    private Date expiry_time;
    private Date pickup_start;
    private Date pickup_end;
    private String location;
    private String status;
}
