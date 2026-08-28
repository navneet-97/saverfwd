package com.saverfwd.backend.service;

import com.saverfwd.backend.common.exception.ResourceNotFoundException;
import com.saverfwd.backend.user.entity.User;
import com.saverfwd.backend.user.repository.UserRepository;
import com.saverfwd.backend.user.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest{

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Test
    public void shouldDeleteUser_WhenUserExist(){
        User user = new User();
        when(userRepository.findById(ArgumentMatchers.anyLong())).thenReturn(Optional.of(user));
        userService.deleteUser(1L);
        verify(userRepository).deleteById(1L);
    }

    @Test
    public void shouldThrowException_WhenUserDoesNotExist(){
        when(userRepository.findById(ArgumentMatchers.anyLong())).thenReturn(Optional.empty());
        assertThrows(
                ResourceNotFoundException.class,
                () -> userService.deleteUser(1L)
        );
        verify(userRepository).findById(1L);
        verify(userRepository, never()).deleteById(anyLong());
    }
}
