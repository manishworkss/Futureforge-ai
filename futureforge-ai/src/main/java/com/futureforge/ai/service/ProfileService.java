package com.futureforge.ai.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.futureforge.ai.dto.ProfileRequest;
import com.futureforge.ai.dto.ProfileResponse;
import com.futureforge.ai.entity.User;
import com.futureforge.ai.entity.UserProfile;
import com.futureforge.ai.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileService {

    private final UserProfileRepository userProfileRepository;
    private final ObjectMapper objectMapper;

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(User user) {
        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found for user: " + user.getEmail()));
        return mapToResponse(profile);
    }

    @Transactional
    public ProfileResponse updateProfile(User user, ProfileRequest request) {
        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElse(UserProfile.builder().user(user).build());

        profile.setSemester(request.getSemester());
        profile.setEducation(request.getEducation());
        profile.setCareerGoal(request.getCareerGoal());
        profile.setBio(request.getBio());

        try {
            if (request.getSkills() != null) {
                profile.setSkillsJson(objectMapper.writeValueAsString(request.getSkills()));
            } else {
                profile.setSkillsJson("[]");
            }

            if (request.getInterests() != null) {
                profile.setInterestsJson(objectMapper.writeValueAsString(request.getInterests()));
            } else {
                profile.setInterestsJson("[]");
            }
        } catch (JsonProcessingException e) {
            log.error("Error serializing profile arrays to JSON", e);
            throw new RuntimeException("Error processing profile data", e);
        }

        UserProfile savedProfile = userProfileRepository.save(profile);
        return mapToResponse(savedProfile);
    }

    private ProfileResponse mapToResponse(UserProfile profile) {
        List<String> skills = Collections.emptyList();
        List<String> interests = Collections.emptyList();

        try {
            if (profile.getSkillsJson() != null && !profile.getSkillsJson().isEmpty()) {
                skills = objectMapper.readValue(profile.getSkillsJson(), new TypeReference<List<String>>() {});
            }
            if (profile.getInterestsJson() != null && !profile.getInterestsJson().isEmpty()) {
                interests = objectMapper.readValue(profile.getInterestsJson(), new TypeReference<List<String>>() {});
            }
        } catch (JsonProcessingException e) {
            log.error("Error parsing JSON to arrays", e);
        }

        return ProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .fullName(profile.getUser().getFullName())
                .semester(profile.getSemester())
                .education(profile.getEducation())
                .skills(skills)
                .interests(interests)
                .careerGoal(profile.getCareerGoal())
                .bio(profile.getBio())
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public String buildProfileContext(User user) {
        try {
            ProfileResponse profile = getProfile(user);
            return String.format("Semester: %d\nEducation: %s\nSkills: %s\nInterests: %s\nCareer Goal: %s\nBio: %s",
                    profile.getSemester(),
                    profile.getEducation(),
                    String.join(", ", profile.getSkills()),
                    String.join(", ", profile.getInterests()),
                    profile.getCareerGoal(),
                    profile.getBio());
        } catch (Exception e) {
            return "No profile data available.";
        }
    }
}

