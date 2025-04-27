package com.IT_JUN_WE_55_team.paf.repository;

import com.IT_JUN_WE_55_team.paf.model.ProfileImage;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProfileImageRepository extends MongoRepository<ProfileImage, String> {
    ProfileImage findByUserId(String userId);
} 