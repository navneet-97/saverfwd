package com.saverfwd.backend.user.repository;

import com.saverfwd.backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByEmailOrPhoneNo(String email, String phoneNo);
    Optional<User> findByEmail(String email);
    Optional<User> findByPhoneNo(String phoneNo);
}
