package com.saverfwd.backend.auth.entity;

import com.saverfwd.backend.common.entity.BaseEntity;
import com.saverfwd.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "codes")
public class Otp extends BaseEntity {
    @Column(nullable = false, unique = true)
    private String otp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
