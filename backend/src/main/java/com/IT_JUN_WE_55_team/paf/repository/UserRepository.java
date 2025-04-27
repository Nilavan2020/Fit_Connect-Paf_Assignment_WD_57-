package com.IT_JUN_WE_55_team.paf.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.IT_JUN_WE_55_team.paf.model.User;

public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email);
} 