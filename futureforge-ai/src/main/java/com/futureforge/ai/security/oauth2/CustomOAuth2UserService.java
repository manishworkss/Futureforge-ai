package com.futureforge.ai.security.oauth2;

import com.futureforge.ai.entity.AuthAuditLog;
import com.futureforge.ai.entity.User;
import com.futureforge.ai.entity.UserProfile;
import com.futureforge.ai.entity.enums.AuthProvider;
import com.futureforge.ai.entity.enums.Role;
import com.futureforge.ai.repository.AuthAuditLogRepository;
import com.futureforge.ai.repository.UserProfileRepository;
import com.futureforge.ai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final AuthAuditLogRepository auditLogRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        try {
            return processOAuth2User(userRequest, oAuth2User);
        } catch (Exception ex) {
            log.error("Failed to process OAuth2 user", ex);
            throw new OAuth2AuthenticationException(ex.getMessage());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest oAuth2UserRequest, OAuth2User oAuth2User) {
        OAuth2UserInfo oAuth2UserInfo;
        String registrationId = oAuth2UserRequest.getClientRegistration().getRegistrationId();
        
        if (registrationId.equalsIgnoreCase("google")) {
            oAuth2UserInfo = new GoogleOAuth2UserInfo(oAuth2User.getAttributes());
        } else {
            throw new OAuth2AuthenticationException("Sorry! Login with " + registrationId + " is not supported yet.");
        }

        if (oAuth2UserInfo.getEmail() == null || oAuth2UserInfo.getEmail().isEmpty()) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }

        Optional<User> userOptional = userRepository.findByEmail(oAuth2UserInfo.getEmail());
        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
            boolean updated = false;
            
            // Account Linking Logic
            if (user.getProvider() == AuthProvider.LOCAL) {
                log.info("Linking LOCAL account {} to Google OAuth2", user.getEmail());
                user.setProvider(AuthProvider.GOOGLE);
                user.setProviderId(oAuth2UserInfo.getId());
                updated = true;
            }
            
            // Ensure profile exists (migration/safety)
            if (user.getProfile() == null) {
                log.info("Creating missing profile for existing user: {}", user.getEmail());
                UserProfile profile = UserProfile.builder()
                        .user(user)
                        .build();
                user.setProfile(profile);
                updated = true;
            }
            
            if (updated) {
                user = userRepository.save(user);
            }
        } else {
            // New user via OAuth2
            log.info("Creating new user via Google OAuth2: {}", oAuth2UserInfo.getEmail());
            user = registerNewOAuth2User(oAuth2UserInfo);
        }

        logAudit(user.getEmail(), "OAUTH2_LOGIN_SUCCESS", "OAUTH2");

        return new CustomOAuth2User(user, oAuth2User.getAttributes());
    }

    private User registerNewOAuth2User(OAuth2UserInfo oAuth2UserInfo) {
        User user = User.builder()
                .fullName(oAuth2UserInfo.getName())
                .email(oAuth2UserInfo.getEmail())
                .provider(AuthProvider.GOOGLE)
                .providerId(oAuth2UserInfo.getId())
                .emailVerified(true)
                .role(Role.USER)
                .isActive(true)
                .passwordHash(java.util.UUID.randomUUID().toString()) // Set dummy password for OAuth2 users
                .build();
        
        // Create empty profile and link it bidirectionally
        UserProfile profile = UserProfile.builder()
                .user(user)
                .build();
        user.setProfile(profile);

        // Transactionally save both user and profile due to CascadeType.ALL on user.profile
        return userRepository.save(user);
    }

    private void logAudit(String email, String action, String ipAddress) {
        AuthAuditLog auditLog = AuthAuditLog.builder()
                .userEmail(email)
                .action(action)
                .ipAddress(ipAddress)
                .build();
        auditLogRepository.save(auditLog);
    }
}
