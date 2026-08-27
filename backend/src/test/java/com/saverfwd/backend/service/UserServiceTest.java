package com.saverfwd.backend.service;

import static org.junit.jupiter.api.Assertions.*;

import com.saverfwd.backend.user.dto.UserFilterRequest;
import com.saverfwd.backend.user.entity.User;
import com.saverfwd.backend.user.repository.UserRepository;
import com.saverfwd.backend.user.service.UserService;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.*;
import org.mockito.ArgumentMatchers;
import org.mockito.Mock;
import static org.mockito.Mockito.*;

import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

//@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class UserServiceTest{

    @Test
    public void test(){
        assertEquals(4,2+2);
    }

    @ParameterizedTest
    @CsvSource({
            "4,2,2",
            "2,1,3",
            "5,2,1"
    })
    public void test1(int res, int a,int b){
        assertEquals(res,a+b);
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "nnda",
            "dafaf",
            "f",
            "23"
    })
    public void test2(String name){
        assertTrue(name.length()>3);
    }

    @ParameterizedTest
    @ArgumentsSource(ArgumentSourceProvide.class)
    public void test3(String name){
        assertTrue(name.length()>3);
    }

//    @Autowired
//    private UserService userService;

//    @Autowired
//    private UserRepository userRepository;

    @Mock
    private static UserRepository userRepository;
//
//    @BeforeEach
//    void setUp(){
//        MockitoAnnotations.initMocks(this);
//    }

    @Test
    public void findUserByIdTest(){
        Optional<User> user=userRepository.findById(1L);
        assertNotNull(user);
    }

    @Test
    public void findUserByIdTest1(){
        when(userRepository.findById(ArgumentMatchers.anyLong())).thenReturn(Optional.of(User.builder()
                    .fullName("fafa")
                    .email("navneet@saverfwd.com")
            .build()));

        Optional<User> user=userRepository.findById(1L);
        assertNotNull(user);
    }
}
